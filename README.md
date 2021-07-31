# Sleep Diary Dashboard

As part of the [Sleep Diary Project](https://sleepdiary.github.io/), this repository provides a dashboard to view your sleep diary.

[Click here to use the dashboard](https://sleepdiary.github.io/dashboard)

## Developing the project

To work on the dashboard, you will need a development environment.  The recommended solution is to [install Docker](https://docs.docker.com/get-started/) and do:

    # build and test:
    docker run --rm -it -v "/path/to/sleepdiary/report":/app sleepdiaryproject/builder
    # build but don't test:
    docker run --rm -it -v "/path/to/sleepdiary/report":/app sleepdiaryproject/builder build
    # run the development environment, listening on http://localhost:some_port/
    docker run --rm -it -v "/path/to/sleepdiary/report":/app -p some_port:8080 sleepdiaryproject/builder run

Most people set `some_port` in the second line to `8080`, but you can use another port if you prefer.  For example, you might want to run two instances of the project and compare their behaviour.

If you fork this project on GitHub, you can [enable GitHub Actions](https://docs.github.com/en/actions/managing-workflow-runs/disabling-and-enabling-a-workflow) to rebuild the project automatically whenever you push a change.  Then if you [enable GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), your site will be available online.

If you also want to use your own versions of other Sleep Diary libraries, edit [`.env`](.env) to point to wherever you keep them.

## License

Sleep Diary Dashboard, Copyright © 2021 Sleepdiary Developers <sleepdiary@pileofstuff.org>

Sleep Diary Dashboard comes with ABSOLUTELY NO WARRANTY.  This is free software, and you are welcome to redistribute it under certain conditions.  For details, see [the license statement](LICENSE).
