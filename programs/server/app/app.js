var require = meteorInstall({"imports":{"helpers":{"mysql.js":["mysql",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/helpers/mysql.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.__esModule = true;                                                                                             //
exports.getQueryPromise = exports.getConnection = undefined;                                                           //
                                                                                                                       //
var _mysql = require("mysql");                                                                                         // 1
                                                                                                                       //
var _mysql2 = _interopRequireDefault(_mysql);                                                                          //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var getConnection = exports.getConnection = function getConnection() {                                                 // 3
    // const connection = mysql.createConnection({                                                                     //
    //     host     : "584099dfecdd5c15db000029-marketing.itos.redhat.com",                                            //
    //     port     : 54816,                                                                                           //
    //     user     : "adminYeMvBUb",                                                                                  //
    //     password : "nVNdcJBDaazL",                                                                                  //
    //     database : "workflows1",                                                                                    //
    //     multipleStatements: "true"                                                                                  //
    // });                                                                                                             //
    var connection = _mysql2["default"].createConnection(JSON.parse(process.env.MYSQL_OBJECT));                        // 12
    connection.connect();                                                                                              // 13
    return connection;                                                                                                 // 14
};                                                                                                                     //
                                                                                                                       //
var getQueryPromise = exports.getQueryPromise = function getQueryPromise() {                                           // 17
    var connection = getConnection();                                                                                  // 18
    return function (qString) {                                                                                        // 19
        return new Promise(function (resolve, reject) {                                                                // 20
            connection.query(qString, function (err, data) {                                                           // 21
                if (err) return reject(err);                                                                           // 22
                resolve(data);                                                                                         // 23
            });                                                                                                        //
        });                                                                                                            //
    };                                                                                                                 //
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stats.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/helpers/stats.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.__esModule = true;                                                                                             //
/**                                                                                                                    //
 * Created by jkochuk on 10/5/16.                                                                                      //
 */                                                                                                                    //
var eloquaMap = new Map().set("C_Lead_Rating___Combined1", 'Lead Rating').set("C_Lead_Ranking1", 'Lead Ranking').set("C_Company", 'Company').set("C_Company_Size11", 'Company Size').set("C_Derived__Persona1", 'Persona').set("C_Industry1", 'Industry').set("C_Derived_Language_Preference1", 'Language').set("C_Country", 'Country');
                                                                                                                       //
var mysqlMap = new Map().set("MLSMScore", 'Lead Rating').set("MLSMRank", 'Lead Ranking').set("Company", 'Company').set("Size", 'Company Size').set("Persona", 'Persona').set("Industry", 'Industry').set("Language", 'Language').set("Country", 'Country');
                                                                                                                       //
var mapsAvailable = {                                                                                                  // 24
    eloqua: eloquaMap,                                                                                                 // 25
    mysql: mysqlMap                                                                                                    // 26
};                                                                                                                     //
                                                                                                                       //
// Function accumulateStats takes an eloqua response's ELEMENTS field and counts the occurances for each value.        //
// Also can take the result of a mysql query and handle it the same way                                                //
var accumulateStats = function accumulateStats(elements, source, stats) {                                              // 32
    if (source !== 'mysql' && source !== 'eloqua') {                                                                   // 33
        throw new Error('accumulateStats called without specifying the source');                                       // 34
    }                                                                                                                  //
    var mapToUse = mapsAvailable[source];                                                                              // 36
                                                                                                                       //
    // Initialize our array if nothing was passed                                                                      //
    if (!stats) {                                                                                                      // 32
        stats = { total: 0 };                                                                                          // 40
        mapToUse.forEach(function (val) {                                                                              // 41
            return stats[val] = {};                                                                                    //
        });                                                                                                            //
    }                                                                                                                  //
    // Make sure we hve a total field available in stats;                                                              //
    if (!stats.total) {                                                                                                // 32
        stats.total = 0;                                                                                               // 45
    }                                                                                                                  //
    // Accumulate values of statsMap into stats;                                                                       //
                                                                                                                       // 32
    var _loop = function _loop(el) {                                                                                   //
        mapToUse.forEach(function (statAccumulatorName, eloquaFieldName) {                                             // 49
            // Mongo will be sad if we don't escape . and $ with alternate characters                                  //
            if (el[eloquaFieldName]) {                                                                                 // 51
                el[eloquaFieldName] = el[eloquaFieldName].replace(/\./g, "．").replace(/\$/g, "＄");                     // 52
            }                                                                                                          //
            // Set or increment the stats, where 'VAL' is the stat name and 'el[key]' is the stat value                //
            stats[statAccumulatorName][el[eloquaFieldName]] = stats[statAccumulatorName][el[eloquaFieldName]] + (el.count || 1) || el.count || 1;
        });                                                                                                            //
        stats.total += el.count || 1;                                                                                  // 57
    };                                                                                                                 //
                                                                                                                       //
    for (var _iterator = elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;                                                                                                      //
                                                                                                                       //
        if (_isArray) {                                                                                                //
            if (_i >= _iterator.length) break;                                                                         //
            _ref = _iterator[_i++];                                                                                    //
        } else {                                                                                                       //
            _i = _iterator.next();                                                                                     //
            if (_i.done) break;                                                                                        //
            _ref = _i.value;                                                                                           //
        }                                                                                                              //
                                                                                                                       //
        var el = _ref;                                                                                                 //
                                                                                                                       //
        _loop(el);                                                                                                     //
    }                                                                                                                  //
    return stats;                                                                                                      // 59
};                                                                                                                     //
                                                                                                                       //
exports.accumulateStats = accumulateStats;                                                                             //
exports.mysqlMap = mysqlMap;                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"collections.js":["meteor/mongo",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/collections.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.__esModule = true;                                                                                             //
exports.SqlCache = exports.Stats = exports.Logs = exports.EloquaLogs = exports.Segments = undefined;                   //
                                                                                                                       //
var _mongo = require('meteor/mongo');                                                                                  // 1
                                                                                                                       //
var Segments = exports.Segments = new _mongo.Mongo.Collection('segments');                                             // 3
var EloquaLogs = exports.EloquaLogs = new _mongo.Mongo.Collection('eloquaLogs');                                       // 4
var Logs = exports.Logs = new _mongo.Mongo.Collection('logs');                                                         // 5
var Stats = exports.Stats = new _mongo.Mongo.Collection('statCache');                                                  // 6
var SqlCache = exports.SqlCache = new _mongo.Mongo.Collection('sqlCache');                                             // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"server":{"getEloquaData.js":["node-fetch","../imports/collections.js",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/getEloquaData.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.__esModule = true;                                                                                             //
exports.LEIA_VIEW_URL = exports.CONTACTS_URL = exports.SEGMENTS_URL = exports.getEloquaDataResults = exports.getEloquaDataPromise = exports.getOneEloquaPage = undefined;
                                                                                                                       //
var _nodeFetch = require('node-fetch');                                                                                // 1
                                                                                                                       //
var _nodeFetch2 = _interopRequireDefault(_nodeFetch);                                                                  //
                                                                                                                       //
var _collections = require('../imports/collections.js');                                                               // 2
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                      //
                                                                                                                       //
var EloquaOptions = {                                                                                                  // 3
  headers: {                                                                                                           // 4
    authorization: process.env.AUTHORIZATION                                                                           // 5
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
var getOneEloquaPage = exports.getOneEloquaPage = function getOneEloquaPage(id) {                                      // 9
  var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];                                   //
                                                                                                                       //
  if (!id) throw new Meteor.Error('id: ' + id + ' is not valid');                                                      // 10
  var url = LEIA_VIEW_URL + '/' + id + '?page=' + page;                                                                // 11
  return (0, _nodeFetch2['default'])(url, EloquaOptions).then(function (res) {                                         // 12
    return res.json();                                                                                                 //
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
// Take an Eloqua URI and a function. Applies the function to the body of each page. Use this one to insert values     //
var getEloquaDataPromise = exports.getEloquaDataPromise = function getEloquaDataPromise(url, applyToEach) {            // 17
  console.log('Getting URL Promise: ' + url);                                                                          // 18
  return (0, _nodeFetch2['default'])(url, EloquaOptions).then(function (res) {                                         // 19
    return res.json();                                                                                                 //
  }).then(function (body) {                                                                                            //
    console.log(body.total + 'elements in query');                                                                     // 22
    var numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);                                        // 23
    _collections.EloquaLogs.insert({ url: url, numPagesToGet: numPagesToGet, date: new Date() });                      // 24
    var pagesArray = [];                                                                                               // 25
    applyToEach(body);                                                                                                 // 26
    if (numPagesToGet > 1) {                                                                                           // 27
      for (var i = 1; i < numPagesToGet; i++) {                                                                        // 28
        pagesArray.push((0, _nodeFetch2['default'])(url + '?page=' + (i + 1), EloquaOptions).then(function (res) {     // 29
          return res.json();                                                                                           //
        }).then(applyToEach));                                                                                         //
      }                                                                                                                //
      Promise.all(pagesArray).await();                                                                                 // 35
    }                                                                                                                  //
    return body.total;                                                                                                 // 37
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
// Get eloqua data and return all data as an array                                                                     //
var getEloquaDataResults = exports.getEloquaDataResults = function getEloquaDataResults(url) {                         // 42
  console.log('Getting URL Promise: ' + url);                                                                          // 43
  return (0, _nodeFetch2['default'])(url, EloquaOptions).then(function (res) {                                         // 44
    return res.json();                                                                                                 //
  }).then(function (body) {                                                                                            //
    console.log(body.total + 'elements in query');                                                                     // 47
    var numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);                                        // 48
    _collections.EloquaLogs.insert({ url: url, numPagesToGet: numPagesToGet, date: new Date() });                      // 49
    var pagesArray = [];                                                                                               // 50
    var retArray = body.elements;                                                                                      // 51
    if (numPagesToGet > 1) {                                                                                           // 52
      for (var i = 1; i < numPagesToGet; i++) {                                                                        // 53
        pagesArray.push((0, _nodeFetch2['default'])(url + '?page=' + (i + 1), EloquaOptions).then(function (res) {     // 54
          return res.json();                                                                                           //
        }).then(function (json) {                                                                                      //
          return json.elements;                                                                                        //
        }));                                                                                                           //
      }                                                                                                                //
      var newElements = Promise.all(pagesArray).await();                                                               // 60
      for (var _iterator = newElements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;                                                                                                      //
                                                                                                                       //
        if (_isArray) {                                                                                                //
          if (_i >= _iterator.length) break;                                                                           //
          _ref = _iterator[_i++];                                                                                      //
        } else {                                                                                                       //
          _i = _iterator.next();                                                                                       //
          if (_i.done) break;                                                                                          //
          _ref = _i.value;                                                                                             //
        }                                                                                                              //
                                                                                                                       //
        var row = _ref;                                                                                                //
                                                                                                                       //
        retArray = retArray.concat(row);                                                                               // 62
      }                                                                                                                //
    }                                                                                                                  //
                                                                                                                       //
    return retArray;                                                                                                   // 66
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
// NO ID NEEDED for Segments_url                                                                                       //
var SEGMENTS_URL = exports.SEGMENTS_URL = 'https://secure.p01.eloqua.com/Api/rest/2.0/assets/contact/segments';        // 71
// MAKE SURE to add a ID to CONTACTS_URL                                                                               //
// https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment/943                            //
var CONTACTS_URL = exports.CONTACTS_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment';
                                                                                                                       //
var LEIA_VIEW_URL = exports.LEIA_VIEW_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100190/contacts/segment';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"segmentBuilderMethods.js":["babel-runtime/helpers/objectWithoutProperties","meteor/meteor","../imports/helpers/mysql.js","es6-promisify","../imports/helpers/stats.js","node-fetch","sqlstring",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethods.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');                              //
                                                                                                                       //
var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);                                     //
                                                                                                                       //
var _meteor = require('meteor/meteor');                                                                                // 5
                                                                                                                       //
var _mysql = require('../imports/helpers/mysql.js');                                                                   // 6
                                                                                                                       //
var _es6Promisify = require('es6-promisify');                                                                          // 7
                                                                                                                       //
var _es6Promisify2 = _interopRequireDefault(_es6Promisify);                                                            //
                                                                                                                       //
var _stats = require('../imports/helpers/stats.js');                                                                   // 8
                                                                                                                       //
var _nodeFetch = require('node-fetch');                                                                                // 9
                                                                                                                       //
var _nodeFetch2 = _interopRequireDefault(_nodeFetch);                                                                  //
                                                                                                                       //
var _sqlstring = require('sqlstring');                                                                                 // 10
                                                                                                                       //
var _sqlstring2 = _interopRequireDefault(_sqlstring);                                                                  //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                      //
                                                                                                                       //
// Data should look like this                                                                                          //
// {                                                                                                                   //
//      email: "jkochuk@redhat.com",                                                                                   //
//      areasOfInterest: Array[2],                                                                                     //
//      interestSource: Array[1],                                                                                      //
//      activeUsers: false,                                                                                            //
//      personas: Array[2],                                                                                            //
//      completeness: true,                                                                                            //
//      geography: "",                                                                                                 //
//      geographyRadius: "",                                                                                           //
//      industry: Array[1]                                                                                             //
// }                                                                                                                   //
/**                                                                                                                    //
 * Created by jkochuk on 10/3/16.                                                                                      //
 */                                                                                                                    //
                                                                                                                       //
var statsFields = ['Language', 'Size', 'Industry', 'SuperRegion', 'Persona'];                                          // 24
var sparseStatsFields = ['Company', 'Country', 'MetroArea'];                                                           // 25
var fullStatsFields = ['Persona', 'Language', 'Size', 'Industry', 'Company', 'Country', 'MLSMScore', 'MLSMRank'];      // 26
                                                                                                                       //
_meteor.Meteor.methods({                                                                                               // 28
    getQuickStats: function () {                                                                                       // 29
        function getQuickStats(filters) {                                                                              //
            if (!(filters.Themes && filters.Themes.length)) {                                                          // 30
                console.log('No Themes');                                                                              // 31
                console.log(filters);                                                                                  // 32
                return { loading: false };                                                                             // 33
            }                                                                                                          //
            var query = (0, _mysql.getQueryPromise)();                                                                 // 35
            // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
            // const startTime = Date.now(); // @todo remove                                                           //
            var Themes = filters.Themes;                                                                               // 29
            var rest = (0, _objectWithoutProperties3['default'])(filters, ['Themes']);                                 //
                                                                                                                       //
            var filtersWithCriteria = Object.keys(rest).filter(function (k) {                                          // 39
                return rest[k].length;                                                                                 //
            });                                                                                                        //
            var qs = 'SELECT ' + statsFields + ', COUNT(*) AS count FROM ' + Themes[0] + ' a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ' + (filtersWithCriteria.length ? filtersWithCriteria.map(function (k) {
                return k + ' IN (' + rest[k].map(_sqlstring2['default'].escape) + ')';                                 //
            }).join(' AND ') : '1=1') + ' GROUP BY Language, Size, Industry, SuperRegion, Persona;';                   //
            console.log(qs);                                                                                           // 41
            var res = query(qs).await();                                                                               // 42
            // const midTime = Date.now();// @todo remove                                                              //
            var count = 0;                                                                                             // 29
            var stats = { count: 0 };                                                                                  // 45
            for (var _iterator = statsFields, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;                                                                                              //
                                                                                                                       //
                if (_isArray) {                                                                                        //
                    if (_i >= _iterator.length) break;                                                                 //
                    _ref = _iterator[_i++];                                                                            //
                } else {                                                                                               //
                    _i = _iterator.next();                                                                             //
                    if (_i.done) break;                                                                                //
                    _ref = _i.value;                                                                                   //
                }                                                                                                      //
                                                                                                                       //
                var n = _ref;                                                                                          //
                                                                                                                       //
                stats[n] = {};                                                                                         // 47
            }                                                                                                          //
            for (var _iterator2 = res, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;                                                                                             //
                                                                                                                       //
                if (_isArray2) {                                                                                       //
                    if (_i2 >= _iterator2.length) break;                                                               //
                    _ref2 = _iterator2[_i2++];                                                                         //
                } else {                                                                                               //
                    _i2 = _iterator2.next();                                                                           //
                    if (_i2.done) break;                                                                               //
                    _ref2 = _i2.value;                                                                                 //
                }                                                                                                      //
                                                                                                                       //
                var row = _ref2;                                                                                       //
                var _count = row.count;                                                                                //
                                                                                                                       //
                stats.count += _count;                                                                                 // 51
                for (var _iterator3 = statsFields, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                    var _ref3;                                                                                         //
                                                                                                                       //
                    if (_isArray3) {                                                                                   //
                        if (_i3 >= _iterator3.length) break;                                                           //
                        _ref3 = _iterator3[_i3++];                                                                     //
                    } else {                                                                                           //
                        _i3 = _iterator3.next();                                                                       //
                        if (_i3.done) break;                                                                           //
                        _ref3 = _i3.value;                                                                             //
                    }                                                                                                  //
                                                                                                                       //
                    var stat = _ref3;                                                                                  //
                                                                                                                       //
                    stats[stat][row[stat]] = (stats[stat][row[stat]] || 0) + _count;                                   // 53
                }                                                                                                      //
            }                                                                                                          //
            // console.log('Count', stats.count); //@todo                                                              //
            // console.log('Half Way', midTime - startTime);//@todo                                                    //
            // console.log('Full time', Date.now() - startTime);//@todo                                                //
            return { stats: stats };                                                                                   // 29
        }                                                                                                              //
                                                                                                                       //
        return getQuickStats;                                                                                          //
    }(),                                                                                                               //
                                                                                                                       //
                                                                                                                       //
    // @todo you can just put this as another instance of getStats                                                     //
    getSparseStats: function () {                                                                                      // 63
        function getSparseStats(filters) {                                                                             //
            if (!(filters.Themes && filters.Themes.length)) {                                                          // 64
                console.log('No Themes');                                                                              // 65
                console.log(filters);                                                                                  // 66
                return { loading: false };                                                                             // 67
            }                                                                                                          //
            var query = (0, _mysql.getQueryPromise)();                                                                 // 69
            // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
            // const startTime = Date.now(); // @todo remove                                                           //
            var Themes = filters.Themes;                                                                               // 63
            var rest = (0, _objectWithoutProperties3['default'])(filters, ['Themes']);                                 //
                                                                                                                       //
            var filtersWithCriteria = Object.keys(rest).filter(function (k) {                                          // 73
                return rest[k].length;                                                                                 //
            });                                                                                                        //
            var qs = 'SELECT ' + sparseStatsFields + ', COUNT(*) AS count FROM ' + Themes[0] + ' a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ' + (filtersWithCriteria.length ? filtersWithCriteria.map(function (k) {
                return k + ' IN (' + rest[k].map(_sqlstring2['default'].escape) + ')';                                 //
            }).join(' AND ') : '1=1') + ' GROUP BY ' + sparseStatsFields + ';';                                        //
            console.log(qs);                                                                                           // 75
            var res = query(qs).await();                                                                               // 76
            var sparseStats = {};                                                                                      // 77
            for (var _iterator4 = sparseStatsFields, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref4;                                                                                             //
                                                                                                                       //
                if (_isArray4) {                                                                                       //
                    if (_i4 >= _iterator4.length) break;                                                               //
                    _ref4 = _iterator4[_i4++];                                                                         //
                } else {                                                                                               //
                    _i4 = _iterator4.next();                                                                           //
                    if (_i4.done) break;                                                                               //
                    _ref4 = _i4.value;                                                                                 //
                }                                                                                                      //
                                                                                                                       //
                var n = _ref4;                                                                                         //
                                                                                                                       //
                sparseStats[n] = {};                                                                                   // 79
            }                                                                                                          //
            for (var _iterator5 = res, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;                                                                                             //
                                                                                                                       //
                if (_isArray5) {                                                                                       //
                    if (_i5 >= _iterator5.length) break;                                                               //
                    _ref5 = _iterator5[_i5++];                                                                         //
                } else {                                                                                               //
                    _i5 = _iterator5.next();                                                                           //
                    if (_i5.done) break;                                                                               //
                    _ref5 = _i5.value;                                                                                 //
                }                                                                                                      //
                                                                                                                       //
                var row = _ref5;                                                                                       //
                var count = row.count;                                                                                 //
                                                                                                                       //
                sparseStats.count += count;                                                                            // 83
                for (var _iterator6 = sparseStatsFields, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                    var _ref6;                                                                                         //
                                                                                                                       //
                    if (_isArray6) {                                                                                   //
                        if (_i6 >= _iterator6.length) break;                                                           //
                        _ref6 = _iterator6[_i6++];                                                                     //
                    } else {                                                                                           //
                        _i6 = _iterator6.next();                                                                       //
                        if (_i6.done) break;                                                                           //
                        _ref6 = _i6.value;                                                                             //
                    }                                                                                                  //
                                                                                                                       //
                    var stat = _ref6;                                                                                  //
                                                                                                                       //
                    sparseStats[stat][row[stat]] = (sparseStats[stat][row[stat]] || 0) + count;                        // 85
                }                                                                                                      //
            }                                                                                                          //
            return { sparseStats: sparseStats };                                                                       // 88
        }                                                                                                              //
                                                                                                                       //
        return getSparseStats;                                                                                         //
    }(),                                                                                                               //
    getFullStats: function () {                                                                                        // 91
        function getFullStats(filters) {                                                                               //
            // const startTime = Date.now(); // @todo remove                                                           //
            if (!(filters.Themes && filters.Themes.length)) {                                                          // 93
                console.log('No Themes');                                                                              // 94
                console.log(filters);                                                                                  // 95
                return { loading: false };                                                                             // 96
            }                                                                                                          //
            var Themes = filters.Themes;                                                                               //
            var rest = (0, _objectWithoutProperties3['default'])(filters, ['Themes']);                                 //
                                                                                                                       //
            var filtersWithCriteria = Object.keys(rest).filter(function (k) {                                          // 99
                return rest[k].length;                                                                                 //
            }); // Get keys of rest with values of non-empty arrays                                                    //
            var qs = 'SELECT ' + fullStatsFields + ', COUNT(*) AS count FROM ' + Themes[0] + ' a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ' + (filtersWithCriteria.length ? filtersWithCriteria.map(function (k) {
                return k + ' IN (' + rest[k].map(_sqlstring2['default'].escape) + ')';                                 //
            }).join(' AND ') : '1=1') + ' GROUP BY ' + fullStatsFields + ';';                                          //
            var query = (0, _mysql.getQueryPromise)();                                                                 // 101
            console.log(qs);                                                                                           // 102
            var queryReturn = query(qs).then(function (rows) {                                                         // 103
                console.log(rows.length);                                                                              // 105
                return rows;                                                                                           // 106
            }).await();                                                                                                //
            var fullStats = (0, _stats.accumulateStats)(queryReturn, 'mysql', null);                                   // 109
            console.log(fullStats.total);                                                                              // 110
            return {                                                                                                   // 111
                fullStats: fullStats                                                                                   // 112
            };                                                                                                         //
        }                                                                                                              //
                                                                                                                       //
        return getFullStats;                                                                                           //
    }(),                                                                                                               //
    segmentBuilderBuildOriginalStats: function () {                                                                    // 117
        function segmentBuilderBuildOriginalStats(formData) {                                                          //
            var query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
            var whereClauses = [];                                                                                     // 119
            var isThereEnoughData = false;                                                                             // 120
            if (formData.engagement && formData.engagement.length) {                                                   // 121
                whereClauses.push('EngagementStatus IN (\'' + formData.engagement.join("','") + '\')');                // 122
                isThereEnoughData = true;                                                                              // 123
            }                                                                                                          //
            if (formData.personas.length) {                                                                            // 125
                whereClauses.push('Persona IN (\'' + formData.personas.join("','") + '\')');                           // 126
                isThereEnoughData = true;                                                                              // 127
            }                                                                                                          //
            if (formData.completeness && formData.completeness.length) {                                               // 129
                whereClauses.push('CompletenessLevel IN (\'' + formData.completeness.join("','") + '\')');             // 130
                isThereEnoughData = true;                                                                              // 131
            }                                                                                                          //
            if (formData.industry.length) {                                                                            // 133
                whereClauses.push('Industry IN (\'' + formData.industry.join("','") + '\')');                          // 134
                isThereEnoughData = true;                                                                              // 135
            }                                                                                                          //
            if (formData.metro.length) {                                                                               // 137
                whereClauses.push('MetroArea IN (\'' + formData.metro.join("','") + '\')');                            // 138
                isThereEnoughData = true;                                                                              // 139
            }                                                                                                          //
            if (formData.theme.length) {                                                                               // 141
                query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
                isThereEnoughData = true;                                                                              // 143
            }                                                                                                          //
                                                                                                                       //
            if (isThereEnoughData) {                                                                                   // 146
                if (whereClauses.length) {                                                                             // 147
                    query = query + ' where ' + whereClauses.join(' AND ');                                            // 148
                }                                                                                                      //
                console.log(query);                                                                                    // 150
                //@todo remove this LIMIT once you have indices in place                                               //
                query = query + ' LIMIT 10000';                                                                        // 146
                var connection = (0, _mysql.getConnection)();                                                          // 153
                var queryDB = (0, _es6Promisify2['default'])(connection.query, connection);                            // 154
                var queryReturn = queryDB(query).then(function (rows) {                                                // 155
                    console.log(rows.length);                                                                          // 157
                    return rows;                                                                                       // 158
                }).await();                                                                                            //
                                                                                                                       //
                var stats = (0, _stats.accumulateStats)(queryReturn, 'mysql', null);                                   // 162
                // console.log(stats);                                                                                 //
                var segment = {                                                                                        // 146
                    stats: stats,                                                                                      // 165
                    total: queryReturn.length                                                                          // 166
                };                                                                                                     //
                // console.log(segment);                                                                               //
                return segment;                                                                                        // 146
            } else {                                                                                                   //
                throw new _meteor.Meteor.Error('Need more details');                                                   // 172
            }                                                                                                          //
        }                                                                                                              //
                                                                                                                       //
        return segmentBuilderBuildOriginalStats;                                                                       //
    }(),                                                                                                               //
    testStatsMethod: function () {                                                                                     // 175
        function testStatsMethod(formData) {                                                                           //
            var startTimeMethod1 = Date.now();                                                                         // 176
            var query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
            var whereClauses = [];                                                                                     // 178
            var isThereEnoughData = false;                                                                             // 179
            if (formData.engagement && formData.engagement.length) {                                                   // 180
                whereClauses.push('EngagementStatus IN (\'' + formData.engagement.join("','") + '\')');                // 181
                isThereEnoughData = true;                                                                              // 182
            }                                                                                                          //
            if (formData.personas.length) {                                                                            // 184
                whereClauses.push('Persona IN (\'' + formData.personas.join("','") + '\')');                           // 185
                isThereEnoughData = true;                                                                              // 186
            }                                                                                                          //
            if (formData.completeness && formData.completeness.length) {                                               // 188
                whereClauses.push('CompletenessLevel IN (\'' + formData.completeness.join("','") + '\')');             // 189
                isThereEnoughData = true;                                                                              // 190
            }                                                                                                          //
            if (formData.industry.length) {                                                                            // 192
                whereClauses.push('Industry IN (\'' + formData.industry.join("','") + '\')');                          // 193
                isThereEnoughData = true;                                                                              // 194
            }                                                                                                          //
            if (formData.metro.length) {                                                                               // 196
                whereClauses.push('MetroArea IN (\'' + formData.metro.join("','") + '\')');                            // 197
                isThereEnoughData = true;                                                                              // 198
            }                                                                                                          //
            if (formData.theme.length) {                                                                               // 200
                query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
                isThereEnoughData = true;                                                                              // 202
            }                                                                                                          //
                                                                                                                       //
            if (isThereEnoughData) {                                                                                   // 205
                if (whereClauses.length) {                                                                             // 206
                    query = query + ' where ' + whereClauses.join(' AND ');                                            // 207
                }                                                                                                      //
                console.log(query);                                                                                    // 209
                //@todo remove this LIMIT once you have indices in place                                               //
                // query = query + ' LIMIT 10000';                                                                     //
                var connection = (0, _mysql.getConnection)();                                                          // 205
                var queryDB = (0, _es6Promisify2['default'])(connection.query, connection);                            // 213
                var queryReturn = queryDB(query).then(function (rows) {                                                // 214
                    console.log(rows.length);                                                                          // 216
                    return rows;                                                                                       // 217
                }).await();                                                                                            //
                                                                                                                       //
                var stats = (0, _stats.accumulateStats)(queryReturn, 'mysql', null);                                   // 221
                // console.log(stats);                                                                                 //
                var segment = {                                                                                        // 205
                    stats: stats,                                                                                      // 224
                    total: queryReturn.length                                                                          // 225
                };                                                                                                     //
                // console.log(segment);                                                                               //
                var endTimeMethod1 = Date.now();                                                                       // 205
                console.log('Time for stats method 1', endTimeMethod1 - startTimeMethod1, '::::', Math.ceil((endTimeMethod1 - startTimeMethod1) / 1000), 'sec');
                return segment;                                                                                        // 230
                                                                                                                       //
                // const startTimeMethod2 = Date.now();                                                                //
                // const fromQuery = query.slice(query.indexOf('from'));                                               //
                // const countQueries = [];                                                                            //
                // mysqlMap.forEach((key, name) => countQueries.push(`SELECT ${name}, COUNT(*) as 'count' ${fromQuery} GROUP BY ${name}`));
                // console.log(countQueries);                                                                          //
                // const joinedQuery = countQueries.join('; ');                                                        //
                // const stats2 = {};                                                                                  //
                // queryDB(joinedQuery)                                                                                //
                //     .then((results) => {                                                                            //
                //         // console.log(stats);                                                                      //
                //         // console.log(results);                                                                    //
                //         //results is an array of [{word, count(*)},{}],[]                                           //
                //         results.forEach((entries) => {                                                              //
                //             let thisSetOfStats = '';                                                                //
                //             let thisDbName = '';                                                                    //
                //             entries.forEach((entry) => {                                                            //
                //                 if (!thisSetOfStats) {                                                              //
                //                     const thisEntryHolder = Object.keys(entry).filter((x) => x !== 'count');        //
                //                     if (thisEntryHolder.length) {                                                   //
                //                         thisDbName = thisEntryHolder[0];                                            //
                //                         thisSetOfStats = mysqlMap.get(thisDbName);                                  //
                //                         stats2[thisSetOfStats] = {}                                                 //
                //                     }                                                                               //
                //                 }                                                                                   //
                //                 // Yeah this will be annoying to figure out so here's how it goes:                  //
                //                 //                                                                                  //
                //                 // Entries looks like this:                                                         //
                //                 // [ { MLSMScore: 'B1', 'count': 70 },                                              //
                //                 // { MLSMScore: 'B2', 'count': 94 }, ... ]                                          //
                //                 //                                                                                  //
                //                 // We want it to look like this:                                                    //
                //                 // { MLSMScore: {                                                                   //
                //                 //      B1: 70,                                                                     //
                //                 //      B2: 94, ...                                                                 //
                //                 //    }                                                                             //
                //                 // }                                                                                //
                //                 stats2[thisSetOfStats][entry[thisDbName]] = entry.count;                            //
                //             });                                                                                     //
                //         });                                                                                         //
                //     })                                                                                              //
                //     .catch(console.log)                                                                             //
                //     .await();                                                                                       //
                // //rankData, companies, map, etc...                                                                  //
                //                                                                                                     //
                //                                                                                                     //
                //                                                                                                     //
                // const endTimeMethod2 = Date.now();                                                                  //
                // console.log('Time for stats method 1', endTimeMethod2 - startTimeMethod2, '::::', Math.ceil((endTimeMethod2 - startTimeMethod2) / 1000), 'sec');
                //                                                                                                     //
                // // console.log(stats2);                                                                             //
                //                                                                                                     //
                //                                                                                                     //
                //                                                                                                     //
                //                                                                                                     //
                //                                                                                                     //
                // segment.stats = stats2;                                                                             //
                // return segment;                                                                                     //
            } else {                                                                                                   //
                    throw new _meteor.Meteor.Error('Need more details');                                               // 205
                }                                                                                                      //
        }                                                                                                              //
                                                                                                                       //
        return testStatsMethod;                                                                                        //
    }(),                                                                                                               //
                                                                                                                       //
                                                                                                                       //
    //@TODO IMPLEMENT EVENTUALLY                                                                                       //
    segmentBuilderSaveToEloqua: function () {                                                                          // 298
        function segmentBuilderSaveToEloqua(formData) {                                                                //
            var placeToPostTo = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment';                   // 299
            var thenQueue = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment/queue';                 // 300
                                                                                                                       //
            var criteria = [];                                                                                         // 302
            if (formData.engagement && formData.engagement.length) {                                                   // 303
                var criterion = {                                                                                      // 304
                    "type": "ContactFieldCriterion",                                                                   // 305
                    "id": "-1",                                                                                        // 306
                    "condition": {                                                                                     // 307
                        "type": "TextSetCondition",                                                                    // 308
                        "operator": "in",                                                                              // 309
                        "optionListId": "-1",                                                                          // 310
                        "quickListString": formData.engagement.join(',')                                               // 311
                    },                                                                                                 //
                    "fieldId": "100837"                                                                                // 313
                };                                                                                                     //
                criteria.push(criterion);                                                                              // 315
            }                                                                                                          //
                                                                                                                       //
            if (formData.personas && formData.personas.length) {                                                       // 318
                var _criterion = {                                                                                     // 319
                    "type": "ContactFieldCriterion",                                                                   // 320
                    "id": "-2",                                                                                        // 321
                    "condition": {                                                                                     // 322
                        "type": "TextSetCondition",                                                                    // 323
                        "operator": "in",                                                                              // 324
                        "optionListId": "-2",                                                                          // 325
                        "quickListString": formData.personas.join(',')                                                 // 326
                    },                                                                                                 //
                    "fieldId": "100837"                                                                                // 328
                };                                                                                                     //
                criteria.push(_criterion);                                                                             // 330
            }                                                                                                          //
                                                                                                                       //
            if (formData.completeness && formData.completeness.length) {                                               // 333
                var _criterion2 = {                                                                                    // 334
                    "type": "ContactFieldCriterion",                                                                   // 335
                    "id": "-3",                                                                                        // 336
                    "condition": {                                                                                     // 337
                        "type": "TextSetCondition",                                                                    // 338
                        "operator": "in",                                                                              // 339
                        "optionListId": "-3",                                                                          // 340
                        "quickListString": formData.completeness.join(',')                                             // 341
                    },                                                                                                 //
                    "fieldId": "100811"                                                                                // 343
                };                                                                                                     //
                criteria.push(_criterion2);                                                                            // 345
            }                                                                                                          //
                                                                                                                       //
            if (formData.industry && formData.industry.length) {                                                       // 348
                var _criterion3 = {                                                                                    // 349
                    "type": "ContactFieldCriterion",                                                                   // 350
                    "id": "-4",                                                                                        // 351
                    "condition": {                                                                                     // 352
                        "type": "TextSetCondition",                                                                    // 353
                        "operator": "in",                                                                              // 354
                        "optionListId": "-4",                                                                          // 355
                        "quickListString": formData.industry.join(',')                                                 // 356
                    },                                                                                                 //
                    "fieldId": "100046"                                                                                // 358
                };                                                                                                     //
                criteria.push(_criterion3);                                                                            // 360
            }                                                                                                          //
                                                                                                                       //
            if (formData.metro && formData.metro.length) {                                                             // 363
                var _criterion4 = {                                                                                    // 364
                    "type": "ContactFieldCriterion",                                                                   // 365
                    "id": "-5",                                                                                        // 366
                    "condition": {                                                                                     // 367
                        "type": "TextSetCondition",                                                                    // 368
                        "operator": "in",                                                                              // 369
                        "optionListId": "-5",                                                                          // 370
                        "quickListString": formData.metro.join(',')                                                    // 371
                    },                                                                                                 //
                    "fieldId": "100818"                                                                                // 373
                };                                                                                                     //
                criteria.push(_criterion4);                                                                            // 375
            }                                                                                                          //
                                                                                                                       //
            if (formData.theme && formData.theme.length) {                                                             // 378
                //@todo do theme here                                                                                  //
                console.log("We don't *DO* theme here...");                                                            // 380
            }                                                                                                          //
                                                                                                                       //
            var filter = {                                                                                             // 383
                "isIncluded": "true",                                                                                  // 384
                "filter": {                                                                                            // 385
                    "name": "Filter Criterion 1",                                                                      // 386
                    "scope": "local",                                                                                  // 387
                    "id": "-111",                                                                                      // 388
                    "createdBy": "2084",                                                                               // 389
                    "createdAt": "" + new Date().valueOf() / 1000,                                                     // 390
                    "type": "ContactFilter",                                                                           // 391
                    "criteria": criteria,                                                                              // 392
                    "statement": criteria.map(function (c) {                                                           // 393
                        return c.id;                                                                                   //
                    }).join(' AND '),                                                                                  //
                    "x_e10_isTemplate": "false",                                                                       // 394
                    "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]                                     // 395
                },                                                                                                     //
                "id": "-112",                                                                                          // 402
                "type": "ContactFilterSegmentElement"                                                                  // 403
            };                                                                                                         //
                                                                                                                       //
            var template = {                                                                                           // 406
                "createdBy": "2084",                                                                                   // 407
                "createdAt": "1476197319",                                                                             // 408
                // "updatedBy": "2084",                                                                                //
                // "updatedAt": "1476197319",                                                                          //
                "currentStatus": "Draft",                                                                              // 411
                "type": "ContactSegment",                                                                              // 412
                "elements": [filter],                                                                                  // 413
                "isBlankTemplate": true,                                                                               // 416
                "id": "-211",                                                                                          // 417
                "name": 'TESTTEST: ' + formData.name,                                                                  // 418
                "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],                                        // 419
                "folderId": "180344",                                                                                  // 425
                "x_e10_isTemplate": "false",                                                                           // 426
                "depth": "complete"                                                                                    // 427
            };                                                                                                         //
            console.log(JSON.stringify(template));                                                                     // 429
                                                                                                                       //
            (0, _nodeFetch2['default'])(placeToPostTo, { method: 'POST', body: JSON.stringify(template), headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } }).then(function (res) {
                return res.json();                                                                                     //
            }).then(function (json) {                                                                                  //
                console.log('***** First Half *****');                                                                 // 434
                console.log(json);                                                                                     // 435
                return (0, _nodeFetch2['default'])(thenQueue + '/' + json.id, { method: 'POST', headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } });
            }).then(function (res) {                                                                                   //
                return res.json();                                                                                     //
            }).then(function (json) {                                                                                  //
                console.log('***** QUEUE RES *****');                                                                  // 440
                console.log(json);                                                                                     // 441
            }).await();                                                                                                //
            console.log('DONE!');                                                                                      // 444
        }                                                                                                              //
                                                                                                                       //
        return segmentBuilderSaveToEloqua;                                                                             //
    }()                                                                                                                //
});                                                                                                                    //
                                                                                                                       //
// const thisOneWorked = {                                                                                             //
//     "createdBy": "2084",                                                                                            //
//     "createdAt": "1476197319",                                                                                      //
//     "currentStatus": "Draft",                                                                                       //
//     "type": "ContactSegment",                                                                                       //
//     "elements": [                                                                                                   //
//         {                                                                                                           //
//             "isIncluded": "true",                                                                                   //
//             "filter": {                                                                                             //
//                 "name": "Filter Criteria 1",                                                                        //
//                 "scope": "local",                                                                                   //
//                 "id": "-111",                                                                                       //
//                 "createdBy": "2084",                                                                                //
//                 "createdAt": "1476197359",                                                                          //
//                 "type": "ContactFilter",                                                                            //
//                 "criteria": [{                                                                                      //
//                     "type": "ContactFieldCriterion",                                                                //
//                     "id": "-5",                                                                                     //
//                     "condition": {                                                                                  //
//                         "type": "TextSetCondition",                                                                 //
//                         "operator": "in",                                                                           //
//                         "optionListId": "-5",                                                                       //
//                         "quickListString": "High,Medium"                                                            //
//                     },                                                                                              //
//                     "fieldId": "100811"                                                                             //
//                 }],                                                                                                 //
//                 "statement": "-5",                                                                                  //
//                 "x_e10_isTemplate": "false",                                                                        //
//                 "permissions": [                                                                                    //
//                     "Retrieve",                                                                                     //
//                     "Update",                                                                                       //
//                     "Delete",                                                                                       //
//                     "SetSecurity"                                                                                   //
//                 ]                                                                                                   //
//             },                                                                                                      //
//             "id": "-112",                                                                                           //
//             "type": "ContactFilterSegmentElement"                                                                   //
//         }                                                                                                           //
//     ],                                                                                                              //
//     "isBlankTemplate": true,                                                                                        //
//     "id": "-211",                                                                                                   //
//     "name": "TEST REST 123123",                                                                                     //
//     "permissions": [                                                                                                //
//         "Retrieve",                                                                                                 //
//         "Update",                                                                                                   //
//         "Delete",                                                                                                   //
//         "SetSecurity"                                                                                               //
//     ],                                                                                                              //
//     "folderId": "180344",                                                                                           //
//     "x_e10_isTemplate": "false",                                                                                    //
//     "depth": "complete"                                                                                             //
// };                                                                                                                  //
                                                                                                                       //
var x = {                                                                                                              // 505
    "createdBy": "2084",                                                                                               // 506
    "createdAt": "1476197319",                                                                                         // 507
    "currentStatus": "Draft",                                                                                          // 508
    "type": "ContactSegment",                                                                                          // 509
    "elements": [{                                                                                                     // 510
        "isIncluded": "true",                                                                                          // 511
        "filter": {                                                                                                    // 512
            "name": "Filter Criterion 1",                                                                              // 513
            "scope": "local",                                                                                          // 514
            "id": "-111",                                                                                              // 515
            "createdBy": "2084",                                                                                       // 516
            "createdAt": "1479321218.145",                                                                             // 517
            "type": "ContactFilter",                                                                                   // 518
            "criteria": [{                                                                                             // 519
                "type": "ContactFieldCriterion",                                                                       // 520
                "id": "-4",                                                                                            // 521
                "condition": {                                                                                         // 522
                    "type": "TextSetCondition",                                                                        // 523
                    "operator": "in",                                                                                  // 524
                    "optionListId": "-4",                                                                              // 525
                    "quickListString": "Finance,Telecommunications"                                                    // 526
                },                                                                                                     //
                "fieldId": "100046"                                                                                    // 528
            }],                                                                                                        //
            "statement": "-4",                                                                                         // 530
            "x_e10_isTemplate": "false",                                                                               // 531
            "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]                                             // 532
        },                                                                                                             //
        "id": "-112",                                                                                                  // 534
        "type": "ContactFilterSegmentElement"                                                                          // 535
    }],                                                                                                                //
    "isBlankTemplate": true,                                                                                           // 537
    "id": "-211",                                                                                                      // 538
    "name": "TEST: Leia Created 1479321218138",                                                                        // 539
    "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],                                                    // 540
    "folderId": "180344",                                                                                              // 541
    "x_e10_isTemplate": "false",                                                                                       // 542
    "depth": "complete"                                                                                                // 543
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"segmentBuilderMethodsV3.js":["babel-runtime/helpers/extends","meteor/meteor","../imports/collections.js","sqlstring","../imports/helpers/mysql.js",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethodsV3.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require('babel-runtime/helpers/extends');                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _meteor = require('meteor/meteor');                                                                                // 5
                                                                                                                       //
var _collections = require('../imports/collections.js');                                                               // 6
                                                                                                                       //
var _sqlstring = require('sqlstring');                                                                                 // 7
                                                                                                                       //
var _sqlstring2 = _interopRequireDefault(_sqlstring);                                                                  //
                                                                                                                       //
var _mysql = require('../imports/helpers/mysql.js');                                                                   // 8
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                      //
                                                                                                                       //
/**                                                                                                                    //
 * Created by jkochuk on 2/16/17.                                                                                      //
 */                                                                                                                    //
                                                                                                                       //
_meteor.Meteor.startup(function () {                                                                                   // 10
    // Meteor.call('getStats', { Segments: [], SuperRegions: [], Persona: [], Industry: [], CompanySize: [], EngagementStatus: [], InstalledTechnologies: [] }, (stats) => {
    //     Stats.upsert({ default: true }, {                                                                           //
    //         default: true,                                                                                          //
    //         date: new Date(),                                                                                       //
    //         stats,                                                                                                  //
    //     });                                                                                                         //
    //     console.log(stats);                                                                                         //
    // });                                                                                                             //
});                                                                                                                    //
                                                                                                                       //
_meteor.Meteor.methods({                                                                                               // 21
    // Called when the page is first loaded.                                                                           //
    getDefaultStats: function () {                                                                                     // 23
        function getDefaultStats() {                                                                                   // 23
            var defaultStats = _collections.Stats.findOne({ 'default': true });                                        // 24
            if (defaultStats) {                                                                                        // 25
                return defaultStats;                                                                                   // 26
            }                                                                                                          //
            console.log('OH NO! NO DEFAULT STATS');                                                                    // 28
            return DEFAULT_STATS;                                                                                      // 29
        }                                                                                                              //
                                                                                                                       //
        return getDefaultStats;                                                                                        //
    }(),                                                                                                               //
                                                                                                                       //
    // Given an object of filters, get counts for all of the elements NOT filtered                                     //
    //                                                                                                                 //
    // @param filters Object with shape {                                                                              //
    //      filter1: [],                                                                                               //
    //      filter2: [].                                                                                               //
    //      ...                                                                                                        //
    // }                                                                                                               //
    // @return Object with shape {                                                                                     //
    //      Area1: {                                                                                                   //
    //          Element1: 123,                                                                                         //
    //          Element2: 234,                                                                                         //
    //          ...                                                                                                    //
    //      },                                                                                                         //
    //      Area2: {                                                                                                   //
    //          Element3: 345,                                                                                         //
    //          Element4: 456,                                                                                         //
    //          ...                                                                                                    //
    //      },                                                                                                         //
    //      ...                                                                                                        //
    // }                                                                                                               //
    getStats: function () {                                                                                            // 52
        function getStats(filters) {                                                                                   // 52
                                                                                                                       //
            // See if we have stats logged for the given filters and return them if we do                              //
            var thisWeek = new Date(); // Current Date                                                                 // 55
            thisWeek.setDate(thisWeek.getDate() - 7);                                                                  // 52
            var existingStats = _collections.Stats.find((0, _extends3['default'])({ date: { $gt: thisWeek } }, filters)).fetch();
            if (existingStats.length) {                                                                                // 58
                console.log('Found existing stats');                                                                   // 59
                return existingStats[0].stats;                                                                         // 60
            }                                                                                                          //
                                                                                                                       //
            // Make the SQL Query to get the required stats                                                            //
            var stats = heyLookAnotherStatsMethodTakesInFiltersOutputsStatsBlock(filters);                             // 52
                                                                                                                       //
            //Insert the document into the Mongo Cache AFTER we return it to the                                       //
            _meteor.Meteor.setTimeout(function () {                                                                    // 52
                _collections.Stats.upsert((0, _extends3['default'])({}, filters), (0, _extends3['default'])({          // 68
                    date: new Date(),                                                                                  // 69
                    stats: stats                                                                                       // 70
                }, filters));                                                                                          //
            }, 0);                                                                                                     //
            return stats;                                                                                              // 74
        }                                                                                                              //
                                                                                                                       //
        return getStats;                                                                                               //
    }()                                                                                                                //
});                                                                                                                    //
                                                                                                                       //
// // Given an object which is a SQL response, turn it into a stats Object                                             //
// //                                                                                                                  //
// // @param filters Object with shape {                                                                               //
// //      element1: 123,                                                                                              //
// //      element2: 234,                                                                                              //
// //      element3: 345,                                                                                              //
// //      ...                                                                                                         //
// //  }                                                                                                               //
// // @return Object with shape {                                                                                      //
// //      Area1: {                                                                                                    //
// //          Element1: 123,                                                                                          //
// //          Element2: 234,                                                                                          //
// //          ...                                                                                                     //
// //      },                                                                                                          //
// //      Area2: {                                                                                                    //
// //          Element3: 345,                                                                                          //
// //          Element4: 456,                                                                                          //
// //          ...                                                                                                     //
// //      },                                                                                                          //
// //      ...                                                                                                         //
// // }                                                                                                                //
// const turnSQLIntoStatsBlock = (SQLRes) => {                                                                         //
//     const statsBlock = {};                                                                                          //
//     Object.keys(SQLRes).forEach((k) => {                                                                            //
//         if (!statsBlock[reverseLookupMap[k]]) {                                                                     //
//             statsBlock[reverseLookupMap[k]] = {};                                                                   //
//         }                                                                                                           //
//         statsBlock[reverseLookupMap[k]][k] = SQLRes[k];                                                             //
//     });                                                                                                             //
//     statsBlock.companyCount = SQLRes.companyCount;                                                                  //
//     statsBlock.contactCount = SQLRes.contactCount;                                                                  //
//     return statsBlock;                                                                                              //
// };                                                                                                                  //
// const reverseLookupMap = {                                                                                          //
//     contactCount: 'contactCount',                                                                                   //
//     companyCount: 'companyCount',                                                                                   //
//     Efficiency: 'Segments',                                                                                         //
//     Transitional: 'Segments',                                                                                       //
//     Training: 'Segments',                                                                                           //
//     Agility: 'Segments',                                                                                            //
//     Accelerate: 'Segments',                                                                                         //
//     Integrate: 'Segments',                                                                                          //
//     NA: 'SuperRegions',                                                                                             //
//     APAC: 'SuperRegions',                                                                                           //
//     EMEA: 'SuperRegions',                                                                                           //
//     LATAM: 'SuperRegions',                                                                                          //
//     ITManager: 'Persona',                                                                                           //
//     LeadDeveloper: 'Persona',                                                                                       //
//     ITExecutive: 'Persona',                                                                                         //
//     BusinessAnalyst: 'Persona',                                                                                     //
//     SystemAdministrator: 'Persona',                                                                                 //
//     Architect: 'Persona',                                                                                           //
//     Finance: 'Industry',                                                                                            //
//     Manufacturing: 'Industry',                                                                                      //
//     Telecommunications: 'Industry',                                                                                 //
//     MediaAndInternet: 'Industry',                                                                                   //
//     Healthcare: 'Industry',                                                                                         //
//     Education: 'Industry',                                                                                          //
//     Government: 'Industry',                                                                                         //
//     Enterprise: 'CompanySize',                                                                                      //
//     SmallBusiness: 'CompanySize',                                                                                   //
//     MidMarketEnterprise: 'CompanySize',                                                                             //
//     MediumBusiness: 'CompanySize',                                                                                  //
//     Inactive: 'EngagementStatus',                                                                                   //
//     MostActive: 'EngagementStatus',                                                                                 //
//     Lapsed: 'EngagementStatus',                                                                                     //
//     Lapsing: 'EngagementStatus',                                                                                    //
//     Invalid: 'EngagementStatus',                                                                                    //
//     RHEL: 'InstalledTechnologies',                                                                                  //
//     Red_Hat_Satellite: 'InstalledTechnologies',                                                                     //
//     Enterprise_Application_Platform: 'InstalledTechnologies',                                                       //
//     RHEV: 'InstalledTechnologies',                                                                                  //
//     OpenStack: 'InstalledTechnologies',                                                                             //
//     CloudForms: 'InstalledTechnologies'                                                                             //
// };                                                                                                                  //
//                                                                                                                     //
//                                                                                                                     //
// // Given an object of filters, build a SQL Query                                                                    //
// //                                                                                                                  //
// // @param filters Object with shape {                                                                               //
// //      filter1: [],                                                                                                //
// //      filter2: [].                                                                                                //
// //      ...                                                                                                         //
// //  }                                                                                                               //
// // @return String SQL Query to get counts                                                                           //
// const turnFiltersIntoStatsBlock = (filters) => {                                                                    //
//     //@TODO cache SQLQuery                                                                                          //
//     const thingsToCount = [];                                                                                       //
//     const namesOfThingsToCount = [];                                                                                //
//     const whereClauses = [];                                                                                        //
//     const tempTableName = `leia_tmp_${Date.now()}`;                                                                 //
//     sectionsToCount.forEach((val) => {                                                                              //
//         if (filters[val] && filters[val].length) {                                                                  //
//             whereClauses.push(WHERE_STRING_FUNCTIONS[val](filters[val]))                                            //
//         } else {                                                                                                    //
//             namesOfThingsToCount.push(val);                                                                         //
//             thingsToCount.push(STATS_COUNT_STRINGS[val](tempTableName));                                            //
//         }                                                                                                           //
//     });                                                                                                             //
//     if (filters.Companies && filters.Companies.length) {                                                            //
//         whereClauses.push(WHERE_STRING_FUNCTIONS.Companies(filters.Companies))                                      //
//     }                                                                                                               //
//     const sql = `CREATE TEMPORARY TABLE ${tempTableName} AS (SELECT * FROM temp_contacts WHERE ${whereClauses.join(' AND ') || '1=1'}); ${thingsToCount.join('; ')}`;
//     console.log(sql);                                                                                               //
//     const query = getQueryPromise();                                                                                //
//     const res = query(sql).await();                                                                                 //
//     console.log(res);                                                                                               //
//     // const res = MOCK_RES;                                                                                        //
//     return turnResesIntoStatsBlock(res, namesOfThingsToCount);                                                      //
// };                                                                                                                  //
//                                                                                                                     //
//                                                                                                                     //
// // Looks like [                                                                                                     //
// //                 [                                                                                                //
// //                    { Size: mid, Count: 123 },                                                                    //
// //                      {Size: large, Count: 123 }                                                                  //
// //                 ],                                                                                               //
// const turnResesIntoStatsBlock = (res, namesOfThingsToCount) => {                                                    //
//     const statsBlock = {};                                                                                          //
//     for (let i = 0; i < namesOfThingsToCount.length; i++) {                                                         //
//         const thisRes = res[i + 2];                                                                                 //
//         const name = namesOfThingsToCount[i];                                                                       //
//         statsBlock[name] = STATS_BUILDING_FUNCTIONS[name](thisRes, name);                                           //
//     }                                                                                                               //
//     statsBlock.companyCount = statsBlock.Count.companyCount;                                                        //
//     statsBlock.contactCount = statsBlock.Count.contactCount;                                                        //
//     const CompaniesRes = res[1];                                                                                    //
//     console.log('CompaniesRes', CompaniesRes);                                                                      //
//     statsBlock.Companies = STATS_BUILDING_FUNCTIONS.Companies(CompaniesRes);                                        //
//     console.log('******');                                                                                          //
//     console.log(statsBlock);                                                                                        //
//     return statsBlock;                                                                                              //
// };                                                                                                                  //
//                                                                                                                     //
// const alreadyGood = res => res[0];                                                                                  //
// const getNamedRes = (res, name) => {                                                                                //
//     // CompanySize has a database name of 'Size'                                                                    //
//     // @todo separate display names and database names                                                              //
//     const thisName = name == 'CompanySize' ? 'Size' : name;                                                         //
//     const returnObject = {};                                                                                        //
//     console.log(res);                                                                                               //
//     res.forEach(row => {                                                                                            //
//         const thisRowVal = row[thisName];                                                                           //
//         console.log(thisRowVal);                                                                                    //
//         const namedVal = DBtoNameMap[name][thisRowVal] || console.log('Could Not Get Value for', name, thisRowVal);
//         console.log(namedVal);                                                                                      //
//         returnObject[namedVal] = row.Count;                                                                         //
//     });                                                                                                             //
//     return returnObject;                                                                                            //
// };                                                                                                                  //
// //                                                                                                                  //
// // [{Company: c}, ...                                                                                               //
// const buildCompanies = (res) => res.map(holder => holder.Company);                                                  //
// const STATS_BUILDING_FUNCTIONS = {                                                                                  //
//     Count: alreadyGood,                                                                                             //
//     Segments: alreadyGood,                                                                                          //
//     Companies: buildCompanies,                                                                                      //
//     InstalledTechnologies: alreadyGood,                                                                             //
//     SuperRegions: getNamedRes,                                                                                      //
//     Persona: getNamedRes,                                                                                           //
//     Industry: getNamedRes,                                                                                          //
//     CompanySize: getNamedRes,                                                                                       //
//     EngagementStatus: getNamedRes                                                                                   //
// };                                                                                                                  //
//                                                                                                                     //
// const sectionsToCount = ['Count', 'Segments', 'InstalledTechnologies', 'SuperRegions', 'Persona', 'Industry', 'CompanySize', 'EngagementStatus'];
// const STATS_COUNT_STRINGS = {                                                                                       //
//     Count: (tmp) => `SELECT Company, Count(*) as c FROM ${tmp} GROUP BY Company ORDER BY c DESC LIMIT 10; SELECT COUNT(*) as contactCount, COUNT(DISTINCT Company) as companyCount FROM ${tmp}`,
//     Segments: (tmp) => `SELECT COUNT(ITWOB_Efficiency=TRUE) AS Efficiency, COUNT(ITWOB_Transitional=TRUE) AS Transitional, COUNT(ITWOB_Agility=TRUE) AS Agility, COUNT(Training=TRUE) AS Training, COUNT(ModAppDev_Accelerate=TRUE) AS Accelerate, COUNT(ModAppDev_Integrate=TRUE) AS Integrate FROM ${tmp}`,
//     InstalledTechnologies: (tmp) => `SELECT COUNT(RHEL=TRUE) AS RHEL, COUNT(Red_Hat_Satellite=TRUE) AS Red_Hat_Satellite, COUNT(Enterprise_Application_Platform=TRUE) AS Enterprise_Application_Platform, COUNT(RHEV=TRUE) AS RHEV, COUNT(OpenStack=TRUE) AS OpenStack, COUNT(CloudForms=TRUE) AS CloudForms FROM ${tmp}`,
//     SuperRegions: (tmp) => `SELECT COUNT(*) AS Count, SuperRegion AS SuperRegions FROM ${tmp} GROUP BY SuperRegions`,
//     Persona: (tmp) => `SELECT COUNT(*) AS Count, Persona FROM ${tmp} GROUP BY Persona`,                             //
//     Industry: (tmp) => `SELECT COUNT(*) AS Count, Industry FROM ${tmp} GROUP BY Industry`,                          //
//     CompanySize: (tmp) => `SELECT COUNT(*) AS Count, Size FROM ${tmp} GROUP BY Size`,                               //
//     EngagementStatus: (tmp) => `SELECT COUNT(*) AS Count, EngagementStatus FROM ${tmp} GROUP BY EngagementStatus`   //
// };                                                                                                                  //
// const WHERE_STRING_FUNCTIONS = {                                                                                    //
//     Companies: (arr) => `Company IN (${arr.map(sqlstring.escape).join(',')})`,                                      //
//     Segments: (arr) => ` (${arr.map(val => `${THEME_MAP[val]}=TRUE`).join(' OR ')}) `,                              //
//     SuperRegions: (arr) => `SuperRegion IN (${arr.map(val => NameToDBMap['SuperRegions'][val]).join(',')})`,        //
//     Persona: (arr) => `Persona IN (${arr.map(val => NameToDBMap['Persona'][val]).join(',')})`,                      //
//     Industry: (arr) => `Industry IN (${arr.map(val => NameToDBMap['Industry'][val]).join(',')})`,                   //
//     CompanySize: (arr) => `Size IN (${arr.map(val => NameToDBMap['CompanySize'][val]).join(',')})`,                 //
//     EngagementStatus: (arr) => `EngagementStatus IN (${arr.map(val => NameToDBMap['EngagementStatus'][val]).join(',')})`,
//     InstalledTechnologies: (arr) => ` (${arr.map(val => `${val}=TRUE`).join(' OR ')}) `                             //
// };                                                                                                                  //
// const THEME_MAP = {                                                                                                 //
//     Agility: 'ITWOB_Agility',                                                                                       //
//     Efficiency: 'ITWOB_Efficiency',                                                                                 //
//     Transitional: 'ITWOB_Transitional'                                                                              //
// };                                                                                                                  //
//                                                                                                                     //
// const DBtoNameMap = {                                                                                               //
//     SuperRegions: {                                                                                                 //
//         1: 'NA',                                                                                                    //
//         2: 'LATAM',                                                                                                 //
//         3: 'EMEA',                                                                                                  //
//         4: 'APAC'                                                                                                   //
//     },                                                                                                              //
//     Persona: {                                                                                                      //
//         1: 'IT Manager',                                                                                            //
//         2: 'Other',                                                                                                 //
//         3: 'Lead Developer',                                                                                        //
//         4: 'IT Executive',                                                                                          //
//         5: 'Business Analyst',                                                                                      //
//         6: 'System Administrator',                                                                                  //
//         7: 'Architect',                                                                                             //
//         8: 'IT Decision Maker'                                                                                      //
//     },                                                                                                              //
//     Industry: {                                                                                                     //
//         20: "Business Services",                                                                                    //
//         21: "Manufacturing",                                                                                        //
//         22: "Finance",                                                                                              //
//         23: "Telecommunications",                                                                                   //
//         24: "Media & Internet",                                                                                     //
//         25: "Retail",                                                                                               //
//         26: "Other",                                                                                                //
//         27: "Software",                                                                                             //
//         28: "Healthcare ",                                                                                          //
//         29: "Education",                                                                                            //
//         30: "Government",                                                                                           //
//         31: "Energy, Raw Materials & Utilities",                                                                    //
//         32: "Construction & Real Estate",                                                                           //
//         33: "Transportation",                                                                                       //
//         34: "Leisure & Hospitality",                                                                                //
//         35: "Non-Profit & Professional Orgs.",                                                                      //
//         36: "Agriculture ",                                                                                         //
//         37: "Libraries",                                                                                            //
//         38: "Wholesale Trade"                                                                                       //
//                                                                                                                     //
//     },                                                                                                              //
//     CompanySize: {                                                                                                  //
//         1: "Enterprise",                                                                                            //
//         2: "Mid-Market Enterprise",                                                                                 //
//         3: "Medium Business",                                                                                       //
//         4: "Small Business"                                                                                         //
//     },                                                                                                              //
//     EngagementStatus: {                                                                                             //
//         1: "Inactive",                                                                                              //
//         2: "Lapsed",                                                                                                //
//         3: "Most Active",                                                                                           //
//         4: "Lapsing",                                                                                               //
//         5: "Invalid",                                                                                               //
//         6: "Internal"                                                                                               //
//     }                                                                                                               //
// };                                                                                                                  //
// const NameToDBMap = {                                                                                               //
//     SuperRegions: {                                                                                                 //
//         'NA': 1,                                                                                                    //
//         'LATAM': 2,                                                                                                 //
//         'EMEA': 3,                                                                                                  //
//         'APAC': 4                                                                                                   //
//     },                                                                                                              //
//     Persona: {                                                                                                      //
//         'IT Manager': 1,                                                                                            //
//         'Other': 2,                                                                                                 //
//         'Lead Developer': 3,                                                                                        //
//         'IT Executive': 4,                                                                                          //
//         'Business Analyst': 5,                                                                                      //
//         'System Administrator': 6,                                                                                  //
//         'Architect': 7,                                                                                             //
//         'IT Decision Maker': 8                                                                                      //
//     },                                                                                                              //
//     Industry: {                                                                                                     //
//         "Business Services": 20,                                                                                    //
//         "Manufacturing": 21,                                                                                        //
//         "Finance": 22,                                                                                              //
//         "Telecommunications": 23,                                                                                   //
//         "Media & Internet": 24,                                                                                     //
//         "Retail": 25,                                                                                               //
//         "Other": 26,                                                                                                //
//         "Software": 27,                                                                                             //
//         "Healthcare ": 28,                                                                                          //
//         "Education": 29,                                                                                            //
//         "Government": 30,                                                                                           //
//         "Energy, Raw Materials & Utilities": 31,                                                                    //
//         "Construction & Real Estate": 32,                                                                           //
//         "Transportation": 33,                                                                                       //
//         "Leisure & Hospitality": 34,                                                                                //
//         "Non-Profit & Professional Orgs.": 35,                                                                      //
//         "Agriculture ": 36,                                                                                         //
//         "Libraries": 37,                                                                                            //
//         "Wholesale Trade": 38                                                                                       //
//                                                                                                                     //
//     },                                                                                                              //
//     CompanySize: {                                                                                                  //
//         "Enterprise": 1,                                                                                            //
//         "Mid-Market Enterprise": 2,                                                                                 //
//         "Medium Business": 3,                                                                                       //
//         "Small Business": 4                                                                                         //
//     },                                                                                                              //
//     EngagementStatus: {                                                                                             //
//         "Inactive": 1,                                                                                              //
//         "Lapsed": 2,                                                                                                //
//         "Most Active": 3,                                                                                           //
//         "Lapsing": 4,                                                                                               //
//         "Invalid": 5,                                                                                               //
//         "Internal": 6                                                                                               //
//     }                                                                                                               //
// };                                                                                                                  //
//                                                                                                                     //
// const MOCK_RES = [                                                                                                  //
//     {                                                                                                               //
//         fieldCount: 0,                                                                                              //
//         affectedRows: 1321579,                                                                                      //
//         insertId: 0,                                                                                                //
//         serverStatus: 2058,                                                                                         //
//         warningCount: 0,                                                                                            //
//         message: ',Records: 1321579  Duplicates: 0  Warnings: 0',                                                   //
//         protocol41: true,                                                                                           //
//         changedRows: 0                                                                                              //
//     },                                                                                                              //
//     [{ Company: 'ABC' }, { Company: 'BGK' }],                                                                       //
//     [{ contactCount: 1321579, companyCount: 200225 }],                                                              //
//     [{                                                                                                              //
//         Efficiency: 0,                                                                                              //
//         Transitional: 0,                                                                                            //
//         Agility: 0,                                                                                                 //
//         Training: 0,                                                                                                //
//         Accelerate: 0,                                                                                              //
//         Integrate: 0                                                                                                //
//     }],                                                                                                             //
//     [{                                                                                                              //
//         RHEL: 286050,                                                                                               //
//         Red_Hat_Satellite: 166385,                                                                                  //
//         Enterprise_Application_Platform: 95007,                                                                     //
//         RHEV: 30178,                                                                                                //
//         OpenStack: 13993,                                                                                           //
//         CloudForms: 7997                                                                                            //
//     }],                                                                                                             //
//     [{ Count: 435755, Persona: null },                                                                              //
//         { Count: 218459, Persona: 1 },                                                                              //
//         { Count: 225690, Persona: 2 },                                                                              //
//         { Count: 167705, Persona: 3 },                                                                              //
//         { Count: 100141, Persona: 4 },                                                                              //
//         { Count: 74040, Persona: 5 },                                                                               //
//         { Count: 52140, Persona: 6 },                                                                               //
//         { Count: 47648, Persona: 7 },                                                                               //
//         { Count: 1, Persona: 8 }],                                                                                  //
//     [{ Count: 321192, Industry: null },                                                                             //
//         { Count: 151694, Industry: 20 },                                                                            //
//         { Count: 151833, Industry: 21 },                                                                            //
//         { Count: 144385, Industry: 22 },                                                                            //
//         { Count: 81059, Industry: 23 },                                                                             //
//         { Count: 40943, Industry: 24 },                                                                             //
//         { Count: 88061, Industry: 25 },                                                                             //
//         { Count: 49000, Industry: 26 },                                                                             //
//         { Count: 52760, Industry: 27 },                                                                             //
//         { Count: 53939, Industry: 28 },                                                                             //
//         { Count: 49375, Industry: 29 },                                                                             //
//         { Count: 48084, Industry: 30 },                                                                             //
//         { Count: 31314, Industry: 31 },                                                                             //
//         { Count: 21407, Industry: 32 },                                                                             //
//         { Count: 14549, Industry: 33 },                                                                             //
//         { Count: 11489, Industry: 34 },                                                                             //
//         { Count: 9527, Industry: 35 },                                                                              //
//         { Count: 34, Industry: 36 },                                                                                //
//         { Count: 927, Industry: 37 },                                                                               //
//         { Count: 7, Industry: 38 }],                                                                                //
//     [{ Count: 547910, Size: null },                                                                                 //
//         { Count: 409722, Size: 1 },                                                                                 //
//         { Count: 98793, Size: 2 },                                                                                  //
//         { Count: 73237, Size: 3 },                                                                                  //
//         { Count: 191917, Size: 4 }],                                                                                //
//     [{ Count: 839, EngagementStatus: null },                                                                        //
//         { Count: 822290, EngagementStatus: 1 },                                                                     //
//         { Count: 180192, EngagementStatus: 2 },                                                                     //
//         { Count: 171555, EngagementStatus: 3 },                                                                     //
//         { Count: 101214, EngagementStatus: 4 },                                                                     //
//         { Count: 39553, EngagementStatus: 5 },                                                                      //
//         { Count: 5936, EngagementStatus: 6 }]];                                                                     //
// const DEFAULT_STATS = {                                                                                             //
//     default: true,                                                                                                  //
//     date: new Date(),                                                                                               //
//     Count: { contactCount: 3768820, companyCount: 736823 },                                                         //
//     Segments: {                                                                                                     //
//         Efficiency: 66101,                                                                                          //
//         Transitional: 15472,                                                                                        //
//         Agility: 52780,                                                                                             //
//         Training: 34510,                                                                                            //
//         Accelerate: 54380,                                                                                          //
//         Integrate: 24378                                                                                            //
//     },                                                                                                              //
//     InstalledTechnologies: {                                                                                        //
//         RHEL: 540110,                                                                                               //
//         Red_Hat_Satellite: 212792,                                                                                  //
//         Enterprise_Application_Platform: 133732,                                                                    //
//         RHEV: 53146,                                                                                                //
//         OpenStack: 39084,                                                                                           //
//         CloudForms: 10691                                                                                           //
//     },                                                                                                              //
//     SuperRegions: { undefined: 8 },                                                                                 //
//     Persona: {                                                                                                      //
//         Architect: 85306,                                                                                           //
//         'Business Analyst': 136761,                                                                                 //
//         'IT Executive': 177567,                                                                                     //
//         'IT Manager': 415808,                                                                                       //
//         'Lead Developer': 342292,                                                                                   //
//         Other: 395879,                                                                                              //
//         'System Administrator': 124904,                                                                             //
//     },                                                                                                              //
//     Industry: {                                                                                                     //
//         Education: 67665,                                                                                           //
//         Finance: 187859,                                                                                            //
//         Government: 66187,                                                                                          //
//         'Healthcare ': 87858,                                                                                       //
//         Manufacturing: 200724,                                                                                      //
//         'Media & Internet': 150135,                                                                                 //
//     },                                                                                                              //
//     CompanySize: {                                                                                                  //
//         Enterprise: 528010,                                                                                         //
//         'Medium Business': 121449,                                                                                  //
//         'Mid-Market Enterprise': 149206,                                                                            //
//         'Small Business': 276430,                                                                                   //
//     },                                                                                                              //
//     EngagementStatus: {                                                                                             //
//         Inactive: 2258997,                                                                                          //
//         Internal: 16799,                                                                                            //
//         Invalid: 131612,                                                                                            //
//         Lapsed: 577054,                                                                                             //
//         Lapsing: 291377,                                                                                            //
//         'Most Activ': 492981                                                                                        //
//     },                                                                                                              //
//     companyCount: 736823,                                                                                           //
//     contactCount: 3768820                                                                                           //
// };                                                                                                                  //
                                                                                                                       //
// Given an object of filters, build a SQL Query                                                                       //
//                                                                                                                     //
// @param filters Object with shape {                                                                                  //
//      filter1: [],                                                                                                   //
//      filter2: [].                                                                                                   //
//      ...                                                                                                            //
//  }                                                                                                                  //
// @return String SQL Query to get counts                                                                              //
var heyLookAnotherStatsMethodTakesInFiltersOutputsStatsBlock = function heyLookAnotherStatsMethodTakesInFiltersOutputsStatsBlock(filters) {
    var query = (0, _mysql.getQueryPromise)();                                                                         // 515
    var whereClause = getWhereClause(filters);                                                                         // 516
    var sqlQuery = sqlBase + ' ' + whereClause + ';';                                                                  // 517
    var companyQuery = sqlCompanyBase + ' ' + whereClause + ' ' + sqlCompanyBase2 + ';';                               // 518
    console.log('***** SQL *****\n', sqlQuery, '\n', companyQuery, '\n***** END SQL *****');                           // 519
    var statsReturn = query(sqlQuery);                                                                                 // 520
    var companiesReturn = query(companyQuery);                                                                         // 521
                                                                                                                       //
    // console.log('***** Return *****\n', statsReturn, '\n***** Return *****');                                       //
    var statsBlock = getStatsFromSQLResponse(statsReturn.await());                                                     // 514
    var companies = companiesReturn.await();                                                                           // 525
    console.log(companies);                                                                                            // 526
    statsBlock.Companies = companies.map(function (r) {                                                                // 527
        return r.Company;                                                                                              //
    });                                                                                                                //
    // console.log('....StatsBlock.....\n', statsBlock);                                                               //
    return statsBlock;                                                                                                 // 514
};                                                                                                                     //
                                                                                                                       //
var sqlBase = 'SELECT sum(count) AS count, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise Application Platform`) AS `Enterprise Application Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM contact_counts ';
var sqlCompanyBase = 'SELECT SUM(count) AS count, Company FROM company_counts ';                                       // 533
var sqlCompanyBase2 = 'GROUP BY Company ORDER BY count DESC LIMIT 10';                                                 // 534
var getWhereClause = function getWhereClause(filters) {                                                                // 535
    var where = Object.keys(filters).filter(function (k) {                                                             // 536
        return filters[k].length;                                                                                      //
    }).map(function (k) {                                                                                              //
        var thisArr = filters[k];                                                                                      // 539
        return '(' + thisArr.map(function (val) {                                                                      // 540
            return '`' + val + '`>0';                                                                                  //
        }).join(' OR ') + ')';                                                                                         //
    }).join(' AND ');                                                                                                  //
    if (where.length) {                                                                                                // 544
        return 'WHERE ' + where;                                                                                       // 545
    }                                                                                                                  //
    return '';                                                                                                         // 547
};                                                                                                                     //
/**                                                                                                                    //
 *                                                                                                                     //
 * @param SQLRes has shape                                                                                             //
     [{                                                                                                                //
        NA: <Integer>,                                                                                                 //
        LATAM: <Integer>,                                                                                              //
        EMEA: <Integer>,                                                                                               //
        APAC: <Integer>,                                                                                               //
        IT Manager: <Integer>,                                                                                         //
        Other: <Integer>,                                                                                              //
        Lead Developer: <Integer>,                                                                                     //
        IT Executive: <Integer>,                                                                                       //
        Business Analyst: <Integer>,                                                                                   //
        System Administrator: <Integer>,                                                                               //
        Architect: <Integer>,                                                                                          //
        IT Decision Maker: <Integer>,                                                                                  //
        Enterprise: <Integer>,                                                                                         //
        Mid-Market Enterprise: <Integer>,                                                                              //
        Medium Business: <Integer>,                                                                                    //
        Small Business: <Integer>,                                                                                     //
        Manufacturing: <Integer>,                                                                                      //
        Finance: <Integer>,                                                                                            //
        Telecommunications: <Integer>,                                                                                 //
        Media & Internet: <Integer>,                                                                                   //
        Healthcare: <Integer>,                                                                                         //
        Education: <Integer>,                                                                                          //
        Government: <Integer>,                                                                                         //
        Inactive: <Integer>,                                                                                           //
        Lapsed: <Integer>,                                                                                             //
        Most Active: <Integer>,                                                                                        //
        Lapsing: <Integer>,                                                                                            //
        Invalid: <Integer>,                                                                                            //
        Internal: <Integer>,                                                                                           //
        ModAppDev_Accelerate: <Integer>,                                                                               //
        ModAppDev_Integrate: <Integer>,                                                                                //
        ITWOB_Efficiency: <Integer>,                                                                                   //
        ITWOB_Transitional: <Integer>,                                                                                 //
        ITWOB_Agility: <Integer>,                                                                                      //
        Training: <Integer>,                                                                                           //
        RHEL: <Integer>,                                                                                               //
        Satellite: <Integer>,                                                                                          //
        RHEV: <Integer>,                                                                                               //
        Enterprise_Application_Platform: <Integer>,                                                                    //
        OpenStack: <Integer>,                                                                                          //
        CloudForms: <Integer>                                                                                          //
    }]                                                                                                                 //
 *                                                                                                                     //
 * @return Object with shapeObject with shape                                                                          //
 {                                                                                                                     //
     Area1: {                                                                                                          //
         Element1: 123,                                                                                                //
         Element2: 234,                                                                                                //
         ...                                                                                                           //
     },                                                                                                                //
     Area2: {                                                                                                          //
         Element3: 345,                                                                                                //
         Element4: 456,                                                                                                //
         ...                                                                                                           //
     },                                                                                                                //
     ...                                                                                                               //
}                                                                                                                      //
 */                                                                                                                    //
var getStatsFromSQLResponse = function getStatsFromSQLResponse(SQLRes) {                                               // 611
    if (SQLRes.length !== 1) {                                                                                         // 612
        console.log('SQLRes should have one row', SQLRes);                                                             // 613
    }                                                                                                                  //
    var thisRes = SQLRes[0];                                                                                           // 615
    return {                                                                                                           // 616
        contactCount: thisRes.count,                                                                                   // 617
        companyCount: thisRes.companies,                                                                               // 618
        'Super Regions': {                                                                                             // 619
            'NA': thisRes['NA'],                                                                                       // 620
            'LATAM': thisRes['LATAM'],                                                                                 // 621
            'EMEA': thisRes['EMEA'],                                                                                   // 622
            'APAC': thisRes['APAC']                                                                                    // 623
        },                                                                                                             //
        Persona: {                                                                                                     // 625
            'IT Manager': thisRes['IT Manager'],                                                                       // 626
            'Other': thisRes['Other'],                                                                                 // 627
            'Lead Developer': thisRes['Lead Developer'],                                                               // 628
            'IT Executive': thisRes['IT Executive'],                                                                   // 629
            'Business Analyst': thisRes['Business Analyst'],                                                           // 630
            'System Administrator': thisRes['System Administrator'],                                                   // 631
            'Architect': thisRes['Architect'],                                                                         // 632
            'IT Decision Maker': thisRes['IT Decision Maker']                                                          // 633
        },                                                                                                             //
        'Company Size': {                                                                                              // 635
            'Enterprise': thisRes['Enterprise'],                                                                       // 636
            'Mid-Market Enterprise': thisRes['Mid-Market Enterprise'],                                                 // 637
            'Medium Business': thisRes['Medium Business'],                                                             // 638
            'Small Business': thisRes['Small Business']                                                                // 639
        },                                                                                                             //
        Industry: {                                                                                                    // 641
            'Manufacturing': thisRes['Manufacturing'],                                                                 // 642
            'Finance': thisRes['Finance'],                                                                             // 643
            'Telecommunications': thisRes['Telecommunications'],                                                       // 644
            'Media & Internet': thisRes['Media & Internet'],                                                           // 645
            'Healthcare': thisRes['Healthcare'],                                                                       // 646
            'Education': thisRes['Education'],                                                                         // 647
            'Government': thisRes['Government']                                                                        // 648
        },                                                                                                             //
        'Engagement Status': {                                                                                         // 650
            'Inactive': thisRes['Inactive'],                                                                           // 651
            'Lapsed': thisRes['Lapsed'],                                                                               // 652
            'Most Active': thisRes['Most Active'],                                                                     // 653
            'Lapsing': thisRes['Lapsing'],                                                                             // 654
            'Invalid': thisRes['Invalid'],                                                                             // 655
            'Internal': thisRes['Internal']                                                                            // 656
        },                                                                                                             //
        Programs: {                                                                                                    // 658
            'Accelerate': thisRes['Accelerate'],                                                                       // 659
            'Integrate': thisRes['Integrate'],                                                                         // 660
            'Efficiency': thisRes['Efficiency'],                                                                       // 661
            'Transitional': thisRes['Transitional'],                                                                   // 662
            'Agility': thisRes['Agility'],                                                                             // 663
            'Training': thisRes['Training']                                                                            // 664
        },                                                                                                             //
        'Installed Technologies': {                                                                                    // 666
            'RHEL': thisRes['RHEL'],                                                                                   // 667
            'Satellite': thisRes['Satellite'],                                                                         // 668
            'RHEV': thisRes['RHEV'],                                                                                   // 669
            'Enterprise Application Platform': thisRes['Enterprise Application Platform'],                             // 670
            'OpenStack': thisRes['OpenStack'],                                                                         // 671
            'CloudForms': thisRes['CloudForms']                                                                        // 672
        }                                                                                                              //
    };                                                                                                                 //
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"main.js":["meteor/meteor","./getEloquaData.js","../imports/collections.js","meteor/nimble:restivus","../imports/helpers/stats.js",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.__esModule = true;                                                                                             //
exports.updateSegmentList = undefined;                                                                                 //
                                                                                                                       //
var _meteor = require('meteor/meteor');                                                                                // 1
                                                                                                                       //
var _getEloquaData = require('./getEloquaData.js');                                                                    // 2
                                                                                                                       //
var _collections = require('../imports/collections.js');                                                               // 3
                                                                                                                       //
var _nimbleRestivus = require('meteor/nimble:restivus');                                                               // 4
                                                                                                                       //
var _stats = require('../imports/helpers/stats.js');                                                                   // 5
                                                                                                                       //
// Take an Eloqua response and insert the elements into the Segments collection                                        //
// Use with getEloquaResponse                                                                                          //
var insertSegments = _meteor.Meteor.bindEnvironment(function (body) {                                                  // 9
  for (var _iterator = body.elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;                                                                                                          //
                                                                                                                       //
    if (_isArray) {                                                                                                    //
      if (_i >= _iterator.length) break;                                                                               //
      _ref = _iterator[_i++];                                                                                          //
    } else {                                                                                                           //
      _i = _iterator.next();                                                                                           //
      if (_i.done) break;                                                                                              //
      _ref = _i.value;                                                                                                 //
    }                                                                                                                  //
                                                                                                                       //
    var obj = _ref;                                                                                                    //
                                                                                                                       //
    _collections.Segments.upsert({ _id: obj.id }, { $set: { _id: obj.id, name: obj.name } });                          // 11
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
// Called Daily to upsert new segment IDs                                                                              //
var updateSegmentList = exports.updateSegmentList = _meteor.Meteor.bindEnvironment(function () {                       // 17
  (0, _getEloquaData.getEloquaDataPromise)(_getEloquaData.SEGMENTS_URL, insertSegments).await();                       // 18
});                                                                                                                    //
                                                                                                                       //
///////////////                                                                                                        //
//                                                                                                                     //
// Meteor Startup code                                                                                                 //
//                                                                                                                     //
///////////////                                                                                                        //
_meteor.Meteor.startup(function () {                                                                                   // 26
  if (_collections.Segments.find().count() === 0) {                                                                    // 27
    // Populate the server with data if it is currently empty.                                                         //
    console.log('Populating Segments');                                                                                // 28
    _collections.Segments._ensureIndex({ name: 1 });                                                                   // 29
    updateSegmentList();                                                                                               // 30
  }                                                                                                                    //
  var updateSegmentsEveryMorning = new Cron(updateSegmentList, { minute: 0, hour: 1 });                                // 32
});                                                                                                                    //
                                                                                                                       //
////////////////                                                                                                       //
//                                                                                                                     //
// Meteor.Methods here                                                                                                 //
//                                                                                                                     //
////////////////                                                                                                       //
_meteor.Meteor.methods({                                                                                               // 40
                                                                                                                       //
  //Get a segment's contacts and accumulate stats                                                                      //
                                                                                                                       //
  getSegmentStatsByName: function () {                                                                                 // 43
    function getSegmentStatsByName(name) {                                                                             //
      //Log lookup                                                                                                     //
      _collections.Logs.insert({                                                                                       // 45
        type: 'Lookup',                                                                                                // 46
        input: name,                                                                                                   // 47
        records: 1,                                                                                                    // 48
        date: new Date()                                                                                               // 49
      });                                                                                                              //
      //If we have the stats of the segment cached, return the existing results.                                       //
      var segment = _collections.Segments.findOne({ name: name });                                                     // 43
      if (!segment) {                                                                                                  // 53
        throw new _meteor.Meteor.Error('Could Not Find Segment Name: ' + name);                                        // 54
      }                                                                                                                //
      if (segment.stats) {                                                                                             // 56
        return segment;                                                                                                // 57
      }                                                                                                                //
      console.log(segment);                                                                                            // 59
      // Otherwise start to build and then return the stats                                                            //
      return _meteor.Meteor.call('getSegmentStats', segment);                                                          // 43
    }                                                                                                                  //
                                                                                                                       //
    return getSegmentStatsByName;                                                                                      //
  }(),                                                                                                                 //
  getSegmentStats: function () {                                                                                       // 64
    function getSegmentStats(segment) {                                                                                //
      var firstPage = (0, _getEloquaData.getOneEloquaPage)(segment['_id']).await();                                    // 65
      segment.total = firstPage.total;                                                                                 // 66
      segment.stats = (0, _stats.accumulateStats)(firstPage.elements, 'eloqua', null);                                 // 67
      if (firstPage.total > 1000) {                                                                                    // 68
                                                                                                                       //
        var N = Math.ceil((firstPage.total - 1) / 1000);                                                               // 70
        var promArray = [];                                                                                            // 71
        for (var i = 2; i <= N; i++) {                                                                                 // 72
          promArray.push((0, _getEloquaData.getOneEloquaPage)(segment['_id'], i).then(function (res) {                 // 73
            return (0, _stats.accumulateStats)(res.elements, 'eloqua', segment.stats);                                 //
          }));                                                                                                         //
        }                                                                                                              //
        Promise.all(promArray).await();                                                                                // 75
      }                                                                                                                //
      // Update the Cache                                                                                              //
      segment.lastRefreshed = new Date();                                                                              // 64
      segment.dataSample = firstPage.elements.slice(0, 40).map(function (row) {                                        // 79
        return {                                                                                                       //
          first: row.C_FirstName,                                                                                      // 80
          last: row.C_LastName,                                                                                        // 81
          email: row.C_EmailAddress.replace(/.*@/, '***@')                                                             // 82
        };                                                                                                             //
      });                                                                                                              //
      _collections.Segments.update({ '_id': segment['_id'] }, segment);                                                // 84
      return segment;                                                                                                  // 85
    }                                                                                                                  //
                                                                                                                       //
    return getSegmentStats;                                                                                            //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
/////////////                                                                                                          //
//                                                                                                                     //
// Rest API starts here                                                                                                //
//                                                                                                                     //
/////////////                                                                                                          //
var RESTAPI = new _nimbleRestivus.Restivus({                                                                           // 97
  apiPath: 'ws',                                                                                                       // 98
  defaultHeaders: {                                                                                                    // 99
    'Content-Type': 'application/json'                                                                                 // 100
  },                                                                                                                   //
  prettyJson: true                                                                                                     // 102
});                                                                                                                    //
                                                                                                                       //
// ADMIN UTILITY to refresh data                                                                                       //
//https://...com/ws/refresh                                                                                            //
// Use Eloqua Credentials in header                                                                                    //
RESTAPI.addRoute('refresh', {                                                                                          // 108
  post: function () {                                                                                                  // 109
    function post() {                                                                                                  // 109
      if (this.request.headers.authorization === process.env.AUTHORIZATION) {                                          // 110
        console.log('Well Authorized, good sirs! Refreshing Data!');                                                   // 111
        updateSegmentList();                                                                                           // 112
        return {                                                                                                       // 113
          statusCode: 200,                                                                                             // 114
          body: 'Success!'                                                                                             // 115
        };                                                                                                             //
      } else {                                                                                                         //
        console.log('/ws/refresh was activated but the authorization was incorrect');                                  // 118
        console.log(this.request.headers.authorization);                                                               // 119
        console.log(process.env.AUTHORIZATION);                                                                        // 120
        return { statusCode: 401 };                                                                                    // 121
      }                                                                                                                //
    }                                                                                                                  //
                                                                                                                       //
    return post;                                                                                                       //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
//http:/...com/ws/eloquaCallsInLastNDays/:days                                                                         //
RESTAPI.addRoute('eloquaCallsInLastNDays/:days', {                                                                     // 127
  get: function () {                                                                                                   // 128
    function get() {                                                                                                   // 128
      var startDate = new Date(); // Current Date                                                                      // 129
      var days = this.urlParams.days;                                                                                  // 128
      startDate.setDate(startDate.getDate() - days); // Subtract N Days                                                // 131
      startDate.setHours(0); // Set the hour, minute and second components to 0                                        // 128
      startDate.setMinutes(0);                                                                                         // 128
      startDate.setSeconds(0);                                                                                         // 134
      var count = _collections.EloquaLogs.find({ date: { $gte: startDate } }).map(function (doc) {                     // 135
        return Math.ceil(doc.numPagesToGet);                                                                           //
      }).reduce(function (a, b) {                                                                                      //
        return a + b;                                                                                                  //
      }, 0);                                                                                                           //
      return { days: days, count: count };                                                                             // 136
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
// http://...com/ws/PathCodes                                                                                          //
// http://...com/ws/PathCodes/:id                                                                                      //
RESTAPI.addCollection(_collections.Segments, {                                                                         // 142
  excludedEndpoints: ['post', 'put', 'delete']                                                                         // 143
});                                                                                                                    //
                                                                                                                       //
RESTAPI.addCollection(_collections.EloquaLogs, {                                                                       // 146
  excludedEndpoints: ['post', 'put', 'delete']                                                                         // 147
});                                                                                                                    //
                                                                                                                       //
// Get a report of contacts looked up                                                                                  //
RESTAPI.addRoute('usageReport', {                                                                                      // 151
  get: function () {                                                                                                   // 152
    function get() {                                                                                                   // 152
      var oneDay = new Date(); // Current Date                                                                         // 153
      oneDay.setDate(oneDay.getDate() - 1); // Subtract N Days                                                         // 152
      var sevenDays = new Date(); // Current Date                                                                      // 152
      sevenDays.setDate(sevenDays.getDate() - 7); // Subtract N Days                                                   // 152
      var fourteenDays = new Date(); // Current Date                                                                   // 152
      fourteenDays.setDate(fourteenDays.getDate() - 14); // Subtract N Days                                            // 152
      var thirtyDays = new Date(); // Current Date                                                                     // 152
      thirtyDays.setDate(thirtyDays.getDate() - 30); // Subtract N Days                                                // 152
      var threeSixtyFiveDays = new Date(); // Current Date                                                             // 152
      threeSixtyFiveDays.setDate(thirtyDays.getDate() - 365); // Subtract N Days                                       // 152
      var REDUCE_SUM = function () {                                                                                   // 152
        function REDUCE_SUM(a, b) {                                                                                    // 163
          return a + b;                                                                                                //
        }                                                                                                              //
                                                                                                                       //
        return REDUCE_SUM;                                                                                             //
      }();                                                                                                             //
      var lastDay = _collections.Logs.find({ type: 'Lookup', date: { $gte: oneDay } });                                // 164
      var lastWeek = _collections.Logs.find({ type: 'Lookup', date: { $gte: sevenDays } });                            // 165
      var lastTwoWeeks = _collections.Logs.find({ type: 'Lookup', date: { $gte: fourteenDays } });                     // 166
      var lastMonth = _collections.Logs.find({ type: 'Lookup', date: { $gte: thirtyDays } });                          // 167
      var lastYear = _collections.Logs.find({ type: 'Lookup', date: { $gte: threeSixtyFiveDays } });                   // 168
      return {                                                                                                         // 169
        contactsFound: {                                                                                               // 170
          lastDay: lastDay.map(function (doc) {                                                                        // 171
            return doc.records;                                                                                        //
          }).reduce(REDUCE_SUM, 0),                                                                                    //
          lastWeek: lastWeek.map(function (doc) {                                                                      // 172
            return doc.records;                                                                                        //
          }).reduce(REDUCE_SUM, 0),                                                                                    //
          lastTwoWeeks: lastTwoWeeks.map(function (doc) {                                                              // 173
            return doc.records;                                                                                        //
          }).reduce(REDUCE_SUM, 0),                                                                                    //
          lastMonth: lastMonth.map(function (doc) {                                                                    // 174
            return doc.records;                                                                                        //
          }).reduce(REDUCE_SUM, 0),                                                                                    //
          lastYear: lastYear.map(function (doc) {                                                                      // 175
            return doc.records;                                                                                        //
          }).reduce(REDUCE_SUM, 0)                                                                                     //
        },                                                                                                             //
        uses: {                                                                                                        // 177
          lastDay: lastDay.count(),                                                                                    // 178
          lastWeek: lastWeek.count(),                                                                                  // 179
          lastTwoWeeks: lastTwoWeeks.count(),                                                                          // 180
          lastMonth: lastMonth.count(),                                                                                // 181
          lastYear: lastYear.count()                                                                                   // 182
        }                                                                                                              //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"testEloquaRest.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// testEloquaRest.js                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 'use strict';                                                                                                       //
//                                                                                                                     //
// const http = require('https');                                                                                      //
// const SEGMENT_LOOKUP = {                                                                                            //
//   host: 'secure.p01.eloqua.com',                                                                                    //
//   path: '/Api/rest/2.0/assets/contact/segments?depth=Complete',                                                     //
//   headers: {                                                                                                        //
//     authorization: process.env.AUTHORIZATION                                                                        //
//   }                                                                                                                 //
// };                                                                                                                  //
//                                                                                                                     //
// http.get(SEGMENT_LOOKUP, (res) => {                                                                                 //
//   let body = '';                                                                                                    //
//   res.on('data', (chunk) => {                                                                                       //
//     console.log('Got a chunk!');                                                                                    //
//     body += chunk;                                                                                                  //
//   });                                                                                                               //
//   res.on('end', () => {                                                                                             //
//     const elementTypes = {};                                                                                        //
//     const fullResponse = JSON.parse(body);                                                                          //
//     for (const obj of fullResponse.elements) {                                                                      //
//       for (const obj2 of obj.elements) {                                                                            //
//         if (obj2.type.includes('Filter')) {                                                                         //
//           console.log('***************');                                                                           //
//           console.log(JSON.stringify(obj2));                                                                        //
//           console.log('+++++++++++++++');                                                                           //
//           console.log(JSON.stringify(obj));                                                                         //
//           console.log('***************');                                                                           //
//         }                                                                                                           //
//                                                                                                                     //
//       }                                                                                                             //
//     }                                                                                                               //
//     console.log(JSON.stringify(elementTypes));                                                                      //
//   });                                                                                                               //
// });                                                                                                                 //
// console.log('This may take a while');                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},{"extensions":[".js",".json",".jsx"]});
require("./server/getEloquaData.js");
require("./server/segmentBuilderMethods.js");
require("./server/segmentBuilderMethodsV3.js");
require("./testEloquaRest.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
