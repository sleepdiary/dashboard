self.importScripts(
    process.env.VUE_APP_SCRIPT_URL + "core/sleepdiary-core.min.js",
    process.env.VUE_APP_SCRIPT_URL + "report/sleepdiary-report.min.js",
    process.env.VUE_APP_SCRIPT_URL + "info/sleepdiary-info.min.js"
);

var diary,
    timezone,
    reverse,
    start,
    sleep_chart_theme,
    cache,
    event_graph_theme,
    event_graph_lines,
    diary_loader = new self.DiaryLoader(
        diary_ => {
            postMessage([0,5]);
            diary = diary_.to("Standard");
            calculate_info();
        },
        () => postMessage([2,"diary_loader failed"]),
        2, // ignore the URL hash
    );

function calculate_info() {

    try {

        var partial_key = [timezone,start,sleep_chart_theme].join(' '),
            full_key = partial_key + ' ' + reverse,
            response = [1]
        ;

        if ( cache[full_key] ) {

            response = cache[full_key];

        } else {

            postMessage([0,10]);

            var activities = cache[partial_key] || diary.daily_activities(
                timezone,
                start,
                undefined,
                1000*60*60/*ONE_HOUR*/,
            ),
                recent_activities = activities.slice(Math.max(activities.length-/*CUTOFF_DAYS*/14,0))
            ;

            cache[partial_key] = activities;

            while ( recent_activities.length && !recent_activities[0] ) recent_activities.shift();
            var cutoff = recent_activities[0].start;
            response.push(diary.timezones(),diary.software_version());
            postMessage([0,40]);

            var recent = {
                activities     : recent_activities,
                schedule       : diary.summarise_schedule(                             r => r.start>=cutoff, undefined, timezone ),
                summary_days   : diary.summarise_days    (                             r => r.start>=cutoff ),
                summary_asleep : diary.summarise_records ( r => r.status=="asleep"     &&   r.start>=cutoff ),
                sleeps_per_day : diary.total_per_day     ( r => r.status=="asleep"   , r => r.start>=cutoff ),
                meds_per_day   : diary.total_per_day     ( r => r.status=="sleep aid", r => r.start>=cutoff ),
            };
            response.push(recent);
            postMessage([0,50]);

            var long_term = {
                activities     : activities,
                schedule       : diary.summarise_schedule( undefined                 , undefined, timezone),
                summary_days   : diary.summarise_days    (),
                summary_asleep : diary.summarise_records ( r => r.status=="asleep"    ),
                sleeps_per_day : diary.total_per_day     ( r => r.status=="asleep"    ),
                meds_per_day   : diary.total_per_day     ( r => r.status=="sleep aid" ),
            },
                recent_graph = recent_activities,
                long_term_graph = activities
            ;
            response.push(long_term);
            postMessage([0,60]);

            response.push( 0 ); // filled in later
            response.push( self.find_patterns( recent, long_term ) );
            postMessage([0,70]);

            if ( reverse ) {
                recent_graph    =    recent_graph.slice(0).reverse();
                long_term_graph = long_term_graph.slice(0).reverse();
            }
            response.push( self.sleep_chart(   recent_graph,sleep_chart_theme,!start,timezone) );
            postMessage([0,80]);
            response.push( self.sleep_chart(long_term_graph,sleep_chart_theme,!start,timezone) );

            postMessage([0,90]);

            response.push( diary.latest_daytime_midpoint() );

        }

        postMessage([0,95]);
        // runs too fast to bother caching:
        response[5] = self.event_graph( response[4], event_graph_theme, event_graph_lines );

        postMessage([0,100]);
        postMessage(cache[full_key] = response);

    } catch (err) {
        postMessage([2,Object.getOwnPropertyNames(err).map( name => [ name, err[name] ] )]);
    }

}

onmessage = function(e) {
    postMessage([0,0]);
    switch ( e.data[0] ) {
    case "settings":
        timezone          = e.data[1];
        sleep_chart_theme = e.data[2];
        start             = e.data[3];
        reverse           = e.data[4];
        event_graph_theme = e.data[5];
        event_graph_lines = e.data[6];
        if ( diary ) calculate_info();
        break;
    case "diary":
        cache = {};
        diary_loader.load(e.data[1]);
        break;
    }
}
