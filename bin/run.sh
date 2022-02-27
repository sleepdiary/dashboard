#!/bin/sh

set -e

if [ -e /opt/sleepdiary/utils.sh ]
then . /opt/sleepdiary/utils.sh
else printf '\033[1;31m/opt/sleepdiary/utils.sh not found - some checks bypassed.\033[0m\n'
fi

case "$1" in

    build)
        npx vue-cli-service build --dest docs --no-clean
        ;;

    test)
        npx vue-cli-service lint
        echo
        generic_tests
        if ! node bin/check-urls.js
        then
            echo
            echo "This build will generate some invalid URLs."
            exit 2
        fi
        exit "$WARNED"
        ;;

    serve)
        npx vue-cli-service serve
        ;;

    upgrade)
        npm upgrade
        rm -f yarn.lock
        yarn import
        ;;

    *)
        echo "Usage: $0 < build | test | serve | upgrade >"
        exit 2
        ;;

esac
