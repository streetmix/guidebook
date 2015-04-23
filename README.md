Streetmix handbook
==================

Work in progress.

## Workflow notes

1. Files are generated as a static files into the `./build/` folder. Run `http-server build` to serve the distribution folder to `http://localhost:8080` (or next available port).

2. Gulp is the primary task runner / build system. Running `gulp` with no other options just starts a watcher to perform various tasks and start a LiveReload server.

To run server and task runner at the same time:

```
gulp & http-server build
```

3. LiveReload must be installed as a Chrome extension. Open the local server and then connect LiveReload on that page in order to reload changes.

4. When work is done and ready to be published, first make sure all changes are committed, then run `gulp publish` to publish the contents of the `./build` folder to GitHub pages.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## <a name="copyright"></a>Copyright

Copyright (c) 2014 Streetmix contributors. See [LICENSE][] for details.

Content is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>, unless otherwise noted.

[license]: https://github.com/codeforamerica/streetmix/blob/master/LICENSE.md

