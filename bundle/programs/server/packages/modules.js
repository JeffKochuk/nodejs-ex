(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"server.js":["./install-packages.js","./buffer.js","./process.js","reify/lib/runtime",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/server.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
require("./install-packages.js");
require("./buffer.js");
require("./process.js");
require("reify/lib/runtime").enable(module.constructor);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/buffer.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
try {
  Buffer = global.Buffer || require("buffer").Buffer;
} catch (noBuffer) {}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"install-packages.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/install-packages.js                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
function install(name, mainModule) {
  var meteorDir = {};

  // Given a package name <name>, install a stub module in the
  // /node_modules/meteor directory called <name>.js, so that
  // require.resolve("meteor/<name>") will always return
  // /node_modules/meteor/<name>.js instead of something like
  // /node_modules/meteor/<name>/index.js, in the rare but possible event
  // that the package contains a file called index.js (#6590).

  if (mainModule) {
    meteorDir[name + ".js"] = [mainModule, function (require, e, module) {
      module.exports = require(mainModule);
    }];
  } else {
    // back compat with old Meteor packages
    meteorDir[name + ".js"] = function (r, e, module) {
      module.exports = Package[name];
    };
  }

  meteorInstall({
    node_modules: {
      meteor: meteorDir
    }
  });
}

// This file will be modified during computeJsOutputFilesMap to include
// install(<name>) calls for every Meteor package.

install("underscore");
install("meteor");
install("meteor-base");
install("mobile-experience");
install("npm-mongo");
install("modules-runtime");
install("modules", "meteor/modules/server.js");
install("es5-shim", "meteor/es5-shim/server.js");
install("promise", "meteor/promise/server.js");
install("ecmascript-runtime", "meteor/ecmascript-runtime/runtime.js");
install("babel-compiler");
install("ecmascript");
install("base64");
install("ejson");
install("id-map");
install("ordered-dict");
install("tracker");
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");
install("random");
install("mongo-id");
install("diff-sequence");
install("geojson-utils", "meteor/geojson-utils/main.js");
install("minimongo");
install("check", "meteor/check/match.js");
install("retry");
install("ddp-common");
install("ddp-client");
install("rate-limit");
install("ddp-rate-limiter");
install("logging");
install("routepolicy");
install("deps");
install("htmljs");
install("html-tools");
install("blaze-tools");
install("spacebars-compiler");
install("observe-sequence");
install("jquery");
install("reactive-var");
install("blaze");
install("spacebars");
install("ui");
install("boilerplate-generator");
install("webapp-hashing");
install("webapp");
install("callback-hook");
install("ddp-server");
install("ddp");
install("allow-deny");
install("binary-heap");
install("mongo");
install("standard-minifier-css");
install("standard-minifier-js");
install("tmeasday:check-npm-versions", "meteor/tmeasday:check-npm-versions/check-npm-versions.js");
install("react-meteor-data", "meteor/react-meteor-data/react-meteor-data.jsx");
install("chfritz:easycron");
install("session");
install("fourseven:scss");
install("poetic:materialize-scss");
install("themeteorchef:bert");
install("static-html");
install("coffeescript");
install("npm-bcrypt", "meteor/npm-bcrypt/wrapper.js");
install("accounts-base", "meteor/accounts-base/server_main.js");
install("sha");
install("srp");
install("email");
install("accounts-password");
install("simple:json-routes");
install("nimble:restivus");
install("shell-server", "meteor/shell-server/main.js");
install("livedata");
install("hot-code-push");
install("launch-screen");
install("autoupdate");
install("reload");
install("service-configuration");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/process.js                                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
try {
  // The application can run `npm install process` to provide its own
  // process stub; otherwise this module will provide a partial stub.
  process = global.process || require("process");
} catch (noProcess) {
  process = {};
}

if (Meteor.isServer) {
  // Make require("process") work on the server in all versions of Node.
  meteorInstall({
    node_modules: {
      "process.js": function (r, e, module) {
        module.exports = process;
      }
    }
  });
} else {
  process.platform = "browser";
  process.nextTick = process.nextTick || Meteor._setImmediate;
}

if (typeof process.env !== "object") {
  process.env = {};
}

_.extend(process.env, meteorEnv);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"reify":{"lib":{"runtime.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/modules/node_modules/reify/lib/runtime.js                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var Entry = require("./entry.js").Entry;
var utils = require("./utils.js");

exports.enable = function (Module) {
  var Mp = Module.prototype;

  if (typeof Mp.import === "function" &&
      typeof Mp.export === "function") {
    // If the Mp.{import,export} methods have already been
    // defined, abandon reification immediately.
    return Module;
  }

  // Platform-specific code should implement this method however
  // appropriate. Module.prototype.resolve(id) should return an absolute
  // version of the given module identifier, like require.resolve.
  Mp.resolve = Mp.resolve || function resolve(id) {
    throw new Error("Module.prototype.resolve not implemented");
  };

  // Platform-specific code should find a way to call this method whenever
  // the module system is about to return module.exports from require. This
  // might happen more than once per module, in case of dependency cycles,
  // so we want Module.prototype.runModuleSetters to run each time.
  Mp.runModuleSetters = function runModuleSetters(valueToPassThrough) {
    var entry = Entry.get(this.id);
    if (entry) {
      entry.runModuleSetters(this);
    }

    // Assignments to exported local variables get wrapped with calls to
    // module.runModuleSetters, so module.runModuleSetters returns the
    // valueToPassThrough parameter to allow the value of the original
    // expression to pass through. For example,
    //
    //   export var a = 1;
    //   console.log(a += 3);
    //
    // becomes
    //
    //   module.export("a", () => a);
    //   var a = 1;
    //   console.log(module.runModuleSetters(a += 3));
    //
    // This ensures module.runModuleSetters runs immediately after the
    // assignment, and does not interfere with the larger computation.
    return valueToPassThrough;
  };

  function setESModule(module) {
    var exports = module.exports;
    if (exports && typeof exports === "object") {
      exports.__esModule = true;
    }
  }

  // If key is provided, it will be used to identify the given setters so
  // that they can be replaced if module.import is called again with the
  // same key. This avoids potential memory leaks from import declarations
  // inside loops. The compiler generates these keys automatically (and
  // deterministically) when compiling nested import declarations.
  Mp.import = function (id, setters, key) {
    var module = this;
    setESModule(module);

    var absoluteId = module.resolve(id);

    if (setters && typeof setters === "object") {
      var entry = Entry.getOrCreate(absoluteId);
      entry.addSetters(module, setters, key);
    }

    var countBefore = entry && entry.runCount;
    var exports = typeof module.require === "function"
      ? module.require(absoluteId)
      : require(absoluteId);

    if (entry && entry.runCount === countBefore) {
      // If require(absoluteId) didn't run any setters for this entry,
      // perhaps because it's not the first time this module has been
      // required, run the setters now using an object that passes as the
      // real module object.
      entry.runModuleSetters({
        id: absoluteId,
        exports: exports,
        getExportByName: Mp.getExportByName
      });
    }
  };

  // Register getter functions for local variables in the scope of an
  // export statement. The keys of the getters object are exported names,
  // and the values are functions that return local values.
  Mp.export = function (getters) {
    var module = this;
    setESModule(module);

    if (utils.isPlainObject(getters)) {
      Entry.getOrCreate(module.id).addGetters(getters);
    }

    if (module.loaded) {
      // If the module has already been evaluated, then we need to trigger
      // another round of entry.runModuleSetters calls, which begins by
      // calling entry.runModuleGetters(module).
      module.runModuleSetters();
    }
  };

  // This method can be overridden by client code to implement custom export
  // naming logic. The current implementation works well with Babel's
  // __esModule convention.
  Mp.getExportByName = function (name) {
    var exports = this.exports;

    if (name === "*") {
      return exports;
    }

    if (name === "default" &&
        ! (exports &&
           typeof exports === "object" &&
           exports.__esModule &&
           "default" in exports)) {
      return exports;
    }

    return exports && exports[name];
  };

  return Module;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"node-fetch":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/node-fetch/package.json                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "node-fetch";
exports.version = "1.6.3";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/node-fetch/index.js                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //

/**
 * index.js
 *
 * a request API compatible with window.fetch
 */

var parse_url = require('url').parse;
var resolve_url = require('url').resolve;
var http = require('http');
var https = require('https');
var zlib = require('zlib');
var stream = require('stream');

var Body = require('./lib/body');
var Response = require('./lib/response');
var Headers = require('./lib/headers');
var Request = require('./lib/request');
var FetchError = require('./lib/fetch-error');

// commonjs
module.exports = Fetch;
// es6 default export compatibility
module.exports.default = module.exports;

/**
 * Fetch class
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function Fetch(url, opts) {

	// allow call as function
	if (!(this instanceof Fetch))
		return new Fetch(url, opts);

	// allow custom promise
	if (!Fetch.Promise) {
		throw new Error('native promise missing, set Fetch.Promise to your favorite alternative');
	}

	Body.Promise = Fetch.Promise;

	var self = this;

	// wrap http.request into fetch
	return new Fetch.Promise(function(resolve, reject) {
		// build request object
		var options = new Request(url, opts);

		if (!options.protocol || !options.hostname) {
			throw new Error('only absolute urls are supported');
		}

		if (options.protocol !== 'http:' && options.protocol !== 'https:') {
			throw new Error('only http(s) protocols are supported');
		}

		var send;
		if (options.protocol === 'https:') {
			send = https.request;
		} else {
			send = http.request;
		}

		// normalize headers
		var headers = new Headers(options.headers);

		if (options.compress) {
			headers.set('accept-encoding', 'gzip,deflate');
		}

		if (!headers.has('user-agent')) {
			headers.set('user-agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
		}

		if (!headers.has('connection') && !options.agent) {
			headers.set('connection', 'close');
		}

		if (!headers.has('accept')) {
			headers.set('accept', '*/*');
		}

		// detect form data input from form-data module, this hack avoid the need to pass multipart header manually
		if (!headers.has('content-type') && options.body && typeof options.body.getBoundary === 'function') {
			headers.set('content-type', 'multipart/form-data; boundary=' + options.body.getBoundary());
		}

		// bring node-fetch closer to browser behavior by setting content-length automatically
		if (!headers.has('content-length') && /post|put|patch|delete/i.test(options.method)) {
			if (typeof options.body === 'string') {
				headers.set('content-length', Buffer.byteLength(options.body));
			// detect form data input from form-data module, this hack avoid the need to add content-length header manually
			} else if (options.body && typeof options.body.getLengthSync === 'function') {
				// for form-data 1.x
				if (options.body._lengthRetrievers && options.body._lengthRetrievers.length == 0) {
					headers.set('content-length', options.body.getLengthSync().toString());
				// for form-data 2.x
				} else if (options.body.hasKnownLength && options.body.hasKnownLength()) {
					headers.set('content-length', options.body.getLengthSync().toString());
				}
			// this is only necessary for older nodejs releases (before iojs merge)
			} else if (options.body === undefined || options.body === null) {
				headers.set('content-length', '0');
			}
		}

		options.headers = headers.raw();

		// http.request only support string as host header, this hack make custom host header possible
		if (options.headers.host) {
			options.headers.host = options.headers.host[0];
		}

		// send request
		var req = send(options);
		var reqTimeout;

		if (options.timeout) {
			req.once('socket', function(socket) {
				reqTimeout = setTimeout(function() {
					req.abort();
					reject(new FetchError('network timeout at: ' + options.url, 'request-timeout'));
				}, options.timeout);
			});
		}

		req.on('error', function(err) {
			clearTimeout(reqTimeout);
			reject(new FetchError('request to ' + options.url + ' failed, reason: ' + err.message, 'system', err));
		});

		req.on('response', function(res) {
			clearTimeout(reqTimeout);

			// handle redirect
			if (self.isRedirect(res.statusCode) && options.redirect !== 'manual') {
				if (options.redirect === 'error') {
					reject(new FetchError('redirect mode is set to error: ' + options.url, 'no-redirect'));
					return;
				}

				if (options.counter >= options.follow) {
					reject(new FetchError('maximum redirect reached at: ' + options.url, 'max-redirect'));
					return;
				}

				if (!res.headers.location) {
					reject(new FetchError('redirect location header missing at: ' + options.url, 'invalid-redirect'));
					return;
				}

				// per fetch spec, for POST request with 301/302 response, or any request with 303 response, use GET when following redirect
				if (res.statusCode === 303
					|| ((res.statusCode === 301 || res.statusCode === 302) && options.method === 'POST'))
				{
					options.method = 'GET';
					delete options.body;
					delete options.headers['content-length'];
				}

				options.counter++;

				resolve(Fetch(resolve_url(options.url, res.headers.location), options));
				return;
			}

			// normalize location header for manual redirect mode
			var headers = new Headers(res.headers);
			if (options.redirect === 'manual' && headers.has('location')) {
				headers.set('location', resolve_url(options.url, headers.get('location')));
			}

			// prepare response
			var body = res.pipe(new stream.PassThrough());
			var response_options = {
				url: options.url
				, status: res.statusCode
				, statusText: res.statusMessage
				, headers: headers
				, size: options.size
				, timeout: options.timeout
			};

			// response object
			var output;

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no content-encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!options.compress || options.method === 'HEAD' || !headers.has('content-encoding') || res.statusCode === 204 || res.statusCode === 304) {
				output = new Response(body, response_options);
				resolve(output);
				return;
			}

			// otherwise, check for gzip or deflate
			var name = headers.get('content-encoding');

			// for gzip
			if (name == 'gzip' || name == 'x-gzip') {
				body = body.pipe(zlib.createGunzip());
				output = new Response(body, response_options);
				resolve(output);
				return;

			// for deflate
			} else if (name == 'deflate' || name == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				var raw = res.pipe(new stream.PassThrough());
				raw.once('data', function(chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					output = new Response(body, response_options);
					resolve(output);
				});
				return;
			}

			// otherwise, use response as-is
			output = new Response(body, response_options);
			resolve(output);
			return;
		});

		// accept string, buffer or readable stream as body
		// per spec we will call tostring on non-stream objects
		if (typeof options.body === 'string') {
			req.write(options.body);
			req.end();
		} else if (options.body instanceof Buffer) {
			req.write(options.body);
			req.end()
		} else if (typeof options.body === 'object' && options.body.pipe) {
			options.body.pipe(req);
		} else if (typeof options.body === 'object') {
			req.write(options.body.toString());
			req.end();
		} else {
			req.end();
		}
	});

};

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
Fetch.prototype.isRedirect = function(code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
}

