'use strict';
const tokenService = require('../token-service');

module.exports = function(server) {
  tokenService(function(token) {
    console.info('Access token: ' + token);

    // Also make an endpoint for test purposes
    const router = server.loopback.Router();
    router.get('/token', function(req, res) {
      res.send({token: token});
    });
    server.use(router);
  });
};
