'use strict';

const Mocha = require('mocha');
const tokenService = require('./server/token-service');

describe('Reference application test suite', function() {
  // Instantiate a Mocha instance.
  let mocha;

  beforeEach(function(done) {
    // Add validators mocha tests
    mocha = new Mocha();
    mocha.addFile(require.resolve('content-cloud-validator-tool'));

    done();
  });

  describe('testing using a good database', function() {
    let app;

    before(function(done) {
      process.env.NODE_ENV = 'development';

      // When ready, get endpoint and token
      app = require('./server/server');
      app.on('ready', function() {
        // Set the env var for the mocha tests, helpful for docker scenarios
        process.env.WDAY_CC_TEST_ENDPOINT = app.get('url') +
          'api/contents?filter=' + encodeURIComponent(JSON.stringify(
            {limit: 1000, skip: 0}));

        tokenService(function(token) {
          process.env.WDAY_CC_TEST_TOKEN = token;
          done();
        });
      });
    });

    it('MUST pass validator tests with mockdb.json', function(done) {
      this.timeout(300000); // 300 seconds timeout
      // Run the tests.
      mocha.run(function(failures) {
        if (failures) {
          throw new Error('Validator test suite failed.');
        }
        done();
      });
    });

    after(function() {
      app.stop();
    });
  });

  // Force a shutdown if loopback is stuck
  after(function() {
    process.exit();
  });
});
