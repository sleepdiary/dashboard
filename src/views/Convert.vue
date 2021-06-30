<template>
    <v-main
        style="padding-bottom:56px"
    >

        <div style="height:100%" class="d-flex flex-column justify-center">
            <v-list
                style="margin:auto;padding:1em;width:400px;max-width:100%"
                one-line
            >

                <v-list-item
                    v-for="engine in sleepdiary_engines"
                    @click="save_with(engine)"
                    :key="engine.name"
                >
                    <v-list-item-avatar
                    >
                        <v-icon v-if="engine.icon">{{engine.icon}}</v-icon>
                        <v-img v-else-if="engine.logo" :src="engine.logo"/>
                        <span
                            v-else
                        >
                            {{engine.name.substr(0,1)}}
                        </span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{engine.title}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                    @click="save_as_spreadsheet"
                >
                    <v-list-item-avatar
                    >
                        <v-img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg"/>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>Spreadsheet</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>
        </div>

    </v-main>
</template>

<script>

 import diary_manager from "@/diary_manager.js";

 export default {

     name: 'Convert',

     data: () => ({
         sleepdiary_engines: window
             .sleepdiary_engines
             .filter( engine => !/^(ActivityLog|Standard|Spreadsheet(?:Graph|Table))$/.test(engine.name) )
             .sort( (a,b) => a.title.localeCompare(b.title) ),
         format_info: {},
     }),

     methods: {
         save_with(engine) {
             this.$emit("busy");
             this.diary.to_async(engine.name).then(
                 diary => diary.to_async("output").then( output => {
                     this.$emit("idle");
                     const a = document.createElement("a");
                     a.setAttribute( "href", window.DiaryLoader.to_url(output) );
                     a.setAttribute("download", "diary" + engine.extension);
                     a.click();
                 })
             );
         },
         save_as_spreadsheet() {
             this.$emit("busy");
             this.diary.to_async("spreadsheet").then( output => {
                 this.$emit("idle");
                 const a = document.createElement("a");
                 a.setAttribute(
                     "href",
                     URL.createObjectURL(
                         new Blob([output])
                     )
                 );
                 a.setAttribute("download", "diary.xlsx");
                 a.click();
             });
         },
     },

     mounted() {
         this.$emit('retitle',"Save As...");
         this.$emit("busy");
         diary_manager.on_init( () => {
             this.$emit("idle");
             if ( diary_manager.get_diaries().length ) {
                 this.diary = diary_manager.merge_diaries();
                 this.format_info = this.diary ? this.diary.format_info() : 0;
             } else {
                 this.$router.replace({ path: '/' });
             }
         });
     },

 }
</script>
