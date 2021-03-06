const https = require('https'),
      fs = require('fs')
;

let files = 0,
    overall_result = 0
;

function check( process_result, message ) {
    if ( process_result ) {
        console.log(`ok ${message}`);
    } else {
        console.log(`not ok ${message}`);
        overall_result = 2;
    }
    if ( !--files ) {
        process.exit(overall_result);
    }
}

fs.readFileSync('docs/index.html', { encoding: 'utf-8' })
    .replace(
        /(?:href|src)=["']?([^"'> ]*)/g,
        (_,link) => {
            ++files;
            if ( link.search(/:\/\//) != -1 ) {

                https.get(link, response =>
                    check(response.statusCode == 200, `${link}: returned ${response.statusCode}`)
                );

            } else if ( link.search(/^\/dashboard\//) != -1 ) {

                setTimeout(
                    () => check(fs.existsSync(link.replace(/^\/dashboard\//,'docs/')), `${link}: exists in docs/`),
                    1
                );

            } else if ( link.search(/^\//) != -1 ) {

                https.get('https://sleepdiary.github.io'+link, response =>
                    check(response.statusCode == 200, `${link}: returned ${response.statusCode}`)
                );

            } else {

                setTimeout(
                    () => check(false, `${link}: invalid URL`),
                    1
                );

            }

        });
