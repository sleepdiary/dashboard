<template>
    <v-main
        style="padding-bottom:56px"
    >

        <div style="height:100%;max-width:600px;margin:auto" class="d-flex flex-column justify-center">

            <v-list>

                <v-subheader>Statistics</v-subheader>

                <v-list-item>
                    <v-list-item-content>

                        <v-simple-table v-if="recent_began">
                            <template v-slot:default>

                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Recent</th>
                                        <th>Long-term</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <th>Date began</th>
                                        <td>{{recent_began}}</td>
                                        <td>{{long_term_began}}</td>
                                    </tr>

                                    <tr
                                        v-for="schedules in schedule_list"
                                        :key="schedules[3]"
                                    >
                                        <th>{{schedules[3]}}</th>
                                        <td v-if="schedules[0]">
                                            <span title="average">{{schedules[2] ? schedules[0].mean.toFixed(2) : to_duration(schedules[0].mean)}}</span>
                                            ±
                                            <span title="standard deviation">{{schedules[2] ? schedules[0].standard_deviation.toFixed(2) : to_duration(schedules[0].standard_deviation)}}</span>
                                        </td>
                                        <td v-else>(no data)</td>
                                        <td v-if="schedules[1]">
                                            <span title="average">{{schedules[2] ? schedules[1].mean.toFixed(2) : to_duration(schedules[1].mean)}}</span>
                                            ±
                                            <span title="standard deviation">{{schedules[2] ? schedules[1].standard_deviation.toFixed(2) : to_duration(schedules[1].standard_deviation)}}</span>
                                        </td>
                                        <td v-else>(no data)</td>
                                    </tr>

                                    <tr>
                                        <th>Timezone</th>
                                        <td colspan="2">
                                            <v-autocomplete v-model="timezone" :items="timezones"/>
                                        </td>
                                    </tr>

                                </tbody>
                            </template>
                        </v-simple-table>

                    </v-list-item-content>

                </v-list-item>

                <v-list-item-group>

                    <v-subheader>
                        Sleep Chart
                        <v-spacer></v-spacer>

                        <v-menu
                          bottom
                          left
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  dark
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="sleep_chart_tab='root'"
                                >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-tabs
                              v-model="sleep_chart_tab"
                              style="width:270px"
                              height="0"
                            >
                                <v-tabs-items v-model="sleep_chart_tab">
                                    <v-tab-item :transition="false" value="root">

                                        <v-list>
                                            <v-list-item @click.stop="sleep_chart_tab='theme'">
                                                <v-list-item-icon><v-icon>mdi-theme-light-dark</v-icon></v-list-item-icon>
                                                <v-list-item-content><v-list-item-title>Theme: {{sleep_chart_theme}}</v-list-item-title></v-list-item-content>
                                                <v-list-item-action>
                                                    <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                </v-list-item-action>
                                            </v-list-item>
                                            <v-list-item @click.stop="sleep_chart_tab='start'">
                                                <v-list-item-icon><v-icon>mdi-clock</v-icon></v-list-item-icon>
                                                <v-list-item-content><v-list-item-title>Start at: {{sleep_chart_start?'6pm':'midnight'}}</v-list-item-title></v-list-item-content>
                                                <v-list-item-action>
                                                    <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                </v-list-item-action>
                                            </v-list-item>
                                            <v-list-item @click.stop="sleep_chart_tab='sort'">
                                                <v-list-item-icon><v-icon>mdi-sort-calendar-ascending</v-icon></v-list-item-icon>
                                                <v-list-item-content><v-list-item-title>Sort by: {{sleep_chart_reverse?'oldest first':'newest first'}}</v-list-item-title></v-list-item-content>
                                                <v-list-item-action>
                                                    <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-tab-item>

                                    <v-tab-item :transition="false" value="theme">
                                        <v-toolbar flat>
                                            <v-btn icon @click.stop="sleep_chart_tab = 'root'">
                                                <v-icon>mdi-arrow-left</v-icon>
                                            </v-btn>

                                            <v-toolbar-title>Choose theme</v-toolbar-title>
                                        </v-toolbar>
                                        <v-divider/>
                                        <v-list>
                                            <v-list-item-group v-model="sleep_chart_theme">
                                                <v-list-item value="dark">
                                                    <v-list-item-content>
                                                        <v-list-item-title>Dark</v-list-item-title>
                                                        <v-list-item-subtitle>Easier to view in bed</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item value="light">
                                                    <v-list-item-content>
                                                        <v-list-item-title>Light</v-list-item-title>
                                                        <v-list-item-subtitle>Looks better in print</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-tab-item>

                                    <v-tab-item :transition="false" value="start">
                                        <v-toolbar flat>
                                            <v-btn icon @click.stop="sleep_chart_tab = 'root'">
                                                <v-icon>mdi-arrow-left</v-icon>
                                            </v-btn>

                                            <v-toolbar-title>Start time</v-toolbar-title>
                                        </v-toolbar>
                                        <v-divider/>
                                        <v-list>
                                            <v-list-item-group v-model="sleep_chart_start">
                                                <v-list-item :value="64800000">
                                                    <v-list-item-content>
                                                        <v-list-item-title>6pm</v-list-item-title>
                                                        <v-list-item-subtitle>Used by many sleep doctors</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item :value="0">
                                                    <v-list-item-content>
                                                        <v-list-item-title>Midnight</v-list-item-title>
                                                        <v-list-item-subtitle>Used by most lay people</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-tab-item>

                                    <v-tab-item :transition="false" value="sort">
                                        <v-toolbar flat>
                                            <v-btn icon @click.stop="sleep_chart_tab = 'root'">
                                                <v-icon>mdi-arrow-left</v-icon>
                                            </v-btn>

                                            <v-toolbar-title>Sort by&mldr;</v-toolbar-title>
                                        </v-toolbar>
                                        <v-divider/>
                                        <v-list>
                                            <v-list-item-group v-model="sleep_chart_reverse">
                                                <v-list-item :value="true">
                                                    <v-list-item-content>
                                                        <v-list-item-title>Oldest first</v-list-item-title>
                                                        <v-list-item-subtitle>Earliest entries will appear at the top</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item :value="false">
                                                    <v-list-item-content>
                                                        <v-list-item-title>Newest first</v-list-item-title>
                                                        <v-list-item-subtitle>Latest entries will appear at the top</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-tab-item>

                                </v-tabs-items>
                            </v-tabs>

                        </v-menu>
                    </v-subheader>

                    <v-list-item>
                        <v-list-item-content v-html="chart_svg[0]" @click="show_svg(chart_svg[1],'Recent sleep graph')" />
                    </v-list-item>

                    <template v-if="event_svg">
                        <v-subheader>Sleep-related events</v-subheader>
                        <v-list-item>
                            <v-list-item-content v-html="event_svg" @click="show_svg(event_svg,'Sleep-related events')" />
                        </v-list-item>
                    </template>

                    <v-subheader>Reports</v-subheader>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-file-excel</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content @click="generate_predictions()">
                            <v-list-item-title>Predict upcoming sleeps</v-list-item-title>
                            <v-list-item-subtitle>Spreadsheet based on average day length</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-file-pdf</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content @click="generate_report()">
                            <v-list-item-title>Printable report</v-list-item-title>
                            <v-list-item-subtitle>For sleep doctors</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                <v-subheader v-if="patterns.length">Possible patterns</v-subheader>

                <v-list-item
                    v-for="pattern in patterns"
                    :key="pattern.id"
                    :href="wiki_url+pattern.id"
                >
                    <v-list-item-icon>
                        <v-icon>{{pattern.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{pattern.message}}</v-list-item-title>
                        <v-list-item-subtitle>See advice on the wiki</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                </v-list-item-group>

                <v-dialog
                    v-model="dialog"
                    scrollable
                >
                    <v-card
                        color="#000022"
                    >
                        <v-card-title class="text-h5">
                            {{dialog_title}}
                        </v-card-title>

                        <v-card-text style="max-height:70vh" v-html="dialog_svg"/>

                        <v-card-actions>
                            <v-btn
                                width="50%"
                                text
                                @click="download_svg"
                            >
                                <v-icon>mdi-download</v-icon>
                                Download
                            </v-btn>
                            <v-btn
                                color="primary"
                                width="50%"
                                text
                                @click="dialog = false"
                            >
                                <v-icon>mdi-close</v-icon>
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-list>

        </div>

    </v-main>
</template>

<script>

 import diary_manager from "@/diary_manager.js";
 import { WIKI_URL } from "@/constants.js";
 import Worker from 'worker-loader!@/info';

 const ONE_HOUR = 1000*60*60;

 export default {
     name: 'Info',

     data: () => ({
         timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
         timezones: [ new Intl.DateTimeFormat().resolvedOptions().timeZone ],
         //recent: {}, // NO!  Making this reactive takes a long time, for no benefit
         recent_began: '',
         //long_term: {}, // NO!  Making this reactive takes a long time, for no benefit
         long_term_began: '',
         software_version: '',
         update_timeout: null,
         latest_primary_sleep: [],
         schedule_list: [],
         chart_svg: ['',''],
         event_svg: '',
         dialog_svg: [ '', '' ],
         patterns: [],
         dialog: false,
         dialog_title: '',
         awake_at: 0,
         asleep_at: 0,
         day_length: 0,
         wiki_url: WIKI_URL,
         worker: new Worker(),
         sleep_chart_tab: 'root',
         sleep_chart_theme: 'dark',
         sleep_chart_start: 64800000,
         sleep_chart_reverse: true,
     }),

     mounted() {
         this.worker.onmessage = ({data}) => {
             switch ( data[0] ) {
                 case 0: // progress
                     this.$emit("progress",data[1]);
                     break;
                 case 1: // success
                     this.timezones        = data[1];
                     this.software_version = data[2];
                     this.recent           = data[3];
                     this.long_term        = data[4];
                     this.event_svg        = data[5];
                     this.patterns         = data[6];
                     this.chart_svg        = [ data[7], data[8] ];

                     this.   recent_began = this.recent   .activities[0].id.split("T")[0];
                     this.long_term_began = this.long_term.activities[0].id.split("T")[0];

                     this.schedule_list = [
                         [ this.recent.summary_asleep, this.long_term.summary_asleep, 0, "Total Sleep Time" ],
                         [ this.recent.schedule.wake , this.long_term.schedule.wake , 0, "Wake At" ],
                         [ this.recent.schedule.sleep, this.long_term.schedule.sleep, 0, "Asleep At" ],
                         [ this.recent.summary_days  , this.long_term.summary_days  , 0, "Day Length" ],
                         [ this.recent.sleeps_per_day, this.long_term.sleeps_per_day, 1, "Sleeps Per Day" ],
                         [ this.recent.meds_per_day  , this.long_term.meds_per_day  , 1, "Medications Per Day" ],
                     ];

                     this.$emit("idle");

                     break;
                 default: // error
                     this.$emit("error",data[1]);
                     break;
             }
         };
         this.$emit('retitle',"Info");
         this.update_settings();
         diary_manager.on_init( () => {
             if ( diary_manager.get_diaries().length ) {
                 this.update_diary();
             } else {
                 this.$emit("idle");
                 this.$router.replace({ path: '/' });
             }
         });
     },

     watch: {
         timezone           () { this.update_settings(); },
         sleep_chart_theme  () { this.update_settings(); },
         sleep_chart_start  () { this.update_settings(); },
         sleep_chart_reverse() { this.update_settings(); },
     },

     methods: {

         fix_timezone(time) {
             return new Date(new Intl.DateTimeFormat(
                 // resembles an ISO date, see https://stackoverflow.com/questions/25050034/get-iso-8601-using-intl-datetimeformat
                 'sv-SE',
                 {
                     year  : 'numeric',
                     month : 'numeric',
                     day   : 'numeric',
                     hour  : 'numeric',
                     minute: 'numeric',
                     second: 'numeric',
                     dayPeriod: 'long',
                     timeZone : this.timezone
                 }
             ).format(time));
         },

         update_diary() {
             this.worker.postMessage([
                 'diary',
                 diary_manager.merge_diaries().to("storage-line")
             ]);
         },

         generate_predictions() {
             window.prediction_spreadsheet(
                 new window.ExcelJS.Workbook(),
                 this.recent
             ).xlsx.writeBuffer().then(
                 buffer => this.download_item(
                     "Sleep Predictions.xlsx",
                     URL.createObjectURL( new Blob([buffer]) )
                 )
             );
         },

         generate_report() {

             const report = window.sleepdiary_report({
                 pdf: new window.jspdf.jsPDF(),
                 timezone: this.timezone,
                 software_version: this.software_version,
                 recent: this.recent,
                 long_term: this.long_term,
             });

             this.download_item(
                 report.filename,
                 report.pdf.output('datauristring', { filename: report.filename })
             );

         },

         show_svg(svg,filename) {
             this.dialog_svg = svg;
             this.dialog_title = filename;
             this.dialog = true;
         },

         download_svg() {
             this.dialog = false;
             this.download_item(
                 this.dialog_title+".svg",
                 'data:image/svg+xml;base64,' + btoa(this.dialog_svg)
             );
         },

         download_item(filename,contents) {
             var a = document.createElement("A");
             a.setAttribute( "download", filename );
             a.setAttribute( "href", contents );
             a.click();
         },

         to_duration(value) {
             const hours = Math.floor( value / ONE_HOUR ),
                   minutes = Math.floor( value / (60*1000) ) % 60
             ;
             return (
                 hours +
            ( minutes < 10 ? ":0" : ":" ) +
                 minutes
             );
         },

         to_approximate_time(value) {
             const time = new Date(value),
                   hour = time.getHours(),
                   date = time.toLocaleDateString() + ", "
             ;
             switch ( hour ) {
                 case 0:
                     return date + "midnight-01:00";
                 case 9:
                     return date + "0" + hour + ":00-" + (hour+1) + ":00";
                 case 23:
                     return date + "23:00-midnight";
                 default:
                     if ( hour < 9 ) {
                         return date + "0" + hour + ":00-0" + (hour+1) + ":00";
                     } else {
                         return date +       hour + ":00-"  + (hour+1) + ":00";
                     }
             }
         },

         update_settings() {
             this.$emit("busy");
             this.worker.postMessage([
                 'settings',
                 this.timezone,
                 this.sleep_chart_theme,
                 this.sleep_chart_start,
                 this.sleep_chart_reverse,
             ]);
         },

     },

 }
</script>
