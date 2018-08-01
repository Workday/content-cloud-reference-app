/* eslint-disable max-len */
'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = function(Content) {
  /**
   * A simple JWT auth scheme, if using Loopback proper, recommend using the OAuth2 JWT extension for loopback
   */
  Content.beforeRemote('find', function(ctx, unused, next) {
    // First get token out of header or query string
    const authHeader = ctx.req.headers.authorization ||
      ctx.req.query.access_token;
    if (!authHeader) {
      return next(make401('Token not found. Format is Authorization: Bearer [token]'));
    }

    // Split the Bearer
    const authHeaderParts = authHeader.split(' ');
    if (authHeaderParts.length != 2) {
      return next(make401('JWT not found. Format is Authorization: Bearer [token]'));
    }

    // Get the JWT
    const authJwt = authHeaderParts[1];
    if (authJwt.length < 1) {
      return next(make401('JWT empty. Format is Authorization: Bearer [token]'));
    }

    // Prepare options for verification
    const jwtVerifyOptions = {
      algorithms: ['RS256', 'RS384', 'RS512'],
      audience: 'wday-cc-refapp',
      issuer: 'wday-cc',
      ignoreExpiration: false,
      subject: 'wday-cc',
      clockTolerance: 30,
      maxAge: '4h',
    };

    // Verify JWT using strict options
    jwt.verify(authJwt, getKey, jwtVerifyOptions, function(err) {
      if (err) {
        return next(make401(err));
      }
      // Success!  Proceeding to handle the request
      return next();
    });
  });

  function make401(message) {
    var error = new Error(message);
    error.statusCode = 401;
    return error;
  }

  /**
   * Super simple method to lookup a key on a kid in the header.  Recommend using a JWKS for easier management.
   * @param header
   * @param callback
   * @return {*}
   */
  function getKey(header, callback) {
    // if (header.kid === 'wday-cc-kid-1') {
    return callback(null, fs.readFileSync('server.crt'));

    // }
  }

  /**
   * Automatically add LINK url to support next page pagination
   */
  Content.afterRemote('**', function(ctx, result, next) {
    // Add custom content-type
    ctx.res.set('Content-Type', 'application/vnd.workday.contentcloud.v1+json');

    // query parameter to stop pagination - useful for mis-use test cases
    if (ctx.req.query.nopage) {
      return next();
    }

    // If a filter was used, give the caller the next page of results if there is another page
    if (ctx && ctx.args && ctx.args.filter) {
      Content.count(ctx.args.filter.where, null, function(err, count) {
        if (ctx.args.filter.skip + result.length < count) {
          // Create LINK header with filter parameter
          let linkUrl = 'http://' + ctx.req.headers.host + ctx.req.baseUrl;

          // Limit should be the same as before, skip is the same as before + how many results we got before
          linkUrl += '?filter=' + encodeURIComponent(JSON.stringify({'limit': ctx.args.filter.limit,
            'skip': ctx.args.filter.skip + result.length}));

          // Add to response header
          ctx.res.set('Link', linkUrl);

          next();
        } else {
          next();
        }
      });
    } else {
      next();
    }
  });
};