// expose Promise
Fetch.Promise = global.Promise;
Fetch.Response = Response;
Fetch.Headers = Headers;
Fetch.Request = Request;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"babel-runtime":{"helpers":{"extends.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/extends.js                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"typeof.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/typeof.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"classCallCheck.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/classCallCheck.js                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"possibleConstructorReturn.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/possibleConstructorReturn.js                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"inherits.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/inherits.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"regenerator":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/regenerator/index.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = require("regenerator-runtime");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"mysql":{"index.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/mysql/index.js                                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var Classes = Object.create(null);

/**
 * Create a new Connection instance.
 * @param {object|string} config Configuration or connection string for new MySQL connection
 * @return {Connection} A new MySQL connection
 * @public
 */
exports.createConnection = function createConnection(config) {
  var Connection       = loadClass('Connection');
  var ConnectionConfig = loadClass('ConnectionConfig');

  return new Connection({config: new ConnectionConfig(config)});
};

/**
 * Create a new Pool instance.
 * @param {object|string} config Configuration or connection string for new MySQL connections
 * @return {Pool} A new MySQL pool
 * @public
 */
exports.createPool = function createPool(config) {
  var Pool       = loadClass('Pool');
  var PoolConfig = loadClass('PoolConfig');

  return new Pool({config: new PoolConfig(config)});
};

/**
 * Create a new PoolCluster instance.
 * @param {object} [config] Configuration for pool cluster
 * @return {PoolCluster} New MySQL pool cluster
 * @public
 */
exports.createPoolCluster = function createPoolCluster(config) {
  var PoolCluster = loadClass('PoolCluster');

  return new PoolCluster(config);
};

/**
 * Create a new Query instance.
 * @param {string} sql The SQL for the query
 * @param {array} [values] Any values to insert into placeholders in sql
 * @param {function} [callback] The callback to use when query is complete
 * @return {Query} New query object
 * @public
 */
exports.createQuery = function createQuery(sql, values, callback) {
  var Connection = loadClass('Connection');

  return Connection.createQuery(sql, values, callback);
};

/**
 * Escape a value for SQL.
 * @param {*} value The value to escape
 * @param {boolean} [stringifyObjects=false] Setting if objects should be stringified
 * @param {string} [timeZone=local] Setting for time zone to use for Date conversion
 * @return {string} Escaped string value
 * @public
 */
exports.escape = function escape(value, stringifyObjects, timeZone) {
  var SqlString = loadClass('SqlString');

  return SqlString.escape(value, stringifyObjects, timeZone);
};

/**
 * Escape an identifier for SQL.
 * @param {*} value The value to escape
 * @param {boolean} [forbidQualified=false] Setting to treat '.' as part of identifier
 * @return {string} Escaped string value
 * @public
 */
exports.escapeId = function escapeId(value, forbidQualified) {
  var SqlString = loadClass('SqlString');

  return SqlString.escapeId(value, forbidQualified);
};

/**
 * Format SQL and replacement values into a SQL string.
 * @param {string} sql The SQL for the query
 * @param {array} [values] Any values to insert into placeholders in sql
 * @param {boolean} [stringifyObjects=false] Setting if objects should be stringified
 * @param {string} [timeZone=local] Setting for time zone to use for Date conversion
 * @return {string} Formatted SQL string
 * @public
 */
exports.format = function format(sql, values, stringifyObjects, timeZone) {
  var SqlString = loadClass('SqlString');

  return SqlString.format(sql, values, stringifyObjects, timeZone);
};

/**
 * The type constants.
 * @public
 */
Object.defineProperty(exports, 'Types', {
  get: loadClass.bind(null, 'Types')
});

/**
 * Load the given class.
 * @param {string} className Name of class to default
 * @return {function|object} Class constructor or exports
 * @private
 */
function loadClass(className) {
  var Class = Classes[className];

  if (Class !== undefined) {
    return Class;
  }

  // This uses a switch for static require analysis
  switch (className) {
    case 'Connection':
      Class = require('./lib/Connection');
      break;
    case 'ConnectionConfig':
      Class = require('./lib/ConnectionConfig');
      break;
    case 'Pool':
      Class = require('./lib/Pool');
      break;
    case 'PoolCluster':
      Class = require('./lib/PoolCluster');
      break;
    case 'PoolConfig':
      Class = require('./lib/PoolConfig');
      break;
    case 'SqlString':
      Class = require('./lib/protocol/SqlString');
      break;
    case 'Types':
      Class = require('./lib/protocol/constants/types');
      break;
    default:
      throw new Error('Cannot find class \'' + className + '\'');
  }

  // Store to prevent invoking require()
  Classes[className] = Class;

  return Class;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"react":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/react/package.json                                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "react";
exports.version = "15.3.2";
exports.main = "react.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"react.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/react/react.js                                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
'use strict';

module.exports = require('./lib/React');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"react-addons-pure-render-mixin":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/react-addons-pure-render-mixin/package.json                                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "react-addons-pure-render-mixin";
exports.version = "15.3.2";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/react-addons-pure-render-mixin/index.js                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = require('react/lib/ReactComponentWithPureRenderMixin');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"bcrypt":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/bcrypt/package.json                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "bcrypt";
exports.version = "1.0.2";
exports.main = "./bcrypt";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"bcrypt.js":function(require,exports,module,__filename,__dirname){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/bcrypt/bcrypt.js                                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
'use strict';

var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname, './package.json')));
var bindings = require(binding_path);

var crypto = require('crypto');

var promises = require('./lib/promises');

/// generate a salt (sync)
/// @param {Number} [rounds] number of rounds (default 10)
/// @return {String} salt
module.exports.genSaltSync = function genSaltSync(rounds) {
    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        throw new Error('rounds must be a number');
    }

    return bindings.gen_salt_sync(rounds, crypto.randomBytes(16));
};

