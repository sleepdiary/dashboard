<template>

    <v-app>
        <router-view
            @retitle="title=$event"
            @busy="busy=true;progress=''"
            @progress="progress=$event+'%'"
            @error="busy=false;throw $event"
            @idle="busy=false"
        />

        <v-dialog
            v-model="error_dialog"
            width="400"
        >
            <v-card>
                <v-card-title>
                    <v-icon
                        large
                        left
                    >
                        mdi-emoticon-sad
                    </v-icon>
                    An error occurred
                </v-card-title>

                <v-card-text>
                    Something went wrong with the app.<br>
                    Please report the issue so we can fix it.

                    <v-list dense>
                        <v-list-group>
                            <template v-slot:activator>
                                <v-list-item-title>Advanced</v-list-item-title>
                            </template>
                            <v-list-item>
                                <v-list-item-content style="word-wrap:anywhere">
                                    {{error_text}}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </v-card-text>

                <v-card-actions>

                    <v-btn
                        color="primary"
                        width="50%"
                        text
                        :href="project_url+'dashboard/issues/new?title=App+threw+an+error&body='+encodeURIComponent(error)"
                    >
                        <v-icon>mdi-bug</v-icon>
                        Report this bug
                    </v-btn>
                    <v-btn
                        color="primary"
                        width="50%"
                        text
                        @click="reload"
                    >
                        <v-icon>mdi-refresh</v-icon>
                        Reload page
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-bottom-navigation
            v-model="section"
            color="primary"
            grow
            fixed
        >
            <v-btn value="Load" to="/">
                <span>Load</span>
                <v-icon>mdi-calendar-import</v-icon>
            </v-btn>
            <v-btn value="Info" to="/info" :disabled="need_diary">
                <span>Info</span>
                <v-icon>mdi-chart-timeline</v-icon>
            </v-btn>
            <v-btn value="Convert" to="/convert" :disabled="need_diary">
                <span>Convert</span>
                <v-icon>mdi-calendar-export</v-icon>
            </v-btn>
            <v-btn value="About" to="/about">
                <span>About</span>
                <v-icon>mdi-information</v-icon>
            </v-btn>
        </v-bottom-navigation>

        <v-overlay :value="busy">
            <v-progress-circular
                indeterminate
                color="primary"
                size="100"
            >
                {{progress}}
            </v-progress-circular>
        </v-overlay>

</v-app>
</template>

<script>

 import router from "./router/index.js";

 import diary_manager from "@/diary_manager.js";

 import { PROJECT_URL } from "@/constants.js";

export default {

     name: 'App',

     data: () => ({
         section: "Load",
         title: "Dashboard",
         need_diary: true,
         busy: false,
         progress: undefined,
         project_url: PROJECT_URL,
         error_dialog: 0,
         error_text: '',
         error: '',
     }),

     mounted() {

         diary_manager.add_permanent_callback( 'app', () => {
             this.need_diary = !diary_manager.get_diaries().length;
         });

         this.section = router.currentRoute.name;
         document.title = this.section + ' - Sleep Diary Dashboard';

         router.afterEach( to => {
             this.busy = false;
             this.section = to.name;
             document.title = this.section + ' - Sleep Diary Dashboard';
         });

     },

     errorCaptured(err) {
         this.error_text = JSON.stringify(Object.getOwnPropertyNames(err).map( name => [ name, err[name] ] ), null, ' ');
         this.error = (
             "Let us know what you were doing when this bug happened:\n" +
             "\n\n\n\n\n" +
             "Technical information:\n" +
             "Browser: " + navigator.userAgent + "\n" +
             "Location: " + window.location + "\n" +
             "Error message:\n" +
             this.error_text
         );
         this.error_dialog = true;
     },

     methods: {
         reload() {
             diary_manager.clear();
             location.reload();
         },
     },

 };

</script>
