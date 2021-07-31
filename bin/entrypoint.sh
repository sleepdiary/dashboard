#!/bin/sh

SLEEPDIARY_NAME=dashboard
NEEDS_PORT=1

cmd_build() {
    yarn --frozen-lockfile && yarn build --dest docs
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

. /build-sleepdiary.sh "$@"
