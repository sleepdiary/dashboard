#!/bin/sh

if [ -e /opt/sleepdiary/utils.sh ]
then . /opt/sleepdiary/utils.sh
else printf '\033[1;31m/opt/sleepdiary/utils.sh not found - some checks bypassed.\033[0m\n'
fi

case "$1" in

    build)
        npm ci --silent && npx vue-cli-service build --dest docs --no-clean
        ;;

    test)
        npx vue-cli-service lint
        echo
        if ! node bin/check-urls.js
        then
            echo
            echo "This build will generate some invalid URLs."
            exit 2
        fi
        generic_tests
        exit "$WARNED"
        ;;

    serve)
        npm ci && npx vue-cli-service serve
        ;;

    upgrade)
        npm upgrade
        ;;

    *)
        exit 2
        ;;

esac
