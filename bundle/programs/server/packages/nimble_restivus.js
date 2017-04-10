(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg, Restivus;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/nimble_restivus/lib/auth.coffee.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getUserQuerySelector, passwordValidator, userValidator;                                                            // 1
this.Auth || (this.Auth = {}); /*                                                                                      // 1
                                 A valid user will have exactly one of the following identification fields: id, username, or email
                                */                                                                                     //
userValidator = Match.Where(function (user) {                                                                          // 6
  check(user, {                                                                                                        // 7
    id: Match.Optional(String),                                                                                        // 8
    username: Match.Optional(String),                                                                                  // 9
    email: Match.Optional(String)                                                                                      // 10
  });                                                                                                                  // 8
                                                                                                                       //
  if (_.keys(user).length === !1) {                                                                                    // 12
    throw new Match.Error('User must have exactly one identifier field');                                              // 13
  }                                                                                                                    // 18
                                                                                                                       //
  return true;                                                                                                         // 15
}); /*                                                                                                                 // 6
      A password can be either in plain text or hashed                                                                 //
     */                                                                                                                //
passwordValidator = Match.OneOf(String, {                                                                              // 20
  digest: String,                                                                                                      // 21
  algorithm: String                                                                                                    // 22
}); /*                                                                                                                 // 21
      Return a MongoDB query selector for finding the given user                                                       //
     */                                                                                                                //
                                                                                                                       //
getUserQuerySelector = function (user) {                                                                               // 27
  if (user.id) {                                                                                                       // 28
    return {                                                                                                           // 29
      '_id': user.id                                                                                                   // 29
    };                                                                                                                 // 29
  } else if (user.username) {                                                                                          // 28
    return {                                                                                                           // 31
      'username': user.username                                                                                        // 31
    };                                                                                                                 // 31
  } else if (user.email) {                                                                                             // 30
    return {                                                                                                           // 33
      'emails.address': user.email                                                                                     // 33
    };                                                                                                                 // 33
  }                                                                                                                    // 50
                                                                                                                       //
  throw new Error('Cannot create selector from invalid user');                                                         // 36
}; /*                                                                                                                  // 27
     Log a user in with their password                                                                                 //
    */                                                                                                                 //
                                                                                                                       //
this.Auth.loginWithPassword = function (user, password) {                                                              // 41
  var authToken, authenticatingUser, authenticatingUserSelector, hashedToken, passwordVerification, ref;               // 42
                                                                                                                       //
  if (!user || !password) {                                                                                            // 42
    throw new Meteor.Error(401, 'Unauthorized');                                                                       // 43
  }                                                                                                                    // 63
                                                                                                                       //
  check(user, userValidator);                                                                                          // 46
  check(password, passwordValidator);                                                                                  // 47
  authenticatingUserSelector = getUserQuerySelector(user);                                                             // 50
  authenticatingUser = Meteor.users.findOne(authenticatingUserSelector);                                               // 51
                                                                                                                       //
  if (!authenticatingUser) {                                                                                           // 53
    throw new Meteor.Error(401, 'Unauthorized');                                                                       // 54
  }                                                                                                                    // 70
                                                                                                                       //
  if (!((ref = authenticatingUser.services) != null ? ref.password : void 0)) {                                        // 55
    throw new Meteor.Error(401, 'Unauthorized');                                                                       // 56
  }                                                                                                                    // 73
                                                                                                                       //
  passwordVerification = Accounts._checkPassword(authenticatingUser, password);                                        // 59
                                                                                                                       //
  if (passwordVerification.error) {                                                                                    // 60
    throw new Meteor.Error(401, 'Unauthorized');                                                                       // 61
  }                                                                                                                    // 77
                                                                                                                       //
  authToken = Accounts._generateStampedLoginToken();                                                                   // 64
  hashedToken = Accounts._hashLoginToken(authToken.token);                                                             // 65
                                                                                                                       //
  Accounts._insertHashedLoginToken(authenticatingUser._id, {                                                           // 66
    hashedToken: hashedToken                                                                                           // 66
  });                                                                                                                  // 66
                                                                                                                       //
  return {                                                                                                             // 68
    authToken: authToken.token,                                                                                        // 68
    userId: authenticatingUser._id                                                                                     // 68
  };                                                                                                                   // 68
};                                                                                                                     // 41
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/nimble_restivus/lib/iron-router-error-to-response.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// We need a function that treats thrown errors exactly like Iron Router would.
// This file is written in JavaScript to enable copy-pasting Iron Router code.

// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L3
var env = process.env.NODE_ENV || 'development';

// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L47
ironRouterSendErrorToResponse = function (err, req, res) {
  if (res.statusCode < 400)
    res.statusCode = 500;

  if (err.status)
    res.statusCode = err.status;

  if (env === 'development')
    msg = (err.stack || err.toString()) + '\n';
  else
    //XXX get this from standard dict of error messages?
    msg = 'Server error.';

  console.error(err.stack || err.toString());

  if (res.headersSent)
    return req.socket.destroy();

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(msg));
  if (req.method === 'HEAD')
    return res.end();
  res.end(msg);
  return;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/nimble_restivus/lib/route.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
share.Route = function () {                                                                                            // 1
  function Route(api, path, options, endpoints1) {                                                                     // 3
    this.api = api;                                                                                                    // 3
    this.path = path;                                                                                                  // 3
    this.options = options;                                                                                            // 3
    this.endpoints = endpoints1;                                                                                       // 3
                                                                                                                       //
    if (!this.endpoints) {                                                                                             // 5
      this.endpoints = this.options;                                                                                   // 6
      this.options = {};                                                                                               // 7
    }                                                                                                                  // 10
  }                                                                                                                    // 3
                                                                                                                       //
  Route.prototype.addToApi = function () {                                                                             // 13
    var availableMethods;                                                                                              // 11
    availableMethods = ['get', 'post', 'put', 'patch', 'delete', 'options'];                                           // 11
    return function () {                                                                                               // 13
      var allowedMethods, fullPath, rejectedMethods, self;                                                             // 14
      self = this;                                                                                                     // 14
                                                                                                                       //
      if (_.contains(this.api._config.paths, this.path)) {                                                             // 18
        throw new Error("Cannot add a route at an existing path: " + this.path);                                       // 19
      }                                                                                                                // 21
                                                                                                                       //
      this.endpoints = _.extend({                                                                                      // 22
        options: this.api._config.defaultOptionsEndpoint                                                               // 22
      }, this.endpoints);                                                                                              // 22
                                                                                                                       //
      this._resolveEndpoints();                                                                                        // 25
                                                                                                                       //
      this._configureEndpoints();                                                                                      // 26
                                                                                                                       //
      this.api._config.paths.push(this.path);                                                                          // 29
                                                                                                                       //
      allowedMethods = _.filter(availableMethods, function (method) {                                                  // 31
        return _.contains(_.keys(self.endpoints), method);                                                             // 29
      });                                                                                                              // 31
      rejectedMethods = _.reject(availableMethods, function (method) {                                                 // 33
        return _.contains(_.keys(self.endpoints), method);                                                             // 32
      });                                                                                                              // 33
      fullPath = this.api._config.apiPath + this.path;                                                                 // 37
                                                                                                                       //
      _.each(allowedMethods, function (method) {                                                                       // 38
        var endpoint;                                                                                                  // 39
        endpoint = self.endpoints[method];                                                                             // 39
        return JsonRoutes.add(method, fullPath, function (req, res) {                                                  // 38
          var doneFunc, endpointContext, error, responseData, responseInitiated;                                       // 42
          responseInitiated = false;                                                                                   // 42
                                                                                                                       //
          doneFunc = function () {                                                                                     // 43
            return responseInitiated = true;                                                                           // 42
          };                                                                                                           // 43
                                                                                                                       //
          endpointContext = {                                                                                          // 46
            urlParams: req.params,                                                                                     // 47
            queryParams: req.query,                                                                                    // 48
            bodyParams: req.body,                                                                                      // 49
            request: req,                                                                                              // 50
            response: res,                                                                                             // 51
            done: doneFunc                                                                                             // 52
          };                                                                                                           // 47
                                                                                                                       //
          _.extend(endpointContext, endpoint);                                                                         // 54
                                                                                                                       //
          responseData = null;                                                                                         // 57
                                                                                                                       //
          try {                                                                                                        // 58
            responseData = self._callEndpoint(endpointContext, endpoint);                                              // 59
          } catch (error1) {                                                                                           // 58
            error = error1;                                                                                            // 60
            ironRouterSendErrorToResponse(error, req, res);                                                            // 62
            return;                                                                                                    // 63
          }                                                                                                            // 60
                                                                                                                       //
          if (responseInitiated) {                                                                                     // 65
            res.end();                                                                                                 // 67
            return;                                                                                                    // 68
          } else {                                                                                                     // 65
            if (res.headersSent) {                                                                                     // 70
              throw new Error("Must call this.done() after handling endpoint response manually: " + method + " " + fullPath);
            } else if (responseData === null || responseData === void 0) {                                             // 70
              throw new Error("Cannot return null or undefined from an endpoint: " + method + " " + fullPath);         // 73
            }                                                                                                          // 65
          }                                                                                                            // 70
                                                                                                                       //
          if (responseData.body && (responseData.statusCode || responseData.headers)) {                                // 76
            return self._respond(res, responseData.body, responseData.statusCode, responseData.headers);               // 72
          } else {                                                                                                     // 76
            return self._respond(res, responseData);                                                                   // 74
          }                                                                                                            // 75
        });                                                                                                            // 40
      });                                                                                                              // 38
                                                                                                                       //
      return _.each(rejectedMethods, function (method) {                                                               // 78
        return JsonRoutes.add(method, fullPath, function (req, res) {                                                  // 79
          var headers, responseData;                                                                                   // 83
          responseData = {                                                                                             // 83
            status: 'error',                                                                                           // 83
            message: 'API endpoint does not exist'                                                                     // 83
          };                                                                                                           // 83
          headers = {                                                                                                  // 84
            'Allow': allowedMethods.join(', ').toUpperCase()                                                           // 84
          };                                                                                                           // 84
          return self._respond(res, responseData, 405, headers);                                                       // 88
        });                                                                                                            // 82
      });                                                                                                              // 81
    };                                                                                                                 // 13
  }(); /*                                                                                                              // 10
         Convert all endpoints on the given route into our expected endpoint object if it is a bare                    //
         function                                                                                                      //
                                                                                                                       //
         @param {Route} route The route the endpoints belong to                                                        //
        */                                                                                                             //
                                                                                                                       //
  Route.prototype._resolveEndpoints = function () {                                                                    // 102
    _.each(this.endpoints, function (endpoint, method, endpoints) {                                                    // 95
      if (_.isFunction(endpoint)) {                                                                                    // 96
        return endpoints[method] = {                                                                                   // 105
          action: endpoint                                                                                             // 97
        };                                                                                                             // 97
      }                                                                                                                // 108
    });                                                                                                                // 95
  }; /*                                                                                                                // 94
       Configure the authentication and role requirement on all endpoints (except OPTIONS, which must                  //
       be configured directly on the endpoint)                                                                         //
                                                                                                                       //
       Authentication can be required on an entire route or individual endpoints. If required on an                    //
       entire route, that serves as the default. If required in any individual endpoints, that will                    //
       override the default.                                                                                           //
                                                                                                                       //
       After the endpoint is configured, all authentication and role requirements of an endpoint can be                //
       accessed at <code>endpoint.authRequired</code> and <code>endpoint.roleRequired</code>,                          //
       respectively.                                                                                                   //
                                                                                                                       //
       @param {Route} route The route the endpoints belong to                                                          //
       @param {Endpoint} endpoint The endpoint to configure                                                            //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._configureEndpoints = function () {                                                                  // 129
    _.each(this.endpoints, function (endpoint, method) {                                                               // 117
      var ref, ref1;                                                                                                   // 118
                                                                                                                       //
      if (method !== 'options') {                                                                                      // 118
        if (!((ref = this.options) != null ? ref.roleRequired : void 0)) {                                             // 120
          this.options.roleRequired = [];                                                                              // 121
        }                                                                                                              // 135
                                                                                                                       //
        if (!endpoint.roleRequired) {                                                                                  // 122
          endpoint.roleRequired = [];                                                                                  // 123
        }                                                                                                              // 138
                                                                                                                       //
        endpoint.roleRequired = _.union(endpoint.roleRequired, this.options.roleRequired);                             // 124
                                                                                                                       //
        if (_.isEmpty(endpoint.roleRequired)) {                                                                        // 126
          endpoint.roleRequired = false;                                                                               // 127
        }                                                                                                              // 142
                                                                                                                       //
        if (endpoint.authRequired === void 0) {                                                                        // 130
          if (((ref1 = this.options) != null ? ref1.authRequired : void 0) || endpoint.roleRequired) {                 // 131
            endpoint.authRequired = true;                                                                              // 132
          } else {                                                                                                     // 131
            endpoint.authRequired = false;                                                                             // 134
          }                                                                                                            // 130
        }                                                                                                              // 118
      }                                                                                                                // 150
    }, this);                                                                                                          // 117
  }; /*                                                                                                                // 116
       Authenticate an endpoint if required, and return the result of calling it                                       //
                                                                                                                       //
       @returns The endpoint response or a 401 if authentication fails                                                 //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._callEndpoint = function (endpointContext, endpoint) {                                               // 161
    var auth;                                                                                                          // 147
    auth = this._authAccepted(endpointContext, endpoint);                                                              // 147
                                                                                                                       //
    if (auth.success) {                                                                                                // 148
      if (this._roleAccepted(endpointContext, endpoint)) {                                                             // 149
        return endpoint.action.call(endpointContext);                                                                  // 150
      } else {                                                                                                         // 149
        return {                                                                                                       // 151
          statusCode: 403,                                                                                             // 152
          body: {                                                                                                      // 153
            status: 'error',                                                                                           // 153
            message: 'You do not have permission to do this.'                                                          // 153
          }                                                                                                            // 153
        };                                                                                                             // 151
      }                                                                                                                // 148
    } else {                                                                                                           // 148
      if (auth.data) {                                                                                                 // 156
        return auth.data;                                                                                              // 156
      } else {                                                                                                         // 156
        return {                                                                                                       // 157
          statusCode: 401,                                                                                             // 158
          body: {                                                                                                      // 159
            status: 'error',                                                                                           // 159
            message: 'You must be logged in to do this.'                                                               // 159
          }                                                                                                            // 159
        };                                                                                                             // 157
      }                                                                                                                // 148
    }                                                                                                                  // 188
  }; /*                                                                                                                // 145
       Authenticate the given endpoint if required                                                                     //
                                                                                                                       //
       Once it's globally configured in the API, authentication can be required on an entire route or                  //
       individual endpoints. If required on an entire endpoint, that serves as the default. If required                //
       in any individual endpoints, that will override the default.                                                    //
                                                                                                                       //
       @returns An object of the following format:                                                                     //
                                                                                                                       //
           {                                                                                                           //
             success: Boolean                                                                                          //
             data: String or Object                                                                                    //
           }                                                                                                           //
                                                                                                                       //
         where `success` is `true` if all required authentication checks pass and the optional `data`                  //
         will contain the auth data when successful and an optional error response when auth fails.                    //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._authAccepted = function (endpointContext, endpoint) {                                               // 210
    if (endpoint.authRequired) {                                                                                       // 181
      return this._authenticate(endpointContext);                                                                      // 182
    } else {                                                                                                           // 181
      return {                                                                                                         // 183
        success: true                                                                                                  // 183
      };                                                                                                               // 183
    }                                                                                                                  // 217
  }; /*                                                                                                                // 180
       Verify the request is being made by an actively logged in user                                                  //
                                                                                                                       //
       If verified, attach the authenticated user to the context.                                                      //
                                                                                                                       //
       @returns An object of the following format:                                                                     //
                                                                                                                       //
           {                                                                                                           //
             success: Boolean                                                                                          //
             data: String or Object                                                                                    //
           }                                                                                                           //
                                                                                                                       //
         where `success` is `true` if all required authentication checks pass and the optional `data`                  //
         will contain the auth data when successful and an optional error response when auth fails.                    //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._authenticate = function (endpointContext) {                                                         // 237
    var auth, userSelector;                                                                                            // 203
    auth = this.api._config.auth.user.call(endpointContext);                                                           // 203
                                                                                                                       //
    if (!auth) {                                                                                                       // 205
      return {                                                                                                         // 205
        success: false                                                                                                 // 205
      };                                                                                                               // 205
    }                                                                                                                  // 244
                                                                                                                       //
    if (auth.userId && auth.token && !auth.user) {                                                                     // 208
      userSelector = {};                                                                                               // 209
      userSelector._id = auth.userId;                                                                                  // 210
      userSelector[this.api._config.auth.token] = auth.token;                                                          // 211
      auth.user = Meteor.users.findOne(userSelector);                                                                  // 212
    }                                                                                                                  // 250
                                                                                                                       //
    if (auth.error) {                                                                                                  // 214
      return {                                                                                                         // 214
        success: false,                                                                                                // 214
        data: auth.error                                                                                               // 214
      };                                                                                                               // 214
    }                                                                                                                  // 256
                                                                                                                       //
    if (auth.user) {                                                                                                   // 217
      endpointContext.user = auth.user;                                                                                // 218
      endpointContext.userId = auth.user._id;                                                                          // 219
      return {                                                                                                         // 220
        success: true,                                                                                                 // 220
        data: auth                                                                                                     // 220
      };                                                                                                               // 220
    } else {                                                                                                           // 217
      return {                                                                                                         // 221
        success: false                                                                                                 // 221
      };                                                                                                               // 221
    }                                                                                                                  // 268
  }; /*                                                                                                                // 201
       Authenticate the user role if required                                                                          //
                                                                                                                       //
       Must be called after _authAccepted().                                                                           //
                                                                                                                       //
       @returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the                    //
                endpoint                                                                                               //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._roleAccepted = function (endpointContext, endpoint) {                                               // 281
    if (endpoint.roleRequired) {                                                                                       // 233
      if (_.isEmpty(_.intersection(endpoint.roleRequired, endpointContext.user.roles))) {                              // 234
        return false;                                                                                                  // 235
      }                                                                                                                // 233
    }                                                                                                                  // 286
                                                                                                                       //
    return true;                                                                                                       // 287
  }; /*                                                                                                                // 232
       Respond to an HTTP request                                                                                      //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._respond = function (response, body, statusCode, headers) {                                          // 295
    var defaultHeaders, delayInMilliseconds, minimumDelayInMilliseconds, randomMultiplierBetweenOneAndTwo, sendResponse;
                                                                                                                       //
    if (statusCode == null) {                                                                                          // 297
      statusCode = 200;                                                                                                // 242
    }                                                                                                                  // 299
                                                                                                                       //
    if (headers == null) {                                                                                             // 300
      headers = {};                                                                                                    // 242
    }                                                                                                                  // 302
                                                                                                                       //
    defaultHeaders = this._lowerCaseKeys(this.api._config.defaultHeaders);                                             // 245
    headers = this._lowerCaseKeys(headers);                                                                            // 246
    headers = _.extend(defaultHeaders, headers);                                                                       // 247
                                                                                                                       //
    if (headers['content-type'].match(/json|javascript/) !== null) {                                                   // 250
      if (this.api._config.prettyJson) {                                                                               // 251
        body = JSON.stringify(body, void 0, 2);                                                                        // 252
      } else {                                                                                                         // 251
        body = JSON.stringify(body);                                                                                   // 254
      }                                                                                                                // 250
    }                                                                                                                  // 312
                                                                                                                       //
    sendResponse = function () {                                                                                       // 257
      response.writeHead(statusCode, headers);                                                                         // 258
      response.write(body);                                                                                            // 259
      return response.end();                                                                                           // 316
    };                                                                                                                 // 257
                                                                                                                       //
    if (statusCode === 401 || statusCode === 403) {                                                                    // 261
      minimumDelayInMilliseconds = 500;                                                                                // 268
      randomMultiplierBetweenOneAndTwo = 1 + Math.random();                                                            // 269
      delayInMilliseconds = minimumDelayInMilliseconds * randomMultiplierBetweenOneAndTwo;                             // 270
      return Meteor.setTimeout(sendResponse, delayInMilliseconds);                                                     // 322
    } else {                                                                                                           // 261
      return sendResponse();                                                                                           // 324
    }                                                                                                                  // 325
  }; /*                                                                                                                // 242
       Return the object with all of the keys converted to lowercase                                                   //
      */                                                                                                               //
                                                                                                                       //
  Route.prototype._lowerCaseKeys = function (object) {                                                                 // 333
    return _.chain(object).pairs().map(function (attr) {                                                               // 334
      return [attr[0].toLowerCase(), attr[1]];                                                                         // 335
    }).object().value();                                                                                               // 279
  };                                                                                                                   // 278
                                                                                                                       //
  return Route;                                                                                                        // 339
}();                                                                                                                   // 341
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/nimble_restivus/lib/restivus.coffee.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function (item) {                                                                          // 1
  for (var i = 0, l = this.length; i < l; i++) {                                                                       // 1
    if (i in this && this[i] === item) return i;                                                                       // 1
  }                                                                                                                    // 1
                                                                                                                       //
  return -1;                                                                                                           // 1
};                                                                                                                     // 1
                                                                                                                       //
this.Restivus = function () {                                                                                          // 1
  function Restivus(options) {                                                                                         // 3
    var corsHeaders;                                                                                                   // 4
    this._routes = [];                                                                                                 // 4
    this._config = {                                                                                                   // 5
      paths: [],                                                                                                       // 6
      useDefaultAuth: false,                                                                                           // 7
      apiPath: 'api/',                                                                                                 // 8
      version: null,                                                                                                   // 9
      prettyJson: false,                                                                                               // 10
      auth: {                                                                                                          // 11
        token: 'services.resume.loginTokens.hashedToken',                                                              // 12
        user: function () {                                                                                            // 13
          var token;                                                                                                   // 14
                                                                                                                       //
          if (this.request.headers['x-auth-token']) {                                                                  // 14
            token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                    // 15
          }                                                                                                            // 20
                                                                                                                       //
          return {                                                                                                     // 21
            userId: this.request.headers['x-user-id'],                                                                 // 16
            token: token                                                                                               // 17
          };                                                                                                           // 16
        }                                                                                                              // 12
      },                                                                                                               // 12
      defaultHeaders: {                                                                                                // 18
        'Content-Type': 'application/json'                                                                             // 19
      },                                                                                                               // 19
      enableCors: true                                                                                                 // 20
    };                                                                                                                 // 6
                                                                                                                       //
    _.extend(this._config, options);                                                                                   // 23
                                                                                                                       //
    if (this._config.enableCors) {                                                                                     // 25
      corsHeaders = {                                                                                                  // 26
        'Access-Control-Allow-Origin': '*',                                                                            // 27
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'                               // 28
      };                                                                                                               // 27
                                                                                                                       //
      if (this._config.useDefaultAuth) {                                                                               // 30
        corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token';                                    // 31
      }                                                                                                                // 40
                                                                                                                       //
      _.extend(this._config.defaultHeaders, corsHeaders);                                                              // 34
                                                                                                                       //
      if (!this._config.defaultOptionsEndpoint) {                                                                      // 36
        this._config.defaultOptionsEndpoint = function () {                                                            // 37
          this.response.writeHead(200, corsHeaders);                                                                   // 38
          return this.done();                                                                                          // 45
        };                                                                                                             // 37
      }                                                                                                                // 25
    }                                                                                                                  // 48
                                                                                                                       //
    if (this._config.apiPath[0] === '/') {                                                                             // 42
      this._config.apiPath = this._config.apiPath.slice(1);                                                            // 43
    }                                                                                                                  // 51
                                                                                                                       //
    if (_.last(this._config.apiPath) !== '/') {                                                                        // 44
      this._config.apiPath = this._config.apiPath + '/';                                                               // 45
    }                                                                                                                  // 54
                                                                                                                       //
    if (this._config.version) {                                                                                        // 49
      this._config.apiPath += this._config.version + '/';                                                              // 50
    }                                                                                                                  // 57
                                                                                                                       //
    if (this._config.useDefaultAuth) {                                                                                 // 53
      this._initAuth();                                                                                                // 54
    } else if (this._config.useAuth) {                                                                                 // 53
      this._initAuth();                                                                                                // 56
                                                                                                                       //
      console.warn('Warning: useAuth API config option will be removed in Restivus v1.0 ' + '\n    Use the useDefaultAuth option instead');
    }                                                                                                                  // 63
                                                                                                                       //
    return this;                                                                                                       // 60
  } /**                                                                                                                // 3
      Add endpoints for the given HTTP methods at the given path                                                       //
                                                                                                                       //
      @param path {String} The extended URL path (will be appended to base path of the API)                            //
      @param options {Object} Route configuration options                                                              //
      @param options.authRequired {Boolean} The default auth requirement for each endpoint on the route                //
      @param options.roleRequired {String or String[]} The default role required for each endpoint on the route        //
      @param endpoints {Object} A set of endpoints available on the new route (get, post, put, patch, delete, options)
      @param endpoints.<method> {Function or Object} If a function is provided, all default route                      //
          configuration options will be applied to the endpoint. Otherwise an object with an `action`                  //
          and all other route config options available. An `action` must be provided with the object.                  //
     */                                                                                                                //
                                                                                                                       //
  Restivus.prototype.addRoute = function (path, options, endpoints) {                                                  // 81
    var route;                                                                                                         // 77
    route = new share.Route(this, path, options, endpoints);                                                           // 77
                                                                                                                       //
    this._routes.push(route);                                                                                          // 78
                                                                                                                       //
    route.addToApi();                                                                                                  // 80
    return this;                                                                                                       // 82
  }; /**                                                                                                               // 75
       Generate routes for the Meteor Collection with the given name                                                   //
      */                                                                                                               //
                                                                                                                       //
  Restivus.prototype.addCollection = function (collection, options) {                                                  // 94
    var collectionEndpoints, collectionRouteEndpoints, endpointsAwaitingConfiguration, entityRouteEndpoints, excludedEndpoints, methods, methodsOnCollection, path, routeOptions;
                                                                                                                       //
    if (options == null) {                                                                                             // 96
      options = {};                                                                                                    // 88
    }                                                                                                                  // 98
                                                                                                                       //
    methods = ['get', 'post', 'put', 'patch', 'delete', 'getAll'];                                                     // 89
    methodsOnCollection = ['post', 'getAll'];                                                                          // 90
                                                                                                                       //
    if (collection === Meteor.users) {                                                                                 // 93
      collectionEndpoints = this._userCollectionEndpoints;                                                             // 94
    } else {                                                                                                           // 93
      collectionEndpoints = this._collectionEndpoints;                                                                 // 96
    }                                                                                                                  // 105
                                                                                                                       //
    endpointsAwaitingConfiguration = options.endpoints || {};                                                          // 99
    routeOptions = options.routeOptions || {};                                                                         // 100
    excludedEndpoints = options.excludedEndpoints || [];                                                               // 101
    path = options.path || collection._name;                                                                           // 103
    collectionRouteEndpoints = {};                                                                                     // 107
    entityRouteEndpoints = {};                                                                                         // 108
                                                                                                                       //
    if (_.isEmpty(endpointsAwaitingConfiguration) && _.isEmpty(excludedEndpoints)) {                                   // 109
      _.each(methods, function (method) {                                                                              // 111
        if (indexOf.call(methodsOnCollection, method) >= 0) {                                                          // 113
          _.extend(collectionRouteEndpoints, collectionEndpoints[method].call(this, collection));                      // 114
        } else {                                                                                                       // 113
          _.extend(entityRouteEndpoints, collectionEndpoints[method].call(this, collection));                          // 115
        }                                                                                                              // 118
      }, this);                                                                                                        // 111
    } else {                                                                                                           // 109
      _.each(methods, function (method) {                                                                              // 120
        var configuredEndpoint, endpointOptions;                                                                       // 121
                                                                                                                       //
        if (indexOf.call(excludedEndpoints, method) < 0 && endpointsAwaitingConfiguration[method] !== false) {         // 121
          endpointOptions = endpointsAwaitingConfiguration[method];                                                    // 124
          configuredEndpoint = {};                                                                                     // 125
                                                                                                                       //
          _.each(collectionEndpoints[method].call(this, collection), function (action, methodType) {                   // 126
            return configuredEndpoint[methodType] = _.chain(action).clone().extend(endpointOptions).value();           // 127
          });                                                                                                          // 126
                                                                                                                       //
          if (indexOf.call(methodsOnCollection, method) >= 0) {                                                        // 133
            _.extend(collectionRouteEndpoints, configuredEndpoint);                                                    // 134
          } else {                                                                                                     // 133
            _.extend(entityRouteEndpoints, configuredEndpoint);                                                        // 135
          }                                                                                                            // 121
        }                                                                                                              // 134
      }, this);                                                                                                        // 120
    }                                                                                                                  // 136
                                                                                                                       //
    this.addRoute(path, routeOptions, collectionRouteEndpoints);                                                       // 140
    this.addRoute(path + "/:id", routeOptions, entityRouteEndpoints);                                                  // 141
    return this;                                                                                                       // 143
  }; /**                                                                                                               // 88
       A set of endpoints that can be applied to a Collection Route                                                    //
      */                                                                                                               //
                                                                                                                       //
  Restivus.prototype._collectionEndpoints = {                                                                          // 147
    get: function (collection) {                                                                                       // 150
      return {                                                                                                         // 149
        get: {                                                                                                         // 151
          action: function () {                                                                                        // 152
            var entity;                                                                                                // 153
            entity = collection.findOne(this.urlParams.id);                                                            // 153
                                                                                                                       //
            if (entity) {                                                                                              // 154
              return {                                                                                                 // 155
                status: 'success',                                                                                     // 155
                data: entity                                                                                           // 155
              };                                                                                                       // 155
            } else {                                                                                                   // 154
              return {                                                                                                 // 160
                statusCode: 404,                                                                                       // 157
                body: {                                                                                                // 158
                  status: 'fail',                                                                                      // 158
                  message: 'Item not found'                                                                            // 158
                }                                                                                                      // 158
              };                                                                                                       // 157
            }                                                                                                          // 167
          }                                                                                                            // 152
        }                                                                                                              // 152
      };                                                                                                               // 151
    },                                                                                                                 // 150
    put: function (collection) {                                                                                       // 159
      return {                                                                                                         // 173
        put: {                                                                                                         // 160
          action: function () {                                                                                        // 161
            var entity, entityIsUpdated;                                                                               // 162
            entityIsUpdated = collection.update(this.urlParams.id, this.bodyParams);                                   // 162
                                                                                                                       //
            if (entityIsUpdated) {                                                                                     // 163
              entity = collection.findOne(this.urlParams.id);                                                          // 164
              return {                                                                                                 // 180
                status: 'success',                                                                                     // 165
                data: entity                                                                                           // 165
              };                                                                                                       // 165
            } else {                                                                                                   // 163
              return {                                                                                                 // 185
                statusCode: 404,                                                                                       // 167
                body: {                                                                                                // 168
                  status: 'fail',                                                                                      // 168
                  message: 'Item not found'                                                                            // 168
                }                                                                                                      // 168
              };                                                                                                       // 167
            }                                                                                                          // 192
          }                                                                                                            // 161
        }                                                                                                              // 161
      };                                                                                                               // 160
    },                                                                                                                 // 150
    patch: function (collection) {                                                                                     // 169
      return {                                                                                                         // 198
        patch: {                                                                                                       // 170
          action: function () {                                                                                        // 171
            var entity, entityIsUpdated;                                                                               // 172
            entityIsUpdated = collection.update(this.urlParams.id, {                                                   // 172
              $set: this.bodyParams                                                                                    // 172
            });                                                                                                        // 172
                                                                                                                       //
            if (entityIsUpdated) {                                                                                     // 173
              entity = collection.findOne(this.urlParams.id);                                                          // 174
              return {                                                                                                 // 207
                status: 'success',                                                                                     // 175
                data: entity                                                                                           // 175
              };                                                                                                       // 175
            } else {                                                                                                   // 173
              return {                                                                                                 // 212
                statusCode: 404,                                                                                       // 177
                body: {                                                                                                // 178
                  status: 'fail',                                                                                      // 178
                  message: 'Item not found'                                                                            // 178
                }                                                                                                      // 178
              };                                                                                                       // 177
            }                                                                                                          // 219
          }                                                                                                            // 171
        }                                                                                                              // 171
      };                                                                                                               // 170
    },                                                                                                                 // 150
    "delete": function (collection) {                                                                                  // 179
      return {                                                                                                         // 225
        "delete": {                                                                                                    // 180
          action: function () {                                                                                        // 181
            if (collection.remove(this.urlParams.id)) {                                                                // 182
              return {                                                                                                 // 229
                status: 'success',                                                                                     // 183
                data: {                                                                                                // 183
                  message: 'Item removed'                                                                              // 183
                }                                                                                                      // 183
              };                                                                                                       // 183
            } else {                                                                                                   // 182
              return {                                                                                                 // 236
                statusCode: 404,                                                                                       // 185
                body: {                                                                                                // 186
                  status: 'fail',                                                                                      // 186
                  message: 'Item not found'                                                                            // 186
                }                                                                                                      // 186
              };                                                                                                       // 185
            }                                                                                                          // 243
          }                                                                                                            // 181
        }                                                                                                              // 181
      };                                                                                                               // 180
    },                                                                                                                 // 150
    post: function (collection) {                                                                                      // 187
      return {                                                                                                         // 249
        post: {                                                                                                        // 188
          action: function () {                                                                                        // 189
            var entity, entityId;                                                                                      // 190
            entityId = collection.insert(this.bodyParams);                                                             // 190
            entity = collection.findOne(entityId);                                                                     // 191
                                                                                                                       //
            if (entity) {                                                                                              // 192
              return {                                                                                                 // 256
                statusCode: 201,                                                                                       // 193
                body: {                                                                                                // 194
                  status: 'success',                                                                                   // 194
                  data: entity                                                                                         // 194
                }                                                                                                      // 194
              };                                                                                                       // 193
            } else {                                                                                                   // 192
              return {                                                                                                 // 264
                statusCode: 400,                                                                                       // 196
                body: {                                                                                                // 197
                  status: 'fail',                                                                                      // 197
                  message: 'No item added'                                                                             // 197
                }                                                                                                      // 197
              };                                                                                                       // 196
            }                                                                                                          // 271
          }                                                                                                            // 189
        }                                                                                                              // 189
      };                                                                                                               // 188
    },                                                                                                                 // 150
    getAll: function (collection) {                                                                                    // 198
      return {                                                                                                         // 277
        get: {                                                                                                         // 199
          action: function () {                                                                                        // 200
            var entities;                                                                                              // 201
            entities = collection.find().fetch();                                                                      // 201
                                                                                                                       //
            if (entities) {                                                                                            // 202
              return {                                                                                                 // 283
                status: 'success',                                                                                     // 203
                data: entities                                                                                         // 203
              };                                                                                                       // 203
            } else {                                                                                                   // 202
              return {                                                                                                 // 288
                statusCode: 404,                                                                                       // 205
                body: {                                                                                                // 206
                  status: 'fail',                                                                                      // 206
                  message: 'Unable to retrieve items from collection'                                                  // 206
                }                                                                                                      // 206
              };                                                                                                       // 205
            }                                                                                                          // 295
          }                                                                                                            // 200
        }                                                                                                              // 200
      };                                                                                                               // 199
    }                                                                                                                  // 150
  }; /**                                                                                                               // 150
       A set of endpoints that can be applied to a Meteor.users Collection Route                                       //
      */                                                                                                               //
  Restivus.prototype._userCollectionEndpoints = {                                                                      // 307
    get: function (collection) {                                                                                       // 213
      return {                                                                                                         // 309
        get: {                                                                                                         // 214
          action: function () {                                                                                        // 215
            var entity;                                                                                                // 216
            entity = collection.findOne(this.urlParams.id, {                                                           // 216
              fields: {                                                                                                // 216
                profile: 1                                                                                             // 216
              }                                                                                                        // 216
            });                                                                                                        // 216
                                                                                                                       //
            if (entity) {                                                                                              // 217
              return {                                                                                                 // 319
                status: 'success',                                                                                     // 218
                data: entity                                                                                           // 218
              };                                                                                                       // 218
            } else {                                                                                                   // 217
              return {                                                                                                 // 324
                statusCode: 404,                                                                                       // 220
                body: {                                                                                                // 221
                  status: 'fail',                                                                                      // 221
                  message: 'User not found'                                                                            // 221
                }                                                                                                      // 221
              };                                                                                                       // 220
            }                                                                                                          // 331
          }                                                                                                            // 215
        }                                                                                                              // 215
      };                                                                                                               // 214
    },                                                                                                                 // 213
    put: function (collection) {                                                                                       // 222
      return {                                                                                                         // 337
        put: {                                                                                                         // 223
          action: function () {                                                                                        // 224
            var entity, entityIsUpdated;                                                                               // 225
            entityIsUpdated = collection.update(this.urlParams.id, {                                                   // 225
              $set: {                                                                                                  // 225
                profile: this.bodyParams                                                                               // 225
              }                                                                                                        // 225
            });                                                                                                        // 225
                                                                                                                       //
            if (entityIsUpdated) {                                                                                     // 226
              entity = collection.findOne(this.urlParams.id, {                                                         // 227
                fields: {                                                                                              // 227
                  profile: 1                                                                                           // 227
                }                                                                                                      // 227
              });                                                                                                      // 227
              return {                                                                                                 // 352
                status: "success",                                                                                     // 228
                data: entity                                                                                           // 228
              };                                                                                                       // 228
            } else {                                                                                                   // 226
              return {                                                                                                 // 357
                statusCode: 404,                                                                                       // 230
                body: {                                                                                                // 231
                  status: 'fail',                                                                                      // 231
                  message: 'User not found'                                                                            // 231
                }                                                                                                      // 231
              };                                                                                                       // 230
            }                                                                                                          // 364
          }                                                                                                            // 224
        }                                                                                                              // 224
      };                                                                                                               // 223
    },                                                                                                                 // 213
    "delete": function (collection) {                                                                                  // 232
      return {                                                                                                         // 370
        "delete": {                                                                                                    // 233
          action: function () {                                                                                        // 234
            if (collection.remove(this.urlParams.id)) {                                                                // 235
              return {                                                                                                 // 374
                status: 'success',                                                                                     // 236
                data: {                                                                                                // 236
                  message: 'User removed'                                                                              // 236
                }                                                                                                      // 236
              };                                                                                                       // 236
            } else {                                                                                                   // 235
              return {                                                                                                 // 381
                statusCode: 404,                                                                                       // 238
                body: {                                                                                                // 239
                  status: 'fail',                                                                                      // 239
                  message: 'User not found'                                                                            // 239
                }                                                                                                      // 239
              };                                                                                                       // 238
            }                                                                                                          // 388
          }                                                                                                            // 234
        }                                                                                                              // 234
      };                                                                                                               // 233
    },                                                                                                                 // 213
    post: function (collection) {                                                                                      // 240
      return {                                                                                                         // 394
        post: {                                                                                                        // 241
          action: function () {                                                                                        // 242
            var entity, entityId;                                                                                      // 244
            entityId = Accounts.createUser(this.bodyParams);                                                           // 244
            entity = collection.findOne(entityId, {                                                                    // 245
              fields: {                                                                                                // 245
                profile: 1                                                                                             // 245
              }                                                                                                        // 245
            });                                                                                                        // 245
                                                                                                                       //
            if (entity) {                                                                                              // 246
              return {                                                                                                 // 405
                statusCode: 201,                                                                                       // 247
                body: {                                                                                                // 248
                  status: 'success',                                                                                   // 248
                  data: entity                                                                                         // 248
                }                                                                                                      // 248
              };                                                                                                       // 247
            } else {                                                                                                   // 246
              ({                                                                                                       // 250
                statusCode: 400                                                                                        // 250
              });                                                                                                      // 250
              return {                                                                                                 // 416
                status: 'fail',                                                                                        // 251
                message: 'No user added'                                                                               // 251
              };                                                                                                       // 251
            }                                                                                                          // 420
          }                                                                                                            // 242
        }                                                                                                              // 242
      };                                                                                                               // 241
    },                                                                                                                 // 213
    getAll: function (collection) {                                                                                    // 252
      return {                                                                                                         // 426
        get: {                                                                                                         // 253
          action: function () {                                                                                        // 254
            var entities;                                                                                              // 255
            entities = collection.find({}, {                                                                           // 255
              fields: {                                                                                                // 255
                profile: 1                                                                                             // 255
              }                                                                                                        // 255
            }).fetch();                                                                                                // 255
                                                                                                                       //
            if (entities) {                                                                                            // 256
              return {                                                                                                 // 436
                status: 'success',                                                                                     // 257
                data: entities                                                                                         // 257
              };                                                                                                       // 257
            } else {                                                                                                   // 256
              return {                                                                                                 // 441
                statusCode: 404,                                                                                       // 259
                body: {                                                                                                // 260
                  status: 'fail',                                                                                      // 260
                  message: 'Unable to retrieve users'                                                                  // 260
                }                                                                                                      // 260
              };                                                                                                       // 259
            }                                                                                                          // 448
          }                                                                                                            // 254
        }                                                                                                              // 254
      };                                                                                                               // 253
    }                                                                                                                  // 213
  }; /*                                                                                                                // 213
       Add /login and /logout endpoints to the API                                                                     //
      */                                                                                                               //
                                                                                                                       //
  Restivus.prototype._initAuth = function () {                                                                         // 460
    var logout, self;                                                                                                  // 267
    self = this; /*                                                                                                    // 267
                   Add a login endpoint to the API                                                                     //
                                                                                                                       //
                   After the user is logged in, the onLoggedIn hook is called (see Restfully.configure() for           //
                   adding hook).                                                                                       //
                  */                                                                                                   //
    this.addRoute('login', {                                                                                           // 274
      authRequired: false                                                                                              // 274
    }, {                                                                                                               // 274
      post: function () {                                                                                              // 275
        var auth, e, extraData, password, ref, ref1, response, searchQuery, user;                                      // 277
        user = {};                                                                                                     // 277
                                                                                                                       //
        if (this.bodyParams.user) {                                                                                    // 278
          if (this.bodyParams.user.indexOf('@') === -1) {                                                              // 279
            user.username = this.bodyParams.user;                                                                      // 280
          } else {                                                                                                     // 279
            user.email = this.bodyParams.user;                                                                         // 282
          }                                                                                                            // 278
        } else if (this.bodyParams.username) {                                                                         // 278
          user.username = this.bodyParams.username;                                                                    // 284
        } else if (this.bodyParams.email) {                                                                            // 283
          user.email = this.bodyParams.email;                                                                          // 286
        }                                                                                                              // 486
                                                                                                                       //
        password = this.bodyParams.password;                                                                           // 288
                                                                                                                       //
        if (this.bodyParams.hashed) {                                                                                  // 289
          password = {                                                                                                 // 290
            digest: password,                                                                                          // 291
            algorithm: 'sha-256'                                                                                       // 292
          };                                                                                                           // 291
        }                                                                                                              // 493
                                                                                                                       //
        try {                                                                                                          // 295
          auth = Auth.loginWithPassword(user, password);                                                               // 296
        } catch (error) {                                                                                              // 295
          e = error;                                                                                                   // 297
          return {                                                                                                     // 298
            statusCode: e.error,                                                                                       // 299
            body: {                                                                                                    // 300
              status: 'error',                                                                                         // 300
              message: e.reason                                                                                        // 300
            }                                                                                                          // 300
          };                                                                                                           // 299
        }                                                                                                              // 505
                                                                                                                       //
        if (auth.userId && auth.authToken) {                                                                           // 304
          searchQuery = {};                                                                                            // 305
          searchQuery[self._config.auth.token] = Accounts._hashLoginToken(auth.authToken);                             // 306
          this.user = Meteor.users.findOne({                                                                           // 307
            '_id': auth.userId                                                                                         // 308
          }, searchQuery);                                                                                             // 308
          this.userId = (ref = this.user) != null ? ref._id : void 0;                                                  // 310
        }                                                                                                              // 513
                                                                                                                       //
        response = {                                                                                                   // 312
          status: 'success',                                                                                           // 312
          data: auth                                                                                                   // 312
        };                                                                                                             // 312
        extraData = (ref1 = self._config.onLoggedIn) != null ? ref1.call(this) : void 0;                               // 315
                                                                                                                       //
        if (extraData != null) {                                                                                       // 316
          _.extend(response.data, {                                                                                    // 317
            extra: extraData                                                                                           // 317
          });                                                                                                          // 317
        }                                                                                                              // 523
                                                                                                                       //
        return response;                                                                                               // 524
      }                                                                                                                // 275
    });                                                                                                                // 275
                                                                                                                       //
    logout = function () {                                                                                             // 321
      var authToken, extraData, hashedToken, index, ref, response, tokenFieldName, tokenLocation, tokenPath, tokenRemovalQuery, tokenToRemove;
      authToken = this.request.headers['x-auth-token'];                                                                // 323
      hashedToken = Accounts._hashLoginToken(authToken);                                                               // 324
      tokenLocation = self._config.auth.token;                                                                         // 325
      index = tokenLocation.lastIndexOf('.');                                                                          // 326
      tokenPath = tokenLocation.substring(0, index);                                                                   // 327
      tokenFieldName = tokenLocation.substring(index + 1);                                                             // 328
      tokenToRemove = {};                                                                                              // 329
      tokenToRemove[tokenFieldName] = hashedToken;                                                                     // 330
      tokenRemovalQuery = {};                                                                                          // 331
      tokenRemovalQuery[tokenPath] = tokenToRemove;                                                                    // 332
      Meteor.users.update(this.user._id, {                                                                             // 333
        $pull: tokenRemovalQuery                                                                                       // 333
      });                                                                                                              // 333
      response = {                                                                                                     // 335
        status: 'success',                                                                                             // 335
        data: {                                                                                                        // 335
          message: 'You\'ve been logged out!'                                                                          // 335
        }                                                                                                              // 335
      };                                                                                                               // 335
      extraData = (ref = self._config.onLoggedOut) != null ? ref.call(this) : void 0;                                  // 338
                                                                                                                       //
      if (extraData != null) {                                                                                         // 339
        _.extend(response.data, {                                                                                      // 340
          extra: extraData                                                                                             // 340
        });                                                                                                            // 340
      }                                                                                                                // 553
                                                                                                                       //
      return response;                                                                                                 // 554
    }; /*                                                                                                              // 321
         Add a logout endpoint to the API                                                                              //
                                                                                                                       //
         After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for                   //
         adding hook).                                                                                                 //
        */                                                                                                             //
                                                                                                                       //
    return this.addRoute('logout', {                                                                                   // 563
      authRequired: true                                                                                               // 350
    }, {                                                                                                               // 350
      get: function () {                                                                                               // 351
        console.warn("Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead.");           // 352
        console.warn("    See https://github.com/kahmali/meteor-restivus/issues/100");                                 // 353
        return logout.call(this);                                                                                      // 354
      },                                                                                                               // 351
      post: logout                                                                                                     // 355
    });                                                                                                                // 351
  };                                                                                                                   // 266
                                                                                                                       //
  return Restivus;                                                                                                     // 575
}();                                                                                                                   // 577
                                                                                                                       //
Restivus = this.Restivus;                                                                                              // 357
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['nimble:restivus'] = {}, {
  Restivus: Restivus
});

})();

//# sourceMappingURL=nimble_restivus.js.map
