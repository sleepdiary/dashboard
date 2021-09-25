<template>
    <v-main
        style="padding-bottom:56px"
    >

        <div style="display:none">
            <input
                type="file"
                ref="opener"
                :accept="supported_extensions"
                @change="add_diary"
            >
        </div>

        <div style="height:100%;margin:auto;max-width:600px" class="d-flex flex-column justify-center">
            <v-list
                style="margin:auto;padding:1em"
                v-if="diaries.length"
                two-line
            >
                <v-list-item
                    v-for="[id,diary,engine] in diaries"
                    :key="id"
                >
                    <v-list-item-avatar>
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

                        <v-list-item-subtitle>Last updated {{get_last_update(diary)}}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action @click="remove_diary(id)">
                        <v-btn icon>
                            <v-icon>
                                mdi-delete
                            </v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>

            <div class="mt-8" style="text-align:center">

                <v-btn
                    color="primary"
                    @click="$refs.opener.click()"
                >
                    Add a diary or spreadsheet
                </v-btn>

                <p class="mt-6">See <a :href="docs_url">the docs</a> for more information,<br>including supported formats<br>and how to create a diary</p>

            </div>

        </div>

        <v-dialog
            v-model="error"
            width="400"
        >

            <v-card>
                <v-card-title class="text-h5">
                    Could not load diary
                </v-card-title>

                <v-card-text>
                    This file does not appear to be in a supported format.<br>
                    Please try a different file.
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        color="primary"
                        width="100%"
                        text
                        @click="error = false"
                    >
                        <v-icon>mdi-close</v-icon>
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

    </v-main>

</template>

<script>

import diary_manager from "@/diary_manager.js";
import { DOCS_URL } from "@/constants.js";

export default {

     name: 'Load',

     data: () => ({
         supported_extensions: (
             window.sleepdiary_engines.map( f => f.extension ).join(",")
             + ',.sqlite,.db,History'
         ),
         sleepdiary_engines: (
             window.sleepdiary_engines
                   .filter( engine => engine.name != 'Standard' && engine.name != "ActivityLog" )
                   .sort( (a,b) => a.title.localeCompare(b.title) )
         ),
         activity_log: (
             window.sleepdiary_engines
                   .filter( engine => engine.name == "ActivityLog" )
         )[0],
         trigger_rebuild: 1,
         error: false,
         docs_url: DOCS_URL,
     }),

     computed: {
         diaries() {
             return this.trigger_rebuild && diary_manager.get_diaries();
         },
     },

     mounted() {
         this.$emit('retitle',"Load diary");
         this.$emit("busy");
         diary_manager.on_init( (is_only_diary,is_error) => this.on_diary_load(is_only_diary,is_error) );
         diary_manager.add_permanent_callback( 'load', (is_only_diary,is_error) => this.on_diary_load(is_only_diary,is_error) );
     },

     methods: {
         on_diary_load(is_only_diary,is_error) {
             this.$emit("idle");
             if ( is_error ) {
                 this.error = true;
             }  else if ( is_only_diary ) {
                 this.$router.push({ path: '/info' });
             } else {
                 ++this.trigger_rebuild;
             }
         },
         add_diary(event) {
             this.$emit("busy");
             diary_manager.add_diary(event);
         },
         get_last_update(diary) {
             const records = diary.to("Standard").records;
             return records.length ? new Date(records[records.length-1].end||records[records.length-1].start).toISOString().split("T")[0] : "(never)"
         },
         remove_diary(id) {
             diary_manager.remove_diary(id);
             ++this.trigger_rebuild;
         }
     },

 }
</script>
