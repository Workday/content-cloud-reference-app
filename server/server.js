'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();
let server;

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');

    const baseUrl = app.get('url').replace(/\/$/, '');

    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

    // Tell our test harness we're ready
    app.emit('ready', null);
  });
};

app.stop = function() {
  server.close();
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
  server = app.start();
});
