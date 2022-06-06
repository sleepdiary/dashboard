<template>
    <v-main
        style="padding-bottom:56px"
    >

        <div style="height:100%;max-width:600px;margin:auto" class="d-flex flex-column justify-center">

            <v-list>

                <v-subheader>

                    Statistics

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
                              @click="statistics_tab='root'"
                            >
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-list flat>
                            <v-list-item-group
                              v-model="statistics_options"
                              multiple
                            >
                                <template
                                  v-for="option in statistics_option_names"
                                >
                                    <v-list-item
                                      :key="option"
                                      @click.stop=""
                                      :value="option"
                                    >
                                        <template v-slot:default="{ active }">
                                            <v-list-item-action>
                                                <v-checkbox
                                                  :input-value="active"
                                                />
                                            </v-list-item-action>
                                            <v-list-item-content><v-list-item-title>Show {{statistics_option_titles[option]}}</v-list-item-title></v-list-item-content>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>

                </v-subheader>

                <v-list-item>
                    <v-list-item-content>

                        <v-simple-table v-if="recent_began">
                            <template v-slot:default>

                                <thead>
                                    <tr>
                                        <th></th>
                                        <th style="text-align:center" colspan="3">Recent</th>
                                        <th style="text-align:center" colspan="3">Long-term</th>
                                        <th v-if="statistics_options.includes('infos')"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <v-slide-x-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='dates'"
                                          @click="toggle_stats_info('dates')"
                                          class="stats-below"
                                        >
                                            <td
                                              colspan="8"
                                              style="text-align:right"
                                            >
                                                This column is based on your entire diary, from <em>{{long_term_began}}</em> to <em>{{ended}}</em>.<br/>
                                                It's useful for spotting long-term trends in your sleeping pattern.
                                            </td>
                                        </tr>
                                    </v-slide-x-transition>
                                    <v-slide-x-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='dates'"
                                          @click="toggle_stats_info('dates')"
                                          class="stats-arrows"
                                        >
                                            <td colspan="5"></td>
                                            <td class="stats-plus-minus"><v-icon small>mdi-arrow-down-bold</v-icon></td>
                                            <td colspan="2"></td>
                                        </tr>
                                    </v-slide-x-transition>
                                    <tr
                                      @click="toggle_stats_info('dates')"
                                    >
                                        <th>
                                            <span class="wide">Date began</span>
                                            <span class="narrow">Began</span>
                                        </th>
                                        <td style="text-align:center" colspan="3">{{recent_began}}</td>
                                        <td style="text-align:center" colspan="3">{{long_term_began}}</td>
                                        <td class="hpad-unless-narrow" v-if="statistics_options.includes('infos')">
                                            <v-btn icon>
                                                <v-icon>mdi-information</v-icon>
                                            </v-btn>
                                        </td>

                                    </tr>
                                    <v-slide-x-reverse-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='dates'"
                                          @click="toggle_stats_info('dates')"
                                          class="stats-arrows stats-below"
                                        >
                                            <td colspan="2"></td>
                                            <td class="stats-plus-minus"><v-icon small>mdi-arrow-up-bold</v-icon></td>
                                            <td colspan="5"></td>
                                        </tr>
                                    </v-slide-x-reverse-transition>
                                    <v-slide-x-reverse-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='dates'"
                                          @click="toggle_stats_info('dates')"
                                        >
                                            <td
                                              colspan="8"
                                            >
                                                This column just shows data for the {{Math.round( ( new Date(ended) - new Date(recent_began).getTime() ) / (24*60*60*1000) )+1}} days between <em>{{recent_began}}</em> and <em>{{ended}}</em>.<br/>
                                                It's useful for understanding your situation right now.
                                            </td>
                                        </tr>
                                    </v-slide-x-reverse-transition>

                                    <template
                                        v-for="schedules in ( statistics_options.includes('borings') ? schedule_list : schedule_list.filter( s => !s[6] ) )"
                                    >

                                        <v-slide-x-transition
                                          :key="'above-'+schedules[3]"
                                        >
                                            <tr
                                              v-show="statistics_options.includes('infos')&&stats_info==schedules"
                                              @click="toggle_stats_info(schedules)"
                                              class="stats-below"
                                            >
                                                <td
                                                  colspan="8"
                                                  v-if="schedules[0]"
                                                  style="text-align:right"
                                                  v-html="to_description(schedules,1)"
                                                />
                                            </tr>
                                        </v-slide-x-transition>
                                        <v-slide-x-transition
                                          :key="'down-'+schedules[3]"
                                        >
                                            <tr
                                              v-show="statistics_options.includes('infos')&&stats_info==schedules"
                                              @click="toggle_stats_info(schedules)"
                                              class="stats-arrows"
                                            >
                                                <td colspan="5"></td>
                                                <td class="stats-plus-minus"><v-icon small>mdi-arrow-down-bold</v-icon></td>
                                                <td colspan="2"></td>
                                            </tr>
                                        </v-slide-x-transition>
                                        <tr
                                          :key="'main-'+schedules[3]"
                                          @click="toggle_stats_info(schedules)"
                                              :style="schedules[6] ? 'opacity:0.5' : ''"
                                        >
                                            <th>
                                                <span class="wide">{{schedules[3]}}</span>
                                                <span class="narrow">{{schedules[4]}}</span>
                                            </th>
                                            <template v-if="schedules[0]">
                                                <td class="stats-average">{{to_value( schedules[2], schedules[0].mean )}}</td>
                                                <td class="stats-plus-minus space-unless-narrow">±</td>
                                                <td class="stats-sd">{{to_value( schedules[2]&1, schedules[0].standard_deviation )}}</td>
                                            </template>
                                            <td
                                              style="text-align:center"
                                              colspan="3"
                                              v-else
                                            >
                                                (no data)
                                            </td>
                                            <template v-if="schedules[1]">
                                                <td class="stats-average">{{to_value( schedules[2], schedules[1].mean )}}</td>
                                                <td class="stats-plus-minus space-unless-narrow">±</td>
                                                <td class="stats-sd">{{to_value( schedules[2]&1, schedules[1].standard_deviation )}}</td>
                                            </template>
                                            <td
                                              colspan="3"
                                              style="text-align:center"
                                              v-else
                                            >
                                                (no data)
                                            </td>
                                            <td class="hpad-unless-narrow" v-if="statistics_options.includes('infos')">
                                                <v-btn icon>
                                                    <v-icon>mdi-information</v-icon>
                                                </v-btn>
                                            </td>

                                        </tr>
                                        <v-slide-x-reverse-transition
                                          :key="'up-'+schedules[3]"
                                        >
                                            <tr
                                              v-show="statistics_options.includes('infos')&&stats_info==schedules"
                                              @click="toggle_stats_info(schedules)"
                                              class="stats-arrows stats-below"
                                            >
                                                <td colspan="2"></td>
                                                <td class="stats-plus-minus"><v-icon small>mdi-arrow-up-bold</v-icon></td>
                                                <td colspan="5"></td>
                                            </tr>
                                        </v-slide-x-reverse-transition>
                                        <v-slide-x-reverse-transition
                                          :key="'below-'+schedules[3]"
                                        >
                                            <tr
                                              v-show="statistics_options.includes('infos')&&stats_info==schedules"
                                              @click="toggle_stats_info(schedules)"
                                            >
                                                <td
                                                  colspan="8"
                                                  v-html="to_description(schedules,0)"
                                                />
                                            </tr>
                                        </v-slide-x-reverse-transition>

                                    </template>

                                    <v-slide-x-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='tz'"
                                          @click="toggle_stats_info('tz')"
                                          class="stats-below"
                                        >
                                            <td
                                              colspan="8"
                                              style="text-align:right"
                                            >
                                                <template v-if="manual_timezone_required">
                                                    When you wrote <em>00:00</em> in your diary, where did you mean?<br/>
                                                    It's always midnight somewhere.
                                                </template>
                                                <template v-else>
                                                    Your diary includes the timezone information we need.<br/>
                                                    This is <span style="opacity:0.5">grey</span> because you don't need to do anything about it.
                                                </template>
                                            </td>
                                        </tr>
                                    </v-slide-x-transition>
                                    <v-slide-x-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='tz'"
                                          @click="toggle_stats_info('tz')"
                                          class="stats-arrows"
                                        >
                                            <td></td>
                                            <td colspan="6" class="stats-plus-minus"><v-icon small>mdi-arrow-down-bold</v-icon></td>
                                            <td></td>
                                        </tr>
                                    </v-slide-x-transition>
                                    <tr
                                      @click="toggle_stats_info('tz')"
                                    >
                                        <th style="height:0;border:none"></th>
                                        <td style="height:0;border:none" colspan="6"></td>
                                        <td rowspan="3" class="hpad-unless-narrow" v-if="statistics_options.includes('infos')">
                                            <v-btn icon>
                                                <v-icon>mdi-information</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                    <tr
                                      @click="toggle_stats_info('tz')"
                                      :style="manual_timezone_required?'':'opacity:0.5'"
                                    >
                                        <th style="border-bottom:none">Diary timezone</th>
                                        <td style="border-bottom:none" @click.stop :colspan="6">
                                            <v-autocomplete
                                              v-if="manual_timezone_required"
                                              v-model="diary_timezone"
                                              :items="timezones"
                                              :rules="timezone_rules"
                                            />
                                            <template v-else>
                                                (diary entries already include timezones)
                                            </template>
                                        </td>
                                    </tr>

                                    <tr
                                      @click="toggle_stats_info('diary_tz')"
                                    >
                                        <th>Display timezone</th>
                                        <td @click.stop :colspan="6">
                                            <v-autocomplete
                                              v-model="display_timezone"
                                              :items="timezones"
                                              :rules="timezone_rules"
                                            />
                                        </td>
                                    </tr>

                                    <v-slide-x-reverse-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='tz'"
                                          @click="toggle_stats_info('tz')"
                                          class="stats-arrows stats-below"
                                        >
                                            <td></td>
                                            <td class="stats-plus-minus" colspan="6"><v-icon small>mdi-arrow-up-bold</v-icon></td>
                                            <td></td>
                                        </tr>
                                    </v-slide-x-reverse-transition>
                                    <v-slide-x-reverse-transition>
                                        <tr
                                          v-show="statistics_options.includes('infos')&&stats_info=='tz'"
                                          @click="toggle_stats_info('tz')"
                                        >
                                            <td
                                              colspan="8"
                                            >
                                                Times on this page are displayed in this timezone.<br/>
                                                You can use any <a @click.stop href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">tz database timezone</a>.
                                            </td>
                                        </tr>
                                    </v-slide-x-reverse-transition>

                                </tbody>
                            </template>
                        </v-simple-table>

                    </v-list-item-content>
                </v-list-item>

                <v-subheader v-if="predictable">
                    Predict your daytime
                    <v-spacer></v-spacer>
                </v-subheader>

                <v-list-item v-if="predictable">
                    <v-list-item-content>

                        <div class="mb-4">
                            When are you likely to be awake for an upcoming appointment?
                            The middle of your latest daytime was <em>{{prediction_midpoint_str}}</em> and your average day length is <em>{{to_duration(long_term.summary_days.average)}}</em>, so...</div>

                        <div>

                            <v-row>
                                <v-col cols="1"></v-col>
                                <v-col cols="5">
                                    <v-menu
                                      ref="prediction_date_menu"
                                      v-model="prediction_date_menu"
                                      :close-on-content-click="false"
                                      :return-value.sync="prediction_date"
                                      transition="scale-transition"
                                      offset-y
                                      min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                              v-model="prediction_date"
                                              class="pt-0"
                                              prepend-icon="mdi-calendar"
                                              label="Start from"
                                              hide-details
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                          v-model="prediction_date"
                                          no-title
                                          scrollable
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                              text
                                              color="primary"
                                              @click="prediction_date_menu = false"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                              text
                                              color="primary"
                                              @click="$refs.prediction_date_menu.save(prediction_date)"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="1" style="margin:auto;text-align:center">at</v-col>
                                <v-col cols="5">
                                    <v-menu
                                      ref="prediction_time_menu"
                                      v-model="prediction_time_menu"
                                      :close-on-content-click="false"
                                      :return-value.sync="prediction_time"
                                      transition="scale-transition"
                                      offset-y
                                      min-width="auto"
                                      @input="value => reset_time_picker(value,$refs.prediction_time)"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                              v-model="prediction_time"
                                              class="pt-0"
                                              prepend-icon="mdi-clock"
                                              label="time"
                                              hide-details
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                          v-model="prediction_time"
                                          ref="prediction_time"
                                          no-title
                                          scrollable
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                              text
                                              color="primary"
                                              @click="prediction_time_menu = false"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                              text
                                              color="primary"
                                              @click="$refs.prediction_time_menu.save(prediction_time)"
                                            >
                                                OK
                                            </v-btn>
                                        </v-time-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="1" style="margin:auto;font-size:larger">+</v-col>
                                <v-col cols="5">
                                    <v-text-field
                                      v-model="prediction_count"
                                      prepend-icon="mdi-counter"
                                      label="days"
                                      class="pt-0"
                                      hide-details
                                      type="number"
                                    />
                                </v-col>
                                <v-col cols="1" style="margin:auto;text-align:center;font-size:larger">×</v-col>
                                <v-col cols="5">
                                    <v-text-field
                                      v-model="prediction_duration"
                                      prepend-icon="mdi-timer"
                                      label="day length"
                                      class="pt-0"
                                      hide-details
                                      :rules="[ v => /^[0-9]+:[0-9]+(?::[0-9]+)?$/.test(v) ]"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="1" style="font-size:larger">=</v-col>
                                <v-col cols="11" id="prediction-result">{{prediction_result}}</v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    ... or build your own prediction model with <a href="#generate-predictions" @click.prevent="generate_predictions()">a&nbsp;sleep&nbsp;spreadsheet</a>.
                                </v-col>
                            </v-row>

                        </div>

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

                                        <v-list flat>
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
                        <v-subheader>
                            Sleep-related events
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
                                      @click="event_graph_tab='root'"
                                    >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>

                                <v-tabs
                                  v-model="event_graph_tab"
                                  style="width:270px"
                                  height="0"
                                >
                                    <v-tabs-items v-model="event_graph_tab">
                                        <v-tab-item :transition="false" value="root">

                                            <v-list flat>
                                                <v-list-item @click.stop="event_graph_tab='theme'">
                                                    <v-list-item-icon><v-icon>mdi-theme-light-dark</v-icon></v-list-item-icon>
                                                    <v-list-item-content><v-list-item-title>Theme: {{event_graph_theme}}</v-list-item-title></v-list-item-content>
                                                    <v-list-item-action>
                                                        <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>

                                                <v-list-item @click.stop="event_graph_tab='lines'">
                                                    <v-list-item-icon><v-icon>mdi-chart-timeline-variant-shimmer</v-icon></v-list-item-icon>
                                                    <v-list-item-content><v-list-item-title>Show {{event_graph_lines.length}} lines</v-list-item-title></v-list-item-content>
                                                    <v-list-item-action>
                                                        <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                            </v-list>
                                        </v-tab-item>

                                        <v-tab-item :transition="false" value="theme">
                                            <v-toolbar flat>
                                                <v-btn icon @click.stop="event_graph_tab = 'root'">
                                                    <v-icon>mdi-arrow-left</v-icon>
                                                </v-btn>

                                                <v-toolbar-title>Choose theme</v-toolbar-title>
                                            </v-toolbar>
                                            <v-divider/>
                                            <v-list>
                                                <v-list-item-group v-model="event_graph_theme">
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

                                        <v-tab-item :transition="false" value="lines">
                                            <v-toolbar flat>
                                                <v-btn icon @click.stop="event_graph_tab = 'root'">
                                                    <v-icon>mdi-arrow-left</v-icon>
                                                </v-btn>

                                                <v-toolbar-title>Show lines</v-toolbar-title>
                                            </v-toolbar>
                                            <v-divider/>
                                            <v-list flat>
                                                <v-list-item-group
                                                  v-model="event_graph_lines"
                                                  multiple
                                                >
                                                    <template
                                                      v-for="line in event_graph_line_names"
                                                    >
                                                        <v-list-item
                                                          :key="line"
                                                          @click.stop=""
                                                          :value="line"
                                                        >
                                                            <template v-slot:default="{ active }">
                                                                <v-list-item-action>
                                                                    <v-checkbox
                                                                      :input-value="active"
                                                                    />
                                                                </v-list-item-action>

                                                                <v-list-item-content>
                                                                    <v-list-item-title>Show {{event_graph_line_title[line]}}</v-list-item-title>
                                                                </v-list-item-content>
                                                            </template>
                                                        </v-list-item>
                                                    </template>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-tab-item>

                                    </v-tabs-items>
                                </v-tabs>

                            </v-menu>

                        </v-subheader>
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
                            <v-icon>mdi-file-pdf-box</v-icon>
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
                    :href="docs_url+'patterns/'+pattern.id"
                >
                    <v-list-item-icon>
                        <v-icon>{{pattern.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{pattern.message}}</v-list-item-title>
                        <v-list-item-subtitle>See advice about this pattern</v-list-item-subtitle>
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

                        <v-card-text style="max-height:70vh;text-align:center;padding:0;line-height:0" v-html="dialog_svg"/>

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

<style>
 .space-unless-narrow:before,
 .space-unless-narrow:after {
     content: ' ';
 }
 .narrow { display: none }
 @media only screen and (max-width: 429px) {
     .space-unless-narrow:before,
     .space-unless-narrow:after {
         content: '';
     }
     .hpad-unless-narrow {
         padding-left: 0px ! important;
         padding-right: 0px ! important;
     }
     .narrow { display: initial }
     .wide { display: none }
 }
 .stats-arrows td {
     height: 12px ! important;
 }
 .stats-below td {
     border-bottom: none ! important;
 }
 .stats-plus-minus {
     text-align: center;
     padding-left: 0 ! important;
     padding-right: 0 ! important;
 }
 .stats-average {
     text-align: right;
     padding-right: 0 ! important;
 }
 .stats-sd {
     text-align: left;
     padding-left: 0 ! important;
 }
 .stats-amount {
     font-style: italic;
     white-space: nowrap;
 }

 #prediction-result {
     text-align:right;
     border-bottom: thin solid rgba(0, 0, 0, 0.7);
 }
 .theme--dark #prediction-result {
     border-bottom-color: rgba(255, 255, 255, 0.7);
 }
