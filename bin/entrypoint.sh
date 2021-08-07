#!/bin/sh

SLEEPDIARY_NAME=dashboard
NEEDS_PORT=1

cmd_build() {
    yarn --frozen-lockfile && yarn build --dest docs --no-clean
}

cmd_test() {

    yarn lint || return "$?"

}

cmd_run() {
    yarn --frozen-lockfile && yarn serve
}

cmd_upgrade() {
    yarn
}

if [ -e /opt/sleepdiary/build-sleepdiary.sh ]
then
    . /opt/sleepdiary/build-sleepdiary.sh "$@"
else
    echo "Usage: docker run --rm -it -v $( realpath "$( dirname "$0" )/.." ):/app sleepdiaryproject/builder" "$@"
    exit 2
fi
