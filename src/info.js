self.importScripts(
    process.env.VUE_APP_SCRIPT_URL + "core/sleepdiary-core.min.js",
    process.env.VUE_APP_SCRIPT_URL + "report/sleepdiary-report.min.js",
    process.env.VUE_APP_SCRIPT_URL + "info/sleepdiary-info.min.js"
);

var diary,
    orig_diary,
    display_timezone,
    manual_timezone_required,
    diary_timezone,
    reverse,
    start,
    sleep_chart_theme,
    cache,
    event_graph_theme,
    event_graph_lines,
    diary_loader = new self.DiaryLoader(
        diary_ => {
            postMessage([0,5]);
            manual_timezone_required = diary_.format_info().timezone == "no";
            orig_diary = diary = diary_.to("Standard");
            calculate_info();
        },
        () => postMessage([2,"diary_loader failed"]),
        2, // ignore the URL hash
    );

function calculate_activities(activities,local_diary,filter) {
    return {
        activities     : activities,
        schedule       : local_diary.summarise_schedule( filter                    , undefined, display_timezone ),
        summary_days   : local_diary.summarise_days    (                               filter ),
        summary_asleep : local_diary.summarise_records ( r => r.status=="asleep" && ((!filter) || filter(r)) ),
        sleeps_per_day : local_diary.total_per_day     ( r => r.status=="asleep"   ,   filter ),
        meds_per_day   : local_diary.total_per_day     ( r => r.status=="sleep aid",   filter ),
    }
}

function calculate_info() {

    try {

        var partial_key = [diary_timezone||display_timezone,display_timezone,start,sleep_chart_theme].join(' '),
            full_key = partial_key + ' ' + reverse,
            response = [1]
        ;

        if ( cache[full_key] ) {

            response = cache[full_key];

        } else {

            postMessage([0,10]);

            var activities = cache[partial_key] || diary.daily_activities(
                display_timezone,
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

            var recent = calculate_activities( recent_activities, diary, r => r.start>=cutoff );

            response.push(recent);
            postMessage([0,50]);

            var long_term = calculate_activities( activities, diary ),
                recent_graph = recent_activities,
                long_term_graph = activities
            ;
            response.push(long_term);
            postMessage([0,60]);

            response.push( 0 ); // event graph, filled in below
            response.push( self.find_patterns( recent, long_term ) );
            postMessage([0,70]);

            if ( reverse ) {
                recent_graph    =    recent_graph.slice(0).reverse();
                long_term_graph = long_term_graph.slice(0).reverse();
            }
            response.push( self.sleep_chart(   recent_graph,sleep_chart_theme,!start,display_timezone) );
            postMessage([0,80]);
            response.push( self.sleep_chart(long_term_graph,sleep_chart_theme,!start,display_timezone) );

            postMessage([0,90]);

            response.push( diary.latest_daytime_midpoint() );
            response.push( manual_timezone_required );

            // activities in the display timezone instead of the diary timezone:
            if ( (diary_timezone||display_timezone) == display_timezone ) {
                response.push( response[4] );
            } else {
                var modified_diary = diary.clone();
                modified_diary.update_timezone(display_timezone);
                response.push( calculate_activities( activities, modified_diary ) );
            }

        }

        postMessage([0,95]);
        // runs too fast to bother caching:
        response[5] = self.event_graph( response[11], event_graph_theme, event_graph_lines );

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
        if ( e.data[1] ) {
            diary = orig_diary.clone();
            diary.reset_to_timezone(diary_timezone=e.data[1]);
        }
        display_timezone  = e.data[2];
        sleep_chart_theme = e.data[3];
        start             = e.data[4];
        reverse           = e.data[5];
        event_graph_theme = e.data[6];
        event_graph_lines = e.data[7];
        if ( diary ) calculate_info();
        break;
    case "diary":
        cache = {};
        diary_loader.load(e.data[1]);
        break;
    }
}