/// generate a salt
/// @param {Number} [rounds] number of rounds (default 10)
/// @param {Function} cb callback(err, salt)
module.exports.genSalt = function genSalt(rounds, ignore, cb) {
    // if callback is first argument, then use defaults for others
    if (typeof arguments[0] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[0];
        rounds = 10;
    // callback is second argument
    } else if (typeof arguments[1] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[1];
    }

    if (!cb) {
        return promises.promise(genSalt, this, [rounds, ignore]);
    }

    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        // callback error asynchronously
        return process.nextTick(function() {
            cb(new Error('rounds must be a number'));
        });
    }

    crypto.randomBytes(16, function(error, randomBytes) {
        if (error) {
            cb(error);
            return;
        }

        bindings.gen_salt(rounds, randomBytes, cb);
    });
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @return {String} hash
module.exports.hashSync = function hashSync(data, salt) {
    if (data == null || salt == null) {
        throw new Error('data and salt arguments required');
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        throw new Error('data must be a string and salt must either be a salt string or a number of rounds');
    }

    if (typeof salt === 'number') {
        salt = module.exports.genSaltSync(salt);
    }

    return bindings.encrypt_sync(data, salt);
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @param {Function} cb callback(err, hash)
module.exports.hash = function hash(data, salt, cb) {
    if (typeof data === 'function') {
        return process.nextTick(function() {
            data(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (typeof salt === 'function') {
        return process.nextTick(function() {
            salt(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    // cb exists but is not a function
    // return a rejecting promise
    if (cb && typeof cb !== 'function') {
        return promises.reject(new Error('cb must be a function or null to return a Promise'));
    }

    if (!cb) {
        return promises.promise(hash, this, [data, salt]);
    }

    if (data == null || salt == null) {
        return process.nextTick(function() {
            cb(new Error('data and salt arguments required'));
        });
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        return process.nextTick(function() {
            cb(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }


    if (typeof salt === 'number') {
        return module.exports.genSalt(salt, function(err, salt) {
            return bindings.encrypt(data, salt, cb);
        });
    }

    return bindings.encrypt(data, salt, cb);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @return {bool} true if hashed data matches hash
module.exports.compareSync = function compareSync(data, hash) {
    if (data == null || hash == null) {
        throw new Error('data and hash arguments required');
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        throw new Error('data and hash must be strings');
    }

    return bindings.compare_sync(data, hash);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @param {Function} cb callback(err, matched) - matched is true if hashed data matches hash
module.exports.compare = function compare(data, hash, cb) {
    if (typeof data === 'function') {
        return process.nextTick(function() {
            data(new Error('data and hash arguments required'));
        });
    }

    if (typeof hash === 'function') {
        return process.nextTick(function() {
            hash(new Error('data and hash arguments required'));
        });
    }

    // cb exists but is not a function
    // return a rejecting promise
    if (cb && typeof cb !== 'function') {
        return promises.reject(new Error('cb must be a function or null to return a Promise'));
    }

    if (!cb) {
        return promises.promise(compare, this, [data, hash]);
    }

    if (data == null || hash == null) {
        return process.nextTick(function() {
            cb(new Error('data and hash arguments required'));
        });
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        return process.nextTick(function() {
            cb(new Error('data and hash must be strings'));
        });
    }

    return bindings.compare(data, hash, cb);
};

/// @param {String} hash extract rounds from this hash
/// @return {Number} the number of rounds used to encrypt a given hash
module.exports.getRounds = function getRounds(hash) {
    if (hash == null) {
        throw new Error('hash argument required');
    }

    if (typeof hash !== 'string') {
        throw new Error('hash must be a string');
    }

    return bindings.get_rounds(hash);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();