</style>

<script>

 import diary_manager from "@/diary_manager.js";
 import { DOCS_URL } from "@/constants.js";
 import Worker from 'worker-loader!@/info';

 const ONE_HOUR = 1000*60*60;

 export default {
     name: 'Info',

     data: () => ({
         display_timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
         diary_timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
         timezones: [ new Intl.DateTimeFormat().resolvedOptions().timeZone ],
         timezone_rules: [
           tz => {
             try {
               window.tc.zone(tz);
               return true;
             } catch (e) {
               return false;
             }
           }
         ],
         manual_timezone_required: false,
         //recent: {}, // NO!  Making this reactive takes a long time, for no benefit
         recent_began: '',
         //long_term: {}, // NO!  Making this reactive takes a long time, for no benefit
         long_term_began: '',
         stats_info: 0,
         software_version: '',
         update_timeout: null,
         latest_primary_sleep: [],
         schedule_list: [],
         prediction_midpoint: 0,
         prediction_midpoint_str: '',
         prediction_date_menu: false,
         prediction_time_menu: false,
         prediction_date: '',
         prediction_time: '',
         prediction_duration: "",
         prediction_count: 7,
         chart_svg: ['',''],
         event_svg: '',
         dialog_svg: [ '', '' ],
         patterns: [],
         dialog: false,
         dialog_title: '',
         awake_at: 0,
         asleep_at: 0,
         day_length: 0,
         docs_url: DOCS_URL,
         worker: new Worker(),
         statistics_options: ["infos","borings"],
         statistics_option_names: ["infos","borings"],
         statistics_option_titles: {
           "infos": "info buttons",
           "borings": "greyed-out rows",
         },
         sleep_chart_tab: 'root',
         sleep_chart_theme: 'dark',
         sleep_chart_start: 64800000,
         sleep_chart_reverse: true,
         event_graph_tab: 'root',
         event_graph_theme: 'dark',
         event_graph_lines: ["wake","sleep","asleep","day-length"],
         event_graph_line_names: ["wake","sleep","asleep","day-length"],
         event_graph_line_title: {
           "wake": 'wake times',
           "sleep": 'fall-asleep times',
           "asleep": 'sleep lengths',
           "day-length": 'day lengths',
         },
     }),

     mounted() {
         this.worker.onmessage = ({data}) => {
             const within_expected_range = ( recent, long_term, expected, range ) => (
                     true
                     && recent    && Math.abs( recent   .average - expected ) <= range
                     && long_term && Math.abs( long_term.average - expected ) <= range
                 ),
                 too_varied = ( recent, long_term ) => (
                     long_term
                     && long_term.standard_deviation > 5*60*60*1000
                 )
             ;
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

                     this.prediction_midpoint = data[9];

                     if ( data[10] && !this.manual_timezone_required ) {
                         this.manual_timezone_required = true;
                         this.update_settings(this.diary_timezone);
                     }

                     this.   recent_began = this.recent   .activities[0].id.split("T")[0];
                     this.long_term_began = this.long_term.activities[0].id.split("T")[0];
                     this.ended = this.long_term.activities[this.long_term.activities.length-1].id.split("T")[0];

                     this.schedule_list = [
                         [
                             this.recent.summary_asleep,
                             this.long_term.summary_asleep,
                             1, // indicates this is a duration
                             // text to show in different places:
                             "Total Sleep Time",
                             'Slept for',
                             "sleep per day",
                             too_varied(this.recent.summary_asleep,this.long_term.summary_asleep), // is this boring?
                         ],
                         [
                             this.recent.schedule.wake,
                             this.long_term.schedule.wake,
                             3, // indicates this is a time
                             // text to show in different places:
                             "Wake At",
                             "Woke up",
                             "wake time",
                             too_varied(this.recent.schedule.wake,this.long_term.schedule.wake), // is this boring?
                         ],
                         [
                             this.recent.schedule.sleep,
                             this.long_term.schedule.sleep,
                             3, // indicates this is a time
                             // text to show in different places:
                             "Asleep At",
                             "Asleep",
                             "fall-asleep time",
                             too_varied(this.recent.schedule.sleep,this.long_term.schedule.sleep), // is this boring?
                         ],
                         [
                             this.recent.summary_days,
                             this.long_term.summary_days,
                             1, // indicates this is a duration
                             // text to show in different places:
                             "Day Length",
                             "Length",
                             "calculated day length",
                             within_expected_range(this.recent.summary_days,this.long_term.summary_days,24*60*60*1000,10*60*1000),
                         ],
                         [
                             this.recent.sleeps_per_day,
                             this.long_term.sleeps_per_day,
                             0, // indicates this is a count
                             // text to show in different places:
                             "Sleeps Per Day",
                             "Sleeps",
                             "number of sleeps per day",
                             within_expected_range(this.recent.sleeps_per_day,this.long_term.sleeps_per_day,1,0.1),
                         ],
                         [
                             this.recent.meds_per_day,
                             this.long_term.meds_per_day,
                             0, // indicates this is a count
                             // text to show in different places:
                             "Medications Per Day",
                             "Meds",
                             "number of medications per day",
                             within_expected_range(this.recent.sleeps_per_day,this.long_term.sleeps_per_day,0,0.1),
                         ],
                     ];

                     this.update_prediction();
                     this.prediction_duration = this.to_duration((this.long_term.summary_days||{}).average);

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
         display_timezone   () { this.update_settings(); this.update_prediction(); },
         diary_timezone     () { this.update_settings(this.diary_timezone); },
         sleep_chart_theme  () { this.update_settings(); },
         sleep_chart_start  () { this.update_settings(); },
         sleep_chart_reverse() { this.update_settings(); },
         event_graph_theme  () { this.update_settings(); },
         event_graph_lines  () { this.update_settings(); },
     },

     methods: {

         toggle_stats_info(schedules) {
             if ( this.stats_info == schedules ) {
                 this.stats_info = 0;
             } else if ( this.stats_info ) {
                 this.stats_info = 0;
                 setTimeout( () => this.stats_info = schedules, 350 );
             } else {
                 this.stats_info = schedules;
             }
         },

         reset_time_picker(value,input) {
             if ( value && input ) input.selectingHour = true;
         },

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
                     timeZone : this.display_timezone
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
                 timezone: this.display_timezone,
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
             if ( value < 0 ) value += 24*60*60*1000;
             const hours = Math.floor( value / ONE_HOUR ),
                   minutes = Math.floor( value / (60*1000) ) % 60
             ;
             return (
                 hours +
            ( minutes < 10 ? ":0" : ":" ) +
                 minutes
             );
         },

         to_duration_long(value) {
             if ( value < 0 ) value += 24*60*60*1000;
             const hours = Math.floor(value/(60*60*1000));
             value %= (60*60*1000);
             const minutes = Math.floor(value/(60*1000));
             value %= (60*1000);
             const seconds = Math.floor(value/1000);
             let ret = [];
             switch ( hours ) {
             case 0:
                 break;
             case 1:
                 ret.push( '1 hour' );
                 break;
             default:
                 ret.push( hours + ' hours' );
             }
             switch ( minutes ) {
             case 0:
                 break;
             case 1:
                 ret.push( '1 minute' );
                 break;
             default:
                 ret.push( minutes + ' minutes' );
             }
             if ( !hours ) {
                 switch ( seconds ) {
                 case 0:
                     break;
                 case 1:
                     ret.push( '1 second' );
                     break;
                 default:
                     ret.push( seconds + ' seconds' );
                 }
             }
             return ret.join( ', ' );
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

         to_value( format, number ) {
             switch ( format ) {
               case 0:
                 return number.toFixed(2);
               default:
                 return this.to_duration(number);
             }
         },

         to_description(schedules,offset) {
           let to_fixed = number => Number.isInteger(number) ? number : number.toFixed(2),
               to_minutes = number => number - (number%(60*1000)),
               to_time = time => new Intl.DateTimeFormat('default', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric' }).format(new Date(time)),
               days = Math.round( ( new Date(this.ended) - new Date(this.recent_began).getTime() ) / (24*60*60*1000) )+1,
               prefix = 'Your average ' + schedules[5]
                      + (
                        ( offset )
                        ? ' since <span class="stats-amount">' + this.long_term_began
                        : ` for the ${days} days between <span class="stats-amount">${this.recent_began}</span> and <span class="stats-amount">${this.ended}`
                      )
                      + '</span> was',
               suffix = (
                 schedules[6]
                 ? `<br/>This is <span style="opacity:0.5">grey</span> because it isn't very informative.`
                 : ''
               )
           ;
             if ( !schedules[offset] || days < 2 ) {
               return "There isn't enough data to calculate these values just yet - keep logging and it'll start to work!";
             } else if ( schedules[offset].standard_deviation ) {
               switch ( schedules[2] ) {
                   case 0: // count
                       return (
                         prefix + '\u00A0<span class="stats-amount">' + to_fixed(schedules[offset].mean)
                         + '</span>.<br/>It was usually between <span class="stats-amount">'
                         + (
                           schedules[offset].mean > schedules[offset].standard_deviation
                           ? to_fixed( schedules[offset].mean - schedules[offset].standard_deviation )
                           : 0
                         )
                         + '</span> and <span class="stats-amount">'
                         + to_fixed( schedules[offset].mean + schedules[offset].standard_deviation )
                         + '</span>'
                         + suffix
                       );
                   case 1: // duration
                       return (
                         prefix + '\u00A0<span class="stats-amount">' + this.to_duration_long(schedules[offset].mean)
                         + '</span>.<br/>But it was often as short as <span class="stats-amount">'
                         + this.to_duration_long( to_minutes(schedules[offset].mean) - to_minutes(schedules[offset].standard_deviation) )
                         + '</span> or as long as <span class="stats-amount">'
                         + this.to_duration_long( to_minutes(schedules[offset].mean) + to_minutes(schedules[offset].standard_deviation) )
                         + '</span>.<br/>'
                         + "Some weeks, all your days will be near the top or bottom of this range."
                         + suffix
                       );
                   case 3: // time
                       return (
                         prefix + '\u00A0<span class="stats-amount">' + to_time(schedules[offset].mean)
                         + '</span>.<br/>But it was often as early as <span class="stats-amount">'
                         + to_time( to_minutes(schedules[offset].mean) - to_minutes(schedules[offset].standard_deviation) )
                         + '</span> or as late as <span class="stats-amount">'
                         + to_time( to_minutes(schedules[offset].mean) + to_minutes(schedules[offset].standard_deviation) )
                         + '</span>.<br/>'
                         + "Some weeks, all your days will be near the top or bottom of this range."
                         + suffix
                       );
               }
             } else {
               prefix += ' always exactly\u00A0<span class="stats-amount">';
               if ( schedules[2] ) {
                 return prefix + this.to_duration_long(schedules[offset].mean) + '</span>.' + suffix;
               } else {
                 return prefix +              to_fixed(schedules[offset].mean) + '</span>.' + suffix;
               }
             }
         },

         update_settings(diary_timezone) {
             this.$emit("busy");
             this.worker.postMessage([
                 "settings",
                 diary_timezone,
                 this.display_timezone,
                 this.sleep_chart_theme,
                 this.sleep_chart_start,
                 this.sleep_chart_reverse,
                 this.event_graph_theme,
                 this.event_graph_lines,
             ]);
         },

       update_prediction() {
         if ( this.prediction_midpoint ) {
           const m = (
             new window.tc.DateTime(
               this.prediction_midpoint,
               window.tc.zone("Etc/UTC")
             ).toZone(window.tc.zone(this.display_timezone))
           );
           this.prediction_date = (
             m.year() + '-' +
             ( m.month()<10 ? '0' : '' ) +
             m.month() + '-' +
             ( m.day()<10 ? '0' : '' ) +
             m.day()
           );
           this.prediction_time = (
             m.hour() + ':' +
             ( m.minute()<10 ? '0' : '' ) +
             m.minute()
           );
           this.prediction_midpoint_str = this.prediction_date + ', ' + this.prediction_time;
         }
       },

     },

     computed: {
         predictable() {
             return this.schedule_list[1] && this.schedule_list[2] && this.schedule_list[3] && !this.schedule_list[3][6] && this.prediction_midpoint;
         },
         prediction_result() {
             const date = this.prediction_date.split('-'),
                   time = this.prediction_time.split(':'),
                   duration_a = this.prediction_duration.split(':').map( v => parseInt(v,10) ),
                   duration = ( ( duration_a[0] * 60 + duration_a[1] ) * 60 + (duration_a[2]||0) ) * 1000,
                   count = parseInt(this.prediction_count,10)
           ;

           return (
             new window.tc.DateTime(
               parseInt(date[0],10),
               parseInt(date[1],10),
               parseInt(date[2],10),
               parseInt(time[0],10),
               parseInt(time[1],10),
               0, // second
               0, // millisecond
               window.tc.zone(this.display_timezone),
             ).add( new window.tc.Duration( duration * count ) )
             .format("EEE, dd MMM yyyy HH:mm:ss")
           );
         },
     },

 }
</script>
