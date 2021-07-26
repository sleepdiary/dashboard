self.importScripts(
    process.env.VUE_APP_SCRIPT_URL + "library/sleepdiary-library.min.js",
    process.env.VUE_APP_SCRIPT_URL + "report/sleepdiary-report.min.js",
    process.env.VUE_APP_SCRIPT_URL + "info/sleepdiary-info.min.js"
);

var timezone,
    diary_loader = new self.DiaryLoader(
        diary => {

            postMessage([0,5]);

            diary = diary.to("Standard");
            postMessage([0,10]);

            try {

                var activities = diary.daily_activities(
                    timezone,
                    undefined,
                    undefined,
                    1000*60*60/*ONE_HOUR*/,
                ),
                    recent_activities = activities.slice(Math.max(activities.length-/*CUTOFF_DAYS*/14,0))
                ;
                while ( recent_activities.length && !recent_activities[0] ) recent_activities.shift();
                postMessage([0,60]);

                var cutoff = recent_activities[0].start,
                    recent = {
                        activities     : recent_activities,
                        schedule       : diary.summarise_schedule(                             r => r.start>=cutoff, undefined, timezone ),
                        summary_days   : diary.summarise_days    (                             r => r.start>=cutoff ),
                        summary_asleep : diary.summarise_records ( r => r.status=="asleep"     &&   r.start>=cutoff ),
                        sleeps_per_day : diary.total_per_day     ( r => r.status=="asleep"   , r => r.start>=cutoff ),
                        meds_per_day   : diary.total_per_day     ( r => r.status=="sleep aid", r => r.start>=cutoff ),
                    };
                postMessage([0,80]);

                var long_term = {
                    activities     : activities,
                    schedule       : diary.summarise_schedule( undefined, undefined, timezone),
                    summary_days   : diary.summarise_days    (),
                    summary_asleep : diary.summarise_records ( r => r.status == "asleep" ),
                    sleeps_per_day : diary.total_per_day     ( r => r.status == "asleep" ),
                    meds_per_day   : diary.total_per_day     ( r => r.status == "sleep aid" ),
                },
                    chart_svg = [ recent, long_term ].map( self.sleep_chart ),
                    event_svg = self.event_graph( long_term ),
                    patterns = self.find_patterns( recent, long_term )
                ;

                postMessage([0,100]);
                postMessage([1,recent,long_term,diary.timezones(),chart_svg,event_svg,patterns,diary.software_version()]);

            } catch (err) {
                postMessage([2,Object.getOwnPropertyNames(err).map( name => [ name, err[name] ] )]);
            }
        },
        () => postMessage([2,"diary_loader failed"]),
        2, // ignore the URL hash
    );

onmessage = function(e) {
    postMessage([0,0]);
    timezone = e.data[0];
    diary_loader.load(e.data[1]);
}
