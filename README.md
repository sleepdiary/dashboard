# Sleep Diary Dashboard

As part of the [Sleep Diary Project](https://sleepdiary.github.io/), this repository provides a dashboard to view your sleep diary.

[Click here to use the dashboard](https://sleepdiary.github.io/dashboard)

## Compiling this project

The included [`Dockerfile`](Dockerfile) describes our build environment.  To recompile the project, build and run the environment like this:

    docker build --tag sleepdiary-dashboard "/path/to/sleepdiary/dashboard"
    docker run --rm -it -p some_port:8080 -v "/path/to/sleepdiary/dashboard":/app sleepdiary-dashboard # run a development environment
    docker run --rm -it -v "/path/to/sleepdiary/dashboard":/app sleepdiary-dashboard yarn build # build for production

Most people set `some_port` in the second line to `8080`, but you can use another port if you prefer.  For example, you might want to run two instances of the project and compare their behaviour.

This is run automatically by [our GitHub Actions script](.github/workflows/main.yml).  If you fork this project on GitHub, [enable GitHub Actions](https://docs.github.com/en/actions/managing-workflow-runs/disabling-and-enabling-a-workflow) to rebuild the project automatically whenever you push a change.

If you also want to use your own versions of other Sleep Diary libraries, edit [`.env`](.env) to point to wherever you keep them.

## License

Sleep Diary Dashboard, Copyright © 2021 Sleepdiary Developers <sleepdiary@pileofstuff.org>

Sleep Diary Dashboard comes with ABSOLUTELY NO WARRANTY.  This is free software, and you are welcome to redistribute it under certain conditions.  For details, see [the license statement](LICENSE).
