let session_storage = (() => {
    try {
        return window.sessionStorage || {};
    } catch (e) {
        const storage = {};
        return {
            getItem: item => storage[item],
            setItem: (item,value) => storage[item] = value,
        };
    }
})(),
    diary_strings = (
      session_storage.getItem('dashboard.diary') || ''
    ).split("\n").filter( d => d.length ),
    /*
     * Vue likes to make variables reactive.
     * This is extremely expensive for large, complex structures like diaries.
     * So we manage diaries outside of Vue:
     */
    diaries = [],
    permanent_callbacks = {},
    callbacks = [],
    init_waiting,
    init_callbacks = [],
    sentinel = {},
    id = 0,
    current_file,
    awaiting_files = [],
    awaiting_index = 0,
    call_callbacks = is_error => {
        Object.values(permanent_callbacks).forEach( c => c(diaries.length == 1 && diary_strings.length == 0,is_error) );
        callbacks.forEach( c => c(diaries.length == 1 && diary_strings.length == 0,is_error) );
        callbacks.length = 0;
    },
    diary_loader = new window.DiaryLoader(
        (diary,source) => {
            if ( !diary.records.length ) return call_callbacks(true);
            diaries.push([id++,diary,diary.format_info()]);
            if ( awaiting_index < awaiting_files.length ) {
                current_file = awaiting_files[awaiting_index++];
                diary_loader.load([current_file]);
            } else {
                current_file = 0;
                awaiting_files = [];
                call_callbacks(false);
                if ( !source.search || source.search(/^hash/) ) --init_waiting;
                if ( init_callbacks && !init_waiting ) {
                    init_callbacks.forEach( c => c(diaries.length == 1 && diary_strings.length == 0) );
                    init_callbacks = 0;
                }
            }
            if ( source && source !== sentinel ) {
                diary.to_async("storage-line").then( json => {
                    diary_strings.push(json);
                    session_storage.setItem('dashboard.diary',diary_strings.join("\n"));
                });
            }
        },
        () => {
            let fail = () => call_callbacks(true),
                file = current_file;
            current_file = 0;
            if ( window.preprocess_activity_log && window.Promise ) {
                window.preprocess_activity_log(file)
                    .then(
                        activities => {
                            diary_loader.load(
                                "ActivityStart,ActivityEnd\n"
                                + activities.map( a => a.ActivityStart+','+a.ActivityEnd).join("\n")
                                + "\n"
                            );
                        },
                        fail
                    );
            } else {
                fail();
            }
        },
        1, // parse each URL hash once, but not when the user clicks "back"
    )
;

if ( diary_strings.length ) {
    init_waiting = diary_strings.length;
    diary_strings
        .forEach( str => diary_loader.load(str,sentinel) )
    ;
} else {
    init_callbacks = 0;
}

export default {

    on_init(c) {
        if ( init_callbacks ) {
            init_callbacks.push(c);
        } else {
            c(diaries.length == 1 && diary_strings.length == 0);
        }
    },
    get_diaries() { return diaries; },
    merge_diaries() {
        if ( !diaries.length ) return;
        const ret = diaries[0][1].clone();
        diaries.slice(1).forEach( d => ret.merge(d[1]) );
        return ret;
    },
    add_callback(c) { callbacks.push(c); },
    add_permanent_callback(key,cb) {
        permanent_callbacks[key] = cb;
    },
    add_diaries(event) {
        awaiting_files = event.target.files;
        current_file = awaiting_files[0];
        awaiting_index = 1;
        diary_loader.load([current_file]);
    },
    add_demo(filename) {
        fetch(filename)
            .then( r => r.text() )
            .then( t => diary_loader.load(t) )
        ;
    },
    remove_diary(id) {
        for ( let n=0; n!=diaries.length; ++n ) {
            if ( diaries[n][0] == id ) {
                diaries.splice(n,1);
                diary_strings.splice(n,1);
                session_storage.setItem('dashboard.diary',diary_strings.join("\n"));
                call_callbacks(false);
                return;
            }
        }
    },
    clear() {
        session_storage.removeItem('dashboard.diary');
    },

};
