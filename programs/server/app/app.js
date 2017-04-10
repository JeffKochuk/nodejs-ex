var require = meteorInstall({"imports":{"helpers":{"mysql.js":["mysql",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/helpers/mysql.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
    getConnection: function () {                                                                                       // 1
        return getConnection;                                                                                          // 1
    },                                                                                                                 // 1
    getQueryPromise: function () {                                                                                     // 1
        return getQueryPromise;                                                                                        // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
var mysql = void 0;                                                                                                    // 1
module.import("mysql", {                                                                                               // 1
    "default": function (v) {                                                                                          // 1
        mysql = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var getConnection = function () {                                                                                      // 3
    // const connection = mysql.createConnection({                                                                     // 4
    //     host     : "584099dfecdd5c15db000029-marketing.itos.redhat.com",                                            // 5
    //     port     : 54816,                                                                                           // 6
    //     user     : "adminYeMvBUb",                                                                                  // 7
    //     password : "nVNdcJBDaazL",                                                                                  // 8
    //     database : "workflows1",                                                                                    // 9
    //     multipleStatements: "true"                                                                                  // 10
    // });                                                                                                             // 11
    var connection = mysql.createConnection(JSON.parse(process.env.MYSQL_OBJECT));                                     // 12
    connection.connect();                                                                                              // 13
    return connection;                                                                                                 // 14
};                                                                                                                     // 15
                                                                                                                       //
var getQueryPromise = function () {                                                                                    // 17
    var connection = getConnection();                                                                                  // 18
    return function (qString) {                                                                                        // 19
        return new Promise(function (resolve, reject) {                                                                // 20
            connection.query(qString, function (err, data) {                                                           // 21
                if (err) return reject(err);                                                                           // 22
                resolve(data);                                                                                         // 23
            });                                                                                                        // 24
        });                                                                                                            // 25
    };                                                                                                                 // 26
};                                                                                                                     // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stats.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/helpers/stats.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
    accumulateStats: function () {                                                                                     // 1
        return accumulateStats;                                                                                        // 1
    },                                                                                                                 // 1
    mysqlMap: function () {                                                                                            // 1
        return mysqlMap;                                                                                               // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
/**                                                                                                                    // 1
 * Created by jkochuk on 10/5/16.                                                                                      //
 */var eloquaMap = new Map().set("C_Lead_Rating___Combined1", 'Lead Rating').set("C_Lead_Ranking1", 'Lead Ranking').set("C_Company", 'Company').set("C_Company_Size11", 'Company Size').set("C_Derived__Persona1", 'Persona').set("C_Industry1", 'Industry').set("C_Derived_Language_Preference1", 'Language').set("C_Country", 'Country');
var mysqlMap = new Map().set("MLSMScore", 'Lead Rating').set("MLSMRank", 'Lead Ranking').set("Company", 'Company').set("Size", 'Company Size').set("Persona", 'Persona').set("Industry", 'Industry').set("Language", 'Language').set("Country", 'Country');
var mapsAvailable = {                                                                                                  // 24
    eloqua: eloquaMap,                                                                                                 // 25
    mysql: mysqlMap                                                                                                    // 26
}; // Function accumulateStats takes an eloqua response's ELEMENTS field and counts the occurances for each value.     // 24
// Also can take the result of a mysql query and handle it the same way                                                // 31
                                                                                                                       //
var accumulateStats = function (elements, source, stats) {                                                             // 32
    if (source !== 'mysql' && source !== 'eloqua') {                                                                   // 33
        throw new Error('accumulateStats called without specifying the source');                                       // 34
    }                                                                                                                  // 35
                                                                                                                       //
    var mapToUse = mapsAvailable[source]; // Initialize our array if nothing was passed                                // 36
                                                                                                                       //
    if (!stats) {                                                                                                      // 39
        stats = {                                                                                                      // 40
            total: 0                                                                                                   // 40
        };                                                                                                             // 40
        mapToUse.forEach(function (val) {                                                                              // 41
            return stats[val] = {};                                                                                    // 41
        });                                                                                                            // 41
    } // Make sure we hve a total field available in stats;                                                            // 42
                                                                                                                       //
                                                                                                                       //
    if (!stats.total) {                                                                                                // 44
        stats.total = 0;                                                                                               // 45
    } // Accumulate values of statsMap into stats;                                                                     // 46
                                                                                                                       //
                                                                                                                       //
    var _loop = function (el) {                                                                                        // 32
        mapToUse.forEach(function (statAccumulatorName, eloquaFieldName) {                                             // 49
            // Mongo will be sad if we don't escape . and $ with alternate characters                                  // 50
            if (el[eloquaFieldName]) {                                                                                 // 51
                el[eloquaFieldName] = el[eloquaFieldName].replace(/\./g, "\uFF0E").replace(/\$/g, "\uFF04");           // 52
            } // Set or increment the stats, where 'VAL' is the stat name and 'el[key]' is the stat value              // 53
                                                                                                                       //
                                                                                                                       //
            stats[statAccumulatorName][el[eloquaFieldName]] = stats[statAccumulatorName][el[eloquaFieldName]] + (el.count || 1) || el.count || 1;
        });                                                                                                            // 56
        stats.total += el.count || 1;                                                                                  // 57
    };                                                                                                                 // 32
                                                                                                                       //
    for (var _iterator = elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;                                                                                                      // 48
                                                                                                                       //
        if (_isArray) {                                                                                                // 48
            if (_i >= _iterator.length) break;                                                                         // 48
            _ref = _iterator[_i++];                                                                                    // 48
        } else {                                                                                                       // 48
            _i = _iterator.next();                                                                                     // 48
            if (_i.done) break;                                                                                        // 48
            _ref = _i.value;                                                                                           // 48
        }                                                                                                              // 48
                                                                                                                       //
        var el = _ref;                                                                                                 // 48
                                                                                                                       //
        _loop(el);                                                                                                     // 48
    }                                                                                                                  // 58
                                                                                                                       //
    return stats;                                                                                                      // 59
};                                                                                                                     // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"collections.js":["meteor/mongo",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/collections.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  Segments: function () {                                                                                              // 1
    return Segments;                                                                                                   // 1
  },                                                                                                                   // 1
  EloquaLogs: function () {                                                                                            // 1
    return EloquaLogs;                                                                                                 // 1
  },                                                                                                                   // 1
  Logs: function () {                                                                                                  // 1
    return Logs;                                                                                                       // 1
  },                                                                                                                   // 1
  Stats: function () {                                                                                                 // 1
    return Stats;                                                                                                      // 1
  },                                                                                                                   // 1
  SqlCache: function () {                                                                                              // 1
    return SqlCache;                                                                                                   // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var Mongo = void 0;                                                                                                    // 1
module.import('meteor/mongo', {                                                                                        // 1
  "Mongo": function (v) {                                                                                              // 1
    Mongo = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Segments = new Mongo.Collection('segments');                                                                       // 3
var EloquaLogs = new Mongo.Collection('eloquaLogs');                                                                   // 4
var Logs = new Mongo.Collection('logs');                                                                               // 5
var Stats = new Mongo.Collection('statCache');                                                                         // 6
var SqlCache = new Mongo.Collection('sqlCache');                                                                       // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"server":{"getEloquaData.js":["node-fetch","../imports/collections.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/getEloquaData.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  getOneEloquaPage: function () {                                                                                      // 1
    return getOneEloquaPage;                                                                                           // 1
  },                                                                                                                   // 1
  getEloquaDataPromise: function () {                                                                                  // 1
    return getEloquaDataPromise;                                                                                       // 1
  },                                                                                                                   // 1
  getEloquaDataResults: function () {                                                                                  // 1
    return getEloquaDataResults;                                                                                       // 1
  },                                                                                                                   // 1
  SEGMENTS_URL: function () {                                                                                          // 1
    return SEGMENTS_URL;                                                                                               // 1
  },                                                                                                                   // 1
  CONTACTS_URL: function () {                                                                                          // 1
    return CONTACTS_URL;                                                                                               // 1
  },                                                                                                                   // 1
  LEIA_VIEW_URL: function () {                                                                                         // 1
    return LEIA_VIEW_URL;                                                                                              // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var fetch = void 0;                                                                                                    // 1
module.import('node-fetch', {                                                                                          // 1
  "default": function (v) {                                                                                            // 1
    fetch = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var EloquaLogs = void 0;                                                                                               // 1
module.import('../imports/collections.js', {                                                                           // 1
  "EloquaLogs": function (v) {                                                                                         // 1
    EloquaLogs = v;                                                                                                    // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var EloquaOptions = {                                                                                                  // 3
  headers: {                                                                                                           // 4
    authorization: process.env.AUTHORIZATION                                                                           // 5
  }                                                                                                                    // 4
};                                                                                                                     // 3
                                                                                                                       //
var getOneEloquaPage = function (id) {                                                                                 // 9
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;                                    // 9
  if (!id) throw new Meteor.Error("id: " + id + " is not valid");                                                      // 10
  var url = LEIA_VIEW_URL + "/" + id + "?page=" + page;                                                                // 11
  return fetch(url, EloquaOptions).then(function (res) {                                                               // 12
    return res.json();                                                                                                 // 13
  });                                                                                                                  // 13
};                                                                                                                     // 14
                                                                                                                       //
var getEloquaDataPromise = function (url, applyToEach) {                                                               // 17
  console.log("Getting URL Promise: " + url);                                                                          // 18
  return fetch(url, EloquaOptions).then(function (res) {                                                               // 19
    return res.json();                                                                                                 // 20
  }).then(function (body) {                                                                                            // 20
    console.log(body.total + 'elements in query');                                                                     // 22
    var numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);                                        // 23
    EloquaLogs.insert({                                                                                                // 24
      url: url,                                                                                                        // 24
      numPagesToGet: numPagesToGet,                                                                                    // 24
      date: new Date()                                                                                                 // 24
    });                                                                                                                // 24
    var pagesArray = [];                                                                                               // 25
    applyToEach(body);                                                                                                 // 26
                                                                                                                       //
    if (numPagesToGet > 1) {                                                                                           // 27
      for (var i = 1; i < numPagesToGet; i++) {                                                                        // 28
        pagesArray.push(fetch(url + "?page=" + (i + 1), EloquaOptions).then(function (res) {                           // 29
          return res.json();                                                                                           // 31
        }).then(applyToEach));                                                                                         // 31
      }                                                                                                                // 34
                                                                                                                       //
      Promise.all(pagesArray).await();                                                                                 // 35
    }                                                                                                                  // 36
                                                                                                                       //
    return body.total;                                                                                                 // 37
  });                                                                                                                  // 38
};                                                                                                                     // 39
                                                                                                                       //
var getEloquaDataResults = function (url) {                                                                            // 42
  console.log("Getting URL Promise: " + url);                                                                          // 43
  return fetch(url, EloquaOptions).then(function (res) {                                                               // 44
    return res.json();                                                                                                 // 45
  }).then(function (body) {                                                                                            // 45
    console.log(body.total + 'elements in query');                                                                     // 47
    var numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);                                        // 48
    EloquaLogs.insert({                                                                                                // 49
      url: url,                                                                                                        // 49
      numPagesToGet: numPagesToGet,                                                                                    // 49
      date: new Date()                                                                                                 // 49
    });                                                                                                                // 49
    var pagesArray = [];                                                                                               // 50
    var retArray = body.elements;                                                                                      // 51
                                                                                                                       //
    if (numPagesToGet > 1) {                                                                                           // 52
      for (var i = 1; i < numPagesToGet; i++) {                                                                        // 53
        pagesArray.push(fetch(url + "?page=" + (i + 1), EloquaOptions).then(function (res) {                           // 54
          return res.json();                                                                                           // 56
        }).then(function (json) {                                                                                      // 56
          return json.elements;                                                                                        // 57
        }));                                                                                                           // 57
      }                                                                                                                // 59
                                                                                                                       //
      var newElements = Promise.all(pagesArray).await();                                                               // 60
                                                                                                                       //
      for (var _iterator = newElements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;                                                                                                      // 61
                                                                                                                       //
        if (_isArray) {                                                                                                // 61
          if (_i >= _iterator.length) break;                                                                           // 61
          _ref = _iterator[_i++];                                                                                      // 61
        } else {                                                                                                       // 61
          _i = _iterator.next();                                                                                       // 61
          if (_i.done) break;                                                                                          // 61
          _ref = _i.value;                                                                                             // 61
        }                                                                                                              // 61
                                                                                                                       //
        var row = _ref;                                                                                                // 61
        retArray = retArray.concat(row);                                                                               // 62
      }                                                                                                                // 63
    }                                                                                                                  // 64
                                                                                                                       //
    return retArray;                                                                                                   // 66
  });                                                                                                                  // 67
};                                                                                                                     // 68
                                                                                                                       //
var SEGMENTS_URL = 'https://secure.p01.eloqua.com/Api/rest/2.0/assets/contact/segments';                               // 71
var CONTACTS_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment';             // 74
var LEIA_VIEW_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100190/contacts/segment';            // 76
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"segmentBuilderMethods.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethods.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// /**                                                                                                                 // 1
//  * Created by jkochuk on 10/3/16.                                                                                   // 2
//  */                                                                                                                 // 3
//                                                                                                                     // 4
// import { Meteor } from 'meteor/meteor';                                                                             // 5
// import { getConnection, getQueryPromise } from '../imports/helpers/mysql.js';                                       // 6
// import promisify  from 'es6-promisify';                                                                             // 7
// import { accumulateStats, mysqlMap } from '../imports/helpers/stats.js';                                            // 8
// import fetch from 'node-fetch';                                                                                     // 9
// import sqlstring from 'sqlstring';                                                                                  // 10
//                                                                                                                     // 11
// // Data should look like this                                                                                       // 12
// // {                                                                                                                // 13
// //      email: "jkochuk@redhat.com",                                                                                // 14
// //      areasOfInterest: Array[2],                                                                                  // 15
// //      interestSource: Array[1],                                                                                   // 16
// //      activeUsers: false,                                                                                         // 17
// //      personas: Array[2],                                                                                         // 18
// //      completeness: true,                                                                                         // 19
// //      geography: "",                                                                                              // 20
// //      geographyRadius: "",                                                                                        // 21
// //      industry: Array[1]                                                                                          // 22
// // }                                                                                                                // 23
// const statsFields = ['Language', 'Size', 'Industry', 'SuperRegion', 'Persona'];                                     // 24
// const sparseStatsFields = ['Company', 'Country', 'MetroArea'];                                                      // 25
// const fullStatsFields = ['Persona', 'Language', 'Size', 'Industry', 'Company', 'Country', 'MLSMScore', 'MLSMRank'];
//                                                                                                                     // 27
// Meteor.methods({                                                                                                    // 28
//     getQuickStats(filters) {                                                                                        // 29
//         if (!(filters.Themes && filters.Themes.length)) {                                                           // 30
//             console.log('No Themes')                                                                                // 31
//             console.log(filters);                                                                                   // 32
//             return { loading: false };                                                                              // 33
//         }                                                                                                           // 34
//         const query = getQueryPromise();                                                                            // 35
//         // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
//         // const startTime = Date.now(); // @todo remove                                                            // 37
//         const { Themes, ...rest } = filters;                                                                        // 38
//         const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);                                    // 39
//         let qs = `SELECT ${statsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY Language, Size, Industry, SuperRegion, Persona;`;
//         console.log(qs);                                                                                            // 41
//         const res = query(qs).await();                                                                              // 42
//         // const midTime = Date.now();// @todo remove                                                               // 43
//         let count = 0;                                                                                              // 44
//         const stats = { count: 0 };                                                                                 // 45
//         for (let n of statsFields) {                                                                                // 46
//             stats[n]={};                                                                                            // 47
//         }                                                                                                           // 48
//         for (let row of res) {                                                                                      // 49
//             const { count } = row;                                                                                  // 50
//             stats.count += count;                                                                                   // 51
//             for (let stat of statsFields) {                                                                         // 52
//                 stats[stat][row[stat]] = (stats[stat][row[stat]] || 0) + count;                                     // 53
//             }                                                                                                       // 54
//         }                                                                                                           // 55
//         // console.log('Count', stats.count); //@todo                                                               // 56
//         // console.log('Half Way', midTime - startTime);//@todo                                                     // 57
//         // console.log('Full time', Date.now() - startTime);//@todo                                                 // 58
//         return { stats }                                                                                            // 59
//     },                                                                                                              // 60
//                                                                                                                     // 61
//     // @todo you can just put this as another instance of getStats                                                  // 62
//     getSparseStats(filters) {                                                                                       // 63
//         if (!(filters.Themes && filters.Themes.length)) {                                                           // 64
//             console.log('No Themes');                                                                               // 65
//             console.log(filters);                                                                                   // 66
//             return { loading: false };                                                                              // 67
//         }                                                                                                           // 68
//         const query = getQueryPromise();                                                                            // 69
//         // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
//         // const startTime = Date.now(); // @todo remove                                                            // 71
//         const { Themes, ...rest } = filters;                                                                        // 72
//         const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);                                    // 73
//         let qs = `SELECT ${sparseStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${sparseStatsFields};`;
//         console.log(qs);                                                                                            // 75
//         const res = query(qs).await();                                                                              // 76
//         const sparseStats = {};                                                                                     // 77
//         for (let n of sparseStatsFields) {                                                                          // 78
//             sparseStats[n]={};                                                                                      // 79
//         }                                                                                                           // 80
//         for (let row of res) {                                                                                      // 81
//             const { count } = row;                                                                                  // 82
//             sparseStats.count += count;                                                                             // 83
//             for (let stat of sparseStatsFields) {                                                                   // 84
//                 sparseStats[stat][row[stat]] = (sparseStats[stat][row[stat]] || 0) + count;                         // 85
//             }                                                                                                       // 86
//         }                                                                                                           // 87
//         return { sparseStats }                                                                                      // 88
//     },                                                                                                              // 89
//                                                                                                                     // 90
//     getFullStats(filters) {                                                                                         // 91
//         // const startTime = Date.now(); // @todo remove                                                            // 92
//         if (!(filters.Themes && filters.Themes.length)) {                                                           // 93
//             console.log('No Themes');                                                                               // 94
//             console.log(filters);                                                                                   // 95
//             return { loading: false };                                                                              // 96
//         }                                                                                                           // 97
//         const { Themes, ...rest } = filters;                                                                        // 98
//         const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length); // Get keys of rest with values of non-empty arrays
//         let qs = `SELECT ${fullStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${fullStatsFields};`;
//         const query = getQueryPromise();                                                                            // 101
//         console.log(qs);                                                                                            // 102
//         const queryReturn = query(qs)                                                                               // 103
//             .then((rows) => {                                                                                       // 104
//                 console.log(rows.length);                                                                           // 105
//                 return rows;                                                                                        // 106
//             })                                                                                                      // 107
//             .await();                                                                                               // 108
//         const fullStats = accumulateStats(queryReturn, 'mysql', null);                                              // 109
//         console.log(fullStats.total);                                                                               // 110
//         return {                                                                                                    // 111
//             fullStats                                                                                               // 112
//         };                                                                                                          // 113
//     },                                                                                                              // 114
//                                                                                                                     // 115
//                                                                                                                     // 116
//     segmentBuilderBuildOriginalStats(formData) {                                                                    // 117
//         let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
//         let whereClauses = [];                                                                                      // 119
//         let isThereEnoughData = false;                                                                              // 120
//         if (formData.engagement && formData.engagement.length) {                                                    // 121
//             whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);                        // 122
//             isThereEnoughData = true;                                                                               // 123
//         }                                                                                                           // 124
//         if (formData.personas.length) {                                                                             // 125
//             whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);                                   // 126
//             isThereEnoughData = true;                                                                               // 127
//         }                                                                                                           // 128
//         if (formData.completeness && formData.completeness.length) {                                                // 129
//             whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);                     // 130
//             isThereEnoughData = true;                                                                               // 131
//         }                                                                                                           // 132
//         if (formData.industry.length) {                                                                             // 133
//             whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);                                  // 134
//             isThereEnoughData = true;                                                                               // 135
//         }                                                                                                           // 136
//         if (formData.metro.length) {                                                                                // 137
//             whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);                                    // 138
//             isThereEnoughData = true;                                                                               // 139
//         }                                                                                                           // 140
//         if (formData.theme.length) {                                                                                // 141
//             query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
//             isThereEnoughData = true;                                                                               // 143
//         }                                                                                                           // 144
//                                                                                                                     // 145
//         if (isThereEnoughData) {                                                                                    // 146
//             if (whereClauses.length) {                                                                              // 147
//                 query = query + ' where ' + whereClauses.join(' AND ');                                             // 148
//             }                                                                                                       // 149
//             console.log(query);                                                                                     // 150
//             //@todo remove this LIMIT once you have indices in place                                                // 151
//             query = query + ' LIMIT 10000';                                                                         // 152
//             const connection = getConnection();                                                                     // 153
//             const queryDB = promisify(connection.query, connection);                                                // 154
//             const queryReturn = queryDB(query)                                                                      // 155
//                 .then((rows) => {                                                                                   // 156
//                     console.log(rows.length);                                                                       // 157
//                     return rows;                                                                                    // 158
//                 })                                                                                                  // 159
//                 .await();                                                                                           // 160
//                                                                                                                     // 161
//             const stats = accumulateStats(queryReturn, 'mysql', null);                                              // 162
//             // console.log(stats);                                                                                  // 163
//             const segment = {                                                                                       // 164
//                 stats,                                                                                              // 165
//                 total: queryReturn.length                                                                           // 166
//             };                                                                                                      // 167
//             // console.log(segment);                                                                                // 168
//             return segment;                                                                                         // 169
//                                                                                                                     // 170
//         } else {                                                                                                    // 171
//             throw new Meteor.Error('Need more details');                                                            // 172
//         }                                                                                                           // 173
//     },                                                                                                              // 174
//     testStatsMethod(formData) {                                                                                     // 175
//         const startTimeMethod1 = Date.now();                                                                        // 176
//         let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
//         let whereClauses = [];                                                                                      // 178
//         let isThereEnoughData = false;                                                                              // 179
//         if (formData.engagement && formData.engagement.length) {                                                    // 180
//             whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);                        // 181
//             isThereEnoughData = true;                                                                               // 182
//         }                                                                                                           // 183
//         if (formData.personas.length) {                                                                             // 184
//             whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);                                   // 185
//             isThereEnoughData = true;                                                                               // 186
//         }                                                                                                           // 187
//         if (formData.completeness && formData.completeness.length) {                                                // 188
//             whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);                     // 189
//             isThereEnoughData = true;                                                                               // 190
//         }                                                                                                           // 191
//         if (formData.industry.length) {                                                                             // 192
//             whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);                                  // 193
//             isThereEnoughData = true;                                                                               // 194
//         }                                                                                                           // 195
//         if (formData.metro.length) {                                                                                // 196
//             whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);                                    // 197
//             isThereEnoughData = true;                                                                               // 198
//         }                                                                                                           // 199
//         if (formData.theme.length) {                                                                                // 200
//             query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
//             isThereEnoughData = true;                                                                               // 202
//         }                                                                                                           // 203
//                                                                                                                     // 204
//         if (isThereEnoughData) {                                                                                    // 205
//             if (whereClauses.length) {                                                                              // 206
//                 query = query + ' where ' + whereClauses.join(' AND ');                                             // 207
//             }                                                                                                       // 208
//             console.log(query);                                                                                     // 209
//             //@todo remove this LIMIT once you have indices in place                                                // 210
//             // query = query + ' LIMIT 10000';                                                                      // 211
//             const connection = getConnection();                                                                     // 212
//             const queryDB = promisify(connection.query, connection);                                                // 213
//             const queryReturn = queryDB(query)                                                                      // 214
//                 .then((rows) => {                                                                                   // 215
//                     console.log(rows.length);                                                                       // 216
//                     return rows;                                                                                    // 217
//                 })                                                                                                  // 218
//                 .await();                                                                                           // 219
//                                                                                                                     // 220
//             const stats = accumulateStats(queryReturn, 'mysql', null);                                              // 221
//             // console.log(stats);                                                                                  // 222
//             const segment = {                                                                                       // 223
//                 stats,                                                                                              // 224
//                 total: queryReturn.length                                                                           // 225
//             };                                                                                                      // 226
//             // console.log(segment);                                                                                // 227
//             const endTimeMethod1 = Date.now();                                                                      // 228
//             console.log('Time for stats method 1', endTimeMethod1 - startTimeMethod1, '::::', Math.ceil((endTimeMethod1 - startTimeMethod1) / 1000), 'sec')
//             return segment;                                                                                         // 230
//                                                                                                                     // 231
//             // const startTimeMethod2 = Date.now();                                                                 // 232
//             // const fromQuery = query.slice(query.indexOf('from'));                                                // 233
//             // const countQueries = [];                                                                             // 234
//             // mysqlMap.forEach((key, name) => countQueries.push(`SELECT ${name}, COUNT(*) as 'count' ${fromQuery} GROUP BY ${name}`));
//             // console.log(countQueries);                                                                           // 236
//             // const joinedQuery = countQueries.join('; ');                                                         // 237
//             // const stats2 = {};                                                                                   // 238
//             // queryDB(joinedQuery)                                                                                 // 239
//             //     .then((results) => {                                                                             // 240
//             //         // console.log(stats);                                                                       // 241
//             //         // console.log(results);                                                                     // 242
//             //         //results is an array of [{word, count(*)},{}],[]                                            // 243
//             //         results.forEach((entries) => {                                                               // 244
//             //             let thisSetOfStats = '';                                                                 // 245
//             //             let thisDbName = '';                                                                     // 246
//             //             entries.forEach((entry) => {                                                             // 247
//             //                 if (!thisSetOfStats) {                                                               // 248
//             //                     const thisEntryHolder = Object.keys(entry).filter((x) => x !== 'count');         // 249
//             //                     if (thisEntryHolder.length) {                                                    // 250
//             //                         thisDbName = thisEntryHolder[0];                                             // 251
//             //                         thisSetOfStats = mysqlMap.get(thisDbName);                                   // 252
//             //                         stats2[thisSetOfStats] = {}                                                  // 253
//             //                     }                                                                                // 254
//             //                 }                                                                                    // 255
//             //                 // Yeah this will be annoying to figure out so here's how it goes:                   // 256
//             //                 //                                                                                   // 257
//             //                 // Entries looks like this:                                                          // 258
//             //                 // [ { MLSMScore: 'B1', 'count': 70 },                                               // 259
//             //                 // { MLSMScore: 'B2', 'count': 94 }, ... ]                                           // 260
//             //                 //                                                                                   // 261
//             //                 // We want it to look like this:                                                     // 262
//             //                 // { MLSMScore: {                                                                    // 263
//             //                 //      B1: 70,                                                                      // 264
//             //                 //      B2: 94, ...                                                                  // 265
//             //                 //    }                                                                              // 266
//             //                 // }                                                                                 // 267
//             //                 stats2[thisSetOfStats][entry[thisDbName]] = entry.count;                             // 268
//             //             });                                                                                      // 269
//             //         });                                                                                          // 270
//             //     })                                                                                               // 271
//             //     .catch(console.log)                                                                              // 272
//             //     .await();                                                                                        // 273
//             // //rankData, companies, map, etc...                                                                   // 274
//             //                                                                                                      // 275
//             //                                                                                                      // 276
//             //                                                                                                      // 277
//             // const endTimeMethod2 = Date.now();                                                                   // 278
//             // console.log('Time for stats method 1', endTimeMethod2 - startTimeMethod2, '::::', Math.ceil((endTimeMethod2 - startTimeMethod2) / 1000), 'sec');
//             //                                                                                                      // 280
//             // // console.log(stats2);                                                                              // 281
//             //                                                                                                      // 282
//             //                                                                                                      // 283
//             //                                                                                                      // 284
//             //                                                                                                      // 285
//             //                                                                                                      // 286
//             // segment.stats = stats2;                                                                              // 287
//             // return segment;                                                                                      // 288
//                                                                                                                     // 289
//         } else {                                                                                                    // 290
//             throw new Meteor.Error('Need more details');                                                            // 291
//         }                                                                                                           // 292
//     },                                                                                                              // 293
//                                                                                                                     // 294
//                                                                                                                     // 295
//                                                                                                                     // 296
//     //@TODO IMPLEMENT EVENTUALLY                                                                                    // 297
//     segmentBuilderSaveToEloqua(formData){                                                                           // 298
//         const placeToPostTo = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment';                  // 299
//         const thenQueue = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment/queue';                // 300
//                                                                                                                     // 301
//         const criteria = [];                                                                                        // 302
//         if (formData.engagement && formData.engagement.length) {                                                    // 303
//             const criterion = {                                                                                     // 304
//                 "type": "ContactFieldCriterion",                                                                    // 305
//                 "id": "-1",                                                                                         // 306
//                 "condition": {                                                                                      // 307
//                     "type": "TextSetCondition",                                                                     // 308
//                     "operator": "in",                                                                               // 309
//                     "optionListId": "-1",                                                                           // 310
//                     "quickListString": formData.engagement.join(',')                                                // 311
//                 },                                                                                                  // 312
//                 "fieldId": "100837"                                                                                 // 313
//             };                                                                                                      // 314
//             criteria.push(criterion)                                                                                // 315
//         }                                                                                                           // 316
//                                                                                                                     // 317
//         if (formData.personas && formData.personas.length) {                                                        // 318
//             const criterion = {                                                                                     // 319
//                 "type": "ContactFieldCriterion",                                                                    // 320
//                 "id": "-2",                                                                                         // 321
//                 "condition": {                                                                                      // 322
//                     "type": "TextSetCondition",                                                                     // 323
//                     "operator": "in",                                                                               // 324
//                     "optionListId": "-2",                                                                           // 325
//                     "quickListString": formData.personas.join(',')                                                  // 326
//                 },                                                                                                  // 327
//                 "fieldId": "100837"                                                                                 // 328
//             };                                                                                                      // 329
//             criteria.push(criterion)                                                                                // 330
//         }                                                                                                           // 331
//                                                                                                                     // 332
//         if (formData.completeness && formData.completeness.length) {                                                // 333
//             const criterion = {                                                                                     // 334
//                 "type": "ContactFieldCriterion",                                                                    // 335
//                 "id": "-3",                                                                                         // 336
//                 "condition": {                                                                                      // 337
//                     "type": "TextSetCondition",                                                                     // 338
//                     "operator": "in",                                                                               // 339
//                     "optionListId": "-3",                                                                           // 340
//                     "quickListString": formData.completeness.join(',')                                              // 341
//                 },                                                                                                  // 342
//                 "fieldId": "100811"                                                                                 // 343
//             };                                                                                                      // 344
//             criteria.push(criterion)                                                                                // 345
//         }                                                                                                           // 346
//                                                                                                                     // 347
//         if (formData.industry && formData.industry.length) {                                                        // 348
//             const criterion = {                                                                                     // 349
//                 "type": "ContactFieldCriterion",                                                                    // 350
//                 "id": "-4",                                                                                         // 351
//                 "condition": {                                                                                      // 352
//                     "type": "TextSetCondition",                                                                     // 353
//                     "operator": "in",                                                                               // 354
//                     "optionListId": "-4",                                                                           // 355
//                     "quickListString": formData.industry.join(',')                                                  // 356
//                 },                                                                                                  // 357
//                 "fieldId": "100046"                                                                                 // 358
//             };                                                                                                      // 359
//             criteria.push(criterion)                                                                                // 360
//         }                                                                                                           // 361
//                                                                                                                     // 362
//         if (formData.metro && formData.metro.length) {                                                              // 363
//             const criterion = {                                                                                     // 364
//                 "type": "ContactFieldCriterion",                                                                    // 365
//                 "id": "-5",                                                                                         // 366
//                 "condition": {                                                                                      // 367
//                     "type": "TextSetCondition",                                                                     // 368
//                     "operator": "in",                                                                               // 369
//                     "optionListId": "-5",                                                                           // 370
//                     "quickListString": formData.metro.join(',')                                                     // 371
//                 },                                                                                                  // 372
//                 "fieldId": "100818"                                                                                 // 373
//             };                                                                                                      // 374
//             criteria.push(criterion)                                                                                // 375
//         }                                                                                                           // 376
//                                                                                                                     // 377
//         if (formData.theme && formData.theme.length) {                                                              // 378
//             //@todo do theme here                                                                                   // 379
//             console.log("We don't *DO* theme here...");                                                             // 380
//         }                                                                                                           // 381
//                                                                                                                     // 382
//         const filter = {                                                                                            // 383
//             "isIncluded": "true",                                                                                   // 384
//             "filter": {                                                                                             // 385
//                 "name": "Filter Criterion 1",                                                                       // 386
//                 "scope": "local",                                                                                   // 387
//                 "id": "-111",                                                                                       // 388
//                 "createdBy": "2084",                                                                                // 389
//                 "createdAt": "" + new Date().valueOf() / 1000,                                                      // 390
//                 "type": "ContactFilter",                                                                            // 391
//                 "criteria": criteria,                                                                               // 392
//                 "statement": criteria.map((c) => c.id).join(' AND '),                                               // 393
//                 "x_e10_isTemplate": "false",                                                                        // 394
//                 "permissions": [                                                                                    // 395
//                     "Retrieve",                                                                                     // 396
//                     "Update",                                                                                       // 397
//                     "Delete",                                                                                       // 398
//                     "SetSecurity"                                                                                   // 399
//                 ]                                                                                                   // 400
//             },                                                                                                      // 401
//             "id": "-112",                                                                                           // 402
//             "type": "ContactFilterSegmentElement"                                                                   // 403
//         };                                                                                                          // 404
//                                                                                                                     // 405
//         const template = {                                                                                          // 406
//             "createdBy": "2084",                                                                                    // 407
//             "createdAt": "1476197319",                                                                              // 408
//             // "updatedBy": "2084",                                                                                 // 409
//             // "updatedAt": "1476197319",                                                                           // 410
//             "currentStatus": "Draft",                                                                               // 411
//             "type": "ContactSegment",                                                                               // 412
//             "elements": [                                                                                           // 413
//                 filter                                                                                              // 414
//             ],                                                                                                      // 415
//             "isBlankTemplate": true,                                                                                // 416
//             "id": "-211",                                                                                           // 417
//             "name": `TESTTEST: ${formData.name}`,                                                                   // 418
//             "permissions": [                                                                                        // 419
//                 "Retrieve",                                                                                         // 420
//                 "Update",                                                                                           // 421
//                 "Delete",                                                                                           // 422
//                 "SetSecurity"                                                                                       // 423
//             ],                                                                                                      // 424
//             "folderId": "180344",                                                                                   // 425
//             "x_e10_isTemplate": "false",                                                                            // 426
//             "depth": "complete"                                                                                     // 427
//         };                                                                                                          // 428
//         console.log(JSON.stringify(template));                                                                      // 429
//                                                                                                                     // 430
//         fetch(placeToPostTo, { method: 'POST', body: JSON.stringify(template), headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } })
//             .then((res) => res.json())                                                                              // 432
//             .then((json) => {                                                                                       // 433
//                 console.log('***** First Half *****');                                                              // 434
//                 console.log(json);                                                                                  // 435
//                 return fetch(`${thenQueue}/${json.id}`, { method: 'POST', headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } })
//             })                                                                                                      // 437
//             .then((res) => res.json())                                                                              // 438
//             .then((json) => {                                                                                       // 439
//                 console.log('***** QUEUE RES *****');                                                               // 440
//                 console.log(json);                                                                                  // 441
//             })                                                                                                      // 442
//             .await();                                                                                               // 443
//         console.log('DONE!');                                                                                       // 444
//                                                                                                                     // 445
//                                                                                                                     // 446
//     }                                                                                                               // 447
// });                                                                                                                 // 448
//                                                                                                                     // 449
//                                                                                                                     // 450
// // const thisOneWorked = {                                                                                          // 451
// //     "createdBy": "2084",                                                                                         // 452
// //     "createdAt": "1476197319",                                                                                   // 453
// //     "currentStatus": "Draft",                                                                                    // 454
// //     "type": "ContactSegment",                                                                                    // 455
// //     "elements": [                                                                                                // 456
// //         {                                                                                                        // 457
// //             "isIncluded": "true",                                                                                // 458
// //             "filter": {                                                                                          // 459
// //                 "name": "Filter Criteria 1",                                                                     // 460
// //                 "scope": "local",                                                                                // 461
// //                 "id": "-111",                                                                                    // 462
// //                 "createdBy": "2084",                                                                             // 463
// //                 "createdAt": "1476197359",                                                                       // 464
// //                 "type": "ContactFilter",                                                                         // 465
// //                 "criteria": [{                                                                                   // 466
// //                     "type": "ContactFieldCriterion",                                                             // 467
// //                     "id": "-5",                                                                                  // 468
// //                     "condition": {                                                                               // 469
// //                         "type": "TextSetCondition",                                                              // 470
// //                         "operator": "in",                                                                        // 471
// //                         "optionListId": "-5",                                                                    // 472
// //                         "quickListString": "High,Medium"                                                         // 473
// //                     },                                                                                           // 474
// //                     "fieldId": "100811"                                                                          // 475
// //                 }],                                                                                              // 476
// //                 "statement": "-5",                                                                               // 477
// //                 "x_e10_isTemplate": "false",                                                                     // 478
// //                 "permissions": [                                                                                 // 479
// //                     "Retrieve",                                                                                  // 480
// //                     "Update",                                                                                    // 481
// //                     "Delete",                                                                                    // 482
// //                     "SetSecurity"                                                                                // 483
// //                 ]                                                                                                // 484
// //             },                                                                                                   // 485
// //             "id": "-112",                                                                                        // 486
// //             "type": "ContactFilterSegmentElement"                                                                // 487
// //         }                                                                                                        // 488
// //     ],                                                                                                           // 489
// //     "isBlankTemplate": true,                                                                                     // 490
// //     "id": "-211",                                                                                                // 491
// //     "name": "TEST REST 123123",                                                                                  // 492
// //     "permissions": [                                                                                             // 493
// //         "Retrieve",                                                                                              // 494
// //         "Update",                                                                                                // 495
// //         "Delete",                                                                                                // 496
// //         "SetSecurity"                                                                                            // 497
// //     ],                                                                                                           // 498
// //     "folderId": "180344",                                                                                        // 499
// //     "x_e10_isTemplate": "false",                                                                                 // 500
// //     "depth": "complete"                                                                                          // 501
// // };                                                                                                               // 502
//                                                                                                                     // 503
//                                                                                                                     // 504
// var x = {                                                                                                           // 505
//     "createdBy": "2084",                                                                                            // 506
//     "createdAt": "1476197319",                                                                                      // 507
//     "currentStatus": "Draft",                                                                                       // 508
//     "type": "ContactSegment",                                                                                       // 509
//     "elements": [{                                                                                                  // 510
//         "isIncluded": "true",                                                                                       // 511
//         "filter": {                                                                                                 // 512
//             "name": "Filter Criterion 1",                                                                           // 513
//             "scope": "local",                                                                                       // 514
//             "id": "-111",                                                                                           // 515
//             "createdBy": "2084",                                                                                    // 516
//             "createdAt": "1479321218.145",                                                                          // 517
//             "type": "ContactFilter",                                                                                // 518
//             "criteria": [{                                                                                          // 519
//                 "type": "ContactFieldCriterion",                                                                    // 520
//                 "id": "-4",                                                                                         // 521
//                 "condition": {                                                                                      // 522
//                     "type": "TextSetCondition",                                                                     // 523
//                     "operator": "in",                                                                               // 524
//                     "optionListId": "-4",                                                                           // 525
//                     "quickListString": "Finance,Telecommunications"                                                 // 526
//                 },                                                                                                  // 527
//                 "fieldId": "100046"                                                                                 // 528
//             }],                                                                                                     // 529
//             "statement": "-4",                                                                                      // 530
//             "x_e10_isTemplate": "false",                                                                            // 531
//             "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]                                          // 532
//         },                                                                                                          // 533
//         "id": "-112",                                                                                               // 534
//         "type": "ContactFilterSegmentElement"                                                                       // 535
//     }],                                                                                                             // 536
//     "isBlankTemplate": true,                                                                                        // 537
//     "id": "-211",                                                                                                   // 538
//     "name": "TEST: Leia Created 1479321218138",                                                                     // 539
//     "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],                                                 // 540
//     "folderId": "180344",                                                                                           // 541
//     "x_e10_isTemplate": "false",                                                                                    // 542
//     "depth": "complete"                                                                                             // 543
// }                                                                                                                   // 544
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"segmentBuilderMethodsV3.js":["babel-runtime/helpers/extends","meteor/meteor","../imports/collections.js","../imports/helpers/mysql.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethodsV3.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var Meteor = void 0;                                                                                                   // 1
module.import('meteor/meteor', {                                                                                       // 1
    "Meteor": function (v) {                                                                                           // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Stats = void 0,                                                                                                    // 1
    SqlCache = void 0;                                                                                                 // 1
module.import('../imports/collections.js', {                                                                           // 1
    "Stats": function (v) {                                                                                            // 1
        Stats = v;                                                                                                     // 1
    },                                                                                                                 // 1
    "SqlCache": function (v) {                                                                                         // 1
        SqlCache = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var getQueryPromise = void 0;                                                                                          // 1
module.import('../imports/helpers/mysql.js', {                                                                         // 1
    "getQueryPromise": function (v) {                                                                                  // 1
        getQueryPromise = v;                                                                                           // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
Meteor.startup(function () {// Meteor.call('getStats', { Segments: [], SuperRegions: [], Persona: [], Industry: [], CompanySize: [], EngagementStatus: [], InstalledTechnologies: [] }, (stats) => {
    //     Stats.upsert({ default: true }, {                                                                           // 12
    //         default: true,                                                                                          // 13
    //         date: new Date(),                                                                                       // 14
    //         stats,                                                                                                  // 15
    //     });                                                                                                         // 16
    //     console.log(stats);                                                                                         // 17
    // });                                                                                                             // 18
});                                                                                                                    // 19
Meteor.methods({                                                                                                       // 21
    // Called when the page is first loaded.                                                                           // 22
    getDefaultStats: function () {                                                                                     // 23
        var defaultStats = Stats.findOne({                                                                             // 24
            "default": true                                                                                            // 24
        });                                                                                                            // 24
                                                                                                                       //
        if (defaultStats) {                                                                                            // 25
            return defaultStats;                                                                                       // 26
        }                                                                                                              // 27
                                                                                                                       //
        console.log('OH NO! NO DEFAULT STATS');                                                                        // 28
        return DEFAULT_STATS;                                                                                          // 29
    },                                                                                                                 // 30
    // Given an object of filters, get counts for all of the elements NOT filtered                                     // 32
    //                                                                                                                 // 33
    // @param filters Object with shape {                                                                              // 34
    //      filter1: [],                                                                                               // 35
    //      filter2: [].                                                                                               // 36
    //      ...                                                                                                        // 37
    // }                                                                                                               // 38
    // @return Object with shape {                                                                                     // 39
    //      Area1: {                                                                                                   // 40
    //          Element1: 123,                                                                                         // 41
    //          Element2: 234,                                                                                         // 42
    //          ...                                                                                                    // 43
    //      },                                                                                                         // 44
    //      Area2: {                                                                                                   // 45
    //          Element3: 345,                                                                                         // 46
    //          Element4: 456,                                                                                         // 47
    //          ...                                                                                                    // 48
    //      },                                                                                                         // 49
    //      ...                                                                                                        // 50
    // }                                                                                                               // 51
    getStats: function (filters) {                                                                                     // 52
        // See if we have stats logged for the given filters and return them if we do                                  // 54
        var thisWeek = new Date(); // Current Date                                                                     // 55
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 56
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 57
            date: {                                                                                                    // 57
                $gt: thisWeek                                                                                          // 57
            }                                                                                                          // 57
        }, filters)).fetch();                                                                                          // 57
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 58
            console.log('Found existing stats');                                                                       // 59
            return existingStats[0].stats;                                                                             // 60
        } // Make the SQL Query to get the required stats                                                              // 61
                                                                                                                       //
                                                                                                                       //
        var stats = heyLookAnotherStatsMethodTakesInFiltersOutputsStatsBlock(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 67
            Stats.upsert((0, _extends3.default)({}, filters), (0, _extends3.default)({                                 // 68
                date: new Date(),                                                                                      // 69
                stats: stats                                                                                           // 70
            }, filters));                                                                                              // 68
        }, 0);                                                                                                         // 73
        return stats;                                                                                                  // 74
    }                                                                                                                  // 75
}); // // Given an object which is a SQL response, turn it into a stats Object                                         // 21
// //                                                                                                                  // 80
// // @param filters Object with shape {                                                                               // 81
// //      element1: 123,                                                                                              // 82
// //      element2: 234,                                                                                              // 83
// //      element3: 345,                                                                                              // 84
// //      ...                                                                                                         // 85
// //  }                                                                                                               // 86
// // @return Object with shape {                                                                                      // 87
// //      Area1: {                                                                                                    // 88
// //          Element1: 123,                                                                                          // 89
// //          Element2: 234,                                                                                          // 90
// //          ...                                                                                                     // 91
// //      },                                                                                                          // 92
// //      Area2: {                                                                                                    // 93
// //          Element3: 345,                                                                                          // 94
// //          Element4: 456,                                                                                          // 95
// //          ...                                                                                                     // 96
// //      },                                                                                                          // 97
// //      ...                                                                                                         // 98
// // }                                                                                                                // 99
// const turnSQLIntoStatsBlock = (SQLRes) => {                                                                         // 100
//     const statsBlock = {};                                                                                          // 101
//     Object.keys(SQLRes).forEach((k) => {                                                                            // 102
//         if (!statsBlock[reverseLookupMap[k]]) {                                                                     // 103
//             statsBlock[reverseLookupMap[k]] = {};                                                                   // 104
//         }                                                                                                           // 105
//         statsBlock[reverseLookupMap[k]][k] = SQLRes[k];                                                             // 106
//     });                                                                                                             // 107
//     statsBlock.companyCount = SQLRes.companyCount;                                                                  // 108
//     statsBlock.contactCount = SQLRes.contactCount;                                                                  // 109
//     return statsBlock;                                                                                              // 110
// };                                                                                                                  // 111
// const reverseLookupMap = {                                                                                          // 112
//     contactCount: 'contactCount',                                                                                   // 113
//     companyCount: 'companyCount',                                                                                   // 114
//     Efficiency: 'Segments',                                                                                         // 115
//     Transitional: 'Segments',                                                                                       // 116
//     Training: 'Segments',                                                                                           // 117
//     Agility: 'Segments',                                                                                            // 118
//     Accelerate: 'Segments',                                                                                         // 119
//     Integrate: 'Segments',                                                                                          // 120
//     NA: 'SuperRegions',                                                                                             // 121
//     APAC: 'SuperRegions',                                                                                           // 122
//     EMEA: 'SuperRegions',                                                                                           // 123
//     LATAM: 'SuperRegions',                                                                                          // 124
//     ITManager: 'Persona',                                                                                           // 125
//     LeadDeveloper: 'Persona',                                                                                       // 126
//     ITExecutive: 'Persona',                                                                                         // 127
//     BusinessAnalyst: 'Persona',                                                                                     // 128
//     SystemAdministrator: 'Persona',                                                                                 // 129
//     Architect: 'Persona',                                                                                           // 130
//     Finance: 'Industry',                                                                                            // 131
//     Manufacturing: 'Industry',                                                                                      // 132
//     Telecommunications: 'Industry',                                                                                 // 133
//     MediaAndInternet: 'Industry',                                                                                   // 134
//     Healthcare: 'Industry',                                                                                         // 135
//     Education: 'Industry',                                                                                          // 136
//     Government: 'Industry',                                                                                         // 137
//     Enterprise: 'CompanySize',                                                                                      // 138
//     SmallBusiness: 'CompanySize',                                                                                   // 139
//     MidMarketEnterprise: 'CompanySize',                                                                             // 140
//     MediumBusiness: 'CompanySize',                                                                                  // 141
//     Inactive: 'EngagementStatus',                                                                                   // 142
//     MostActive: 'EngagementStatus',                                                                                 // 143
//     Lapsed: 'EngagementStatus',                                                                                     // 144
//     Lapsing: 'EngagementStatus',                                                                                    // 145
//     Invalid: 'EngagementStatus',                                                                                    // 146
//     RHEL: 'InstalledTechnologies',                                                                                  // 147
//     Red_Hat_Satellite: 'InstalledTechnologies',                                                                     // 148
//     Enterprise_Application_Platform: 'InstalledTechnologies',                                                       // 149
//     RHEV: 'InstalledTechnologies',                                                                                  // 150
//     OpenStack: 'InstalledTechnologies',                                                                             // 151
//     CloudForms: 'InstalledTechnologies'                                                                             // 152
// };                                                                                                                  // 153
//                                                                                                                     // 154
//                                                                                                                     // 155
// // Given an object of filters, build a SQL Query                                                                    // 156
// //                                                                                                                  // 157
// // @param filters Object with shape {                                                                               // 158
// //      filter1: [],                                                                                                // 159
// //      filter2: [].                                                                                                // 160
// //      ...                                                                                                         // 161
// //  }                                                                                                               // 162
// // @return String SQL Query to get counts                                                                           // 163
// const turnFiltersIntoStatsBlock = (filters) => {                                                                    // 164
//     //@TODO cache SQLQuery                                                                                          // 165
//     const thingsToCount = [];                                                                                       // 166
//     const namesOfThingsToCount = [];                                                                                // 167
//     const whereClauses = [];                                                                                        // 168
//     const tempTableName = `leia_tmp_${Date.now()}`;                                                                 // 169
//     sectionsToCount.forEach((val) => {                                                                              // 170
//         if (filters[val] && filters[val].length) {                                                                  // 171
//             whereClauses.push(WHERE_STRING_FUNCTIONS[val](filters[val]))                                            // 172
//         } else {                                                                                                    // 173
//             namesOfThingsToCount.push(val);                                                                         // 174
//             thingsToCount.push(STATS_COUNT_STRINGS[val](tempTableName));                                            // 175
//         }                                                                                                           // 176
//     });                                                                                                             // 177
//     if (filters.Companies && filters.Companies.length) {                                                            // 178
//         whereClauses.push(WHERE_STRING_FUNCTIONS.Companies(filters.Companies))                                      // 179
//     }                                                                                                               // 180
//     const sql = `CREATE TEMPORARY TABLE ${tempTableName} AS (SELECT * FROM temp_contacts WHERE ${whereClauses.join(' AND ') || '1=1'}); ${thingsToCount.join('; ')}`;
//     console.log(sql);                                                                                               // 182
//     const query = getQueryPromise();                                                                                // 183
//     const res = query(sql).await();                                                                                 // 184
//     console.log(res);                                                                                               // 185
//     // const res = MOCK_RES;                                                                                        // 186
//     return turnResesIntoStatsBlock(res, namesOfThingsToCount);                                                      // 187
// };                                                                                                                  // 188
//                                                                                                                     // 189
//                                                                                                                     // 190
// // Looks like [                                                                                                     // 191
// //                 [                                                                                                // 192
// //                    { Size: mid, Count: 123 },                                                                    // 193
// //                      {Size: large, Count: 123 }                                                                  // 194
// //                 ],                                                                                               // 195
// const turnResesIntoStatsBlock = (res, namesOfThingsToCount) => {                                                    // 196
//     const statsBlock = {};                                                                                          // 197
//     for (let i = 0; i < namesOfThingsToCount.length; i++) {                                                         // 198
//         const thisRes = res[i + 2];                                                                                 // 199
//         const name = namesOfThingsToCount[i];                                                                       // 200
//         statsBlock[name] = STATS_BUILDING_FUNCTIONS[name](thisRes, name);                                           // 201
//     }                                                                                                               // 202
//     statsBlock.companyCount = statsBlock.Count.companyCount;                                                        // 203
//     statsBlock.contactCount = statsBlock.Count.contactCount;                                                        // 204
//     const CompaniesRes = res[1];                                                                                    // 205
//     console.log('CompaniesRes', CompaniesRes);                                                                      // 206
//     statsBlock.Companies = STATS_BUILDING_FUNCTIONS.Companies(CompaniesRes);                                        // 207
//     console.log('******');                                                                                          // 208
//     console.log(statsBlock);                                                                                        // 209
//     return statsBlock;                                                                                              // 210
// };                                                                                                                  // 211
//                                                                                                                     // 212
// const alreadyGood = res => res[0];                                                                                  // 213
// const getNamedRes = (res, name) => {                                                                                // 214
//     // CompanySize has a database name of 'Size'                                                                    // 215
//     // @todo separate display names and database names                                                              // 216
//     const thisName = name == 'CompanySize' ? 'Size' : name;                                                         // 217
//     const returnObject = {};                                                                                        // 218
//     console.log(res);                                                                                               // 219
//     res.forEach(row => {                                                                                            // 220
//         const thisRowVal = row[thisName];                                                                           // 221
//         console.log(thisRowVal);                                                                                    // 222
//         const namedVal = DBtoNameMap[name][thisRowVal] || console.log('Could Not Get Value for', name, thisRowVal);
//         console.log(namedVal);                                                                                      // 224
//         returnObject[namedVal] = row.Count;                                                                         // 225
//     });                                                                                                             // 226
//     return returnObject;                                                                                            // 227
// };                                                                                                                  // 228
// //                                                                                                                  // 229
// // [{Company: c}, ...                                                                                               // 230
// const buildCompanies = (res) => res.map(holder => holder.Company);                                                  // 231
// const STATS_BUILDING_FUNCTIONS = {                                                                                  // 232
//     Count: alreadyGood,                                                                                             // 233
//     Segments: alreadyGood,                                                                                          // 234
//     Companies: buildCompanies,                                                                                      // 235
//     InstalledTechnologies: alreadyGood,                                                                             // 236
//     SuperRegions: getNamedRes,                                                                                      // 237
//     Persona: getNamedRes,                                                                                           // 238
//     Industry: getNamedRes,                                                                                          // 239
//     CompanySize: getNamedRes,                                                                                       // 240
//     EngagementStatus: getNamedRes                                                                                   // 241
// };                                                                                                                  // 242
//                                                                                                                     // 243
// const sectionsToCount = ['Count', 'Segments', 'InstalledTechnologies', 'SuperRegions', 'Persona', 'Industry', 'CompanySize', 'EngagementStatus'];
// const STATS_COUNT_STRINGS = {                                                                                       // 245
//     Count: (tmp) => `SELECT Company, Count(*) as c FROM ${tmp} GROUP BY Company ORDER BY c DESC LIMIT 10; SELECT COUNT(*) as contactCount, COUNT(DISTINCT Company) as companyCount FROM ${tmp}`,
//     Segments: (tmp) => `SELECT COUNT(ITWOB_Efficiency=TRUE) AS Efficiency, COUNT(ITWOB_Transitional=TRUE) AS Transitional, COUNT(ITWOB_Agility=TRUE) AS Agility, COUNT(Training=TRUE) AS Training, COUNT(ModAppDev_Accelerate=TRUE) AS Accelerate, COUNT(ModAppDev_Integrate=TRUE) AS Integrate FROM ${tmp}`,
//     InstalledTechnologies: (tmp) => `SELECT COUNT(RHEL=TRUE) AS RHEL, COUNT(Red_Hat_Satellite=TRUE) AS Red_Hat_Satellite, COUNT(Enterprise_Application_Platform=TRUE) AS Enterprise_Application_Platform, COUNT(RHEV=TRUE) AS RHEV, COUNT(OpenStack=TRUE) AS OpenStack, COUNT(CloudForms=TRUE) AS CloudForms FROM ${tmp}`,
//     SuperRegions: (tmp) => `SELECT COUNT(*) AS Count, SuperRegion AS SuperRegions FROM ${tmp} GROUP BY SuperRegions`,
//     Persona: (tmp) => `SELECT COUNT(*) AS Count, Persona FROM ${tmp} GROUP BY Persona`,                             // 250
//     Industry: (tmp) => `SELECT COUNT(*) AS Count, Industry FROM ${tmp} GROUP BY Industry`,                          // 251
//     CompanySize: (tmp) => `SELECT COUNT(*) AS Count, Size FROM ${tmp} GROUP BY Size`,                               // 252
//     EngagementStatus: (tmp) => `SELECT COUNT(*) AS Count, EngagementStatus FROM ${tmp} GROUP BY EngagementStatus`   // 253
// };                                                                                                                  // 254
// const WHERE_STRING_FUNCTIONS = {                                                                                    // 255
//     Companies: (arr) => `Company IN (${arr.map(sqlstring.escape).join(',')})`,                                      // 256
//     Segments: (arr) => ` (${arr.map(val => `${THEME_MAP[val]}=TRUE`).join(' OR ')}) `,                              // 257
//     SuperRegions: (arr) => `SuperRegion IN (${arr.map(val => NameToDBMap['SuperRegions'][val]).join(',')})`,        // 258
//     Persona: (arr) => `Persona IN (${arr.map(val => NameToDBMap['Persona'][val]).join(',')})`,                      // 259
//     Industry: (arr) => `Industry IN (${arr.map(val => NameToDBMap['Industry'][val]).join(',')})`,                   // 260
//     CompanySize: (arr) => `Size IN (${arr.map(val => NameToDBMap['CompanySize'][val]).join(',')})`,                 // 261
//     EngagementStatus: (arr) => `EngagementStatus IN (${arr.map(val => NameToDBMap['EngagementStatus'][val]).join(',')})`,
//     InstalledTechnologies: (arr) => ` (${arr.map(val => `${val}=TRUE`).join(' OR ')}) `                             // 263
// };                                                                                                                  // 264
// const THEME_MAP = {                                                                                                 // 265
//     Agility: 'ITWOB_Agility',                                                                                       // 266
//     Efficiency: 'ITWOB_Efficiency',                                                                                 // 267
//     Transitional: 'ITWOB_Transitional'                                                                              // 268
// };                                                                                                                  // 269
//                                                                                                                     // 270
// const DBtoNameMap = {                                                                                               // 271
//     SuperRegions: {                                                                                                 // 272
//         1: 'NA',                                                                                                    // 273
//         2: 'LATAM',                                                                                                 // 274
//         3: 'EMEA',                                                                                                  // 275
//         4: 'APAC'                                                                                                   // 276
//     },                                                                                                              // 277
//     Persona: {                                                                                                      // 278
//         1: 'IT Manager',                                                                                            // 279
//         2: 'Other',                                                                                                 // 280
//         3: 'Lead Developer',                                                                                        // 281
//         4: 'IT Executive',                                                                                          // 282
//         5: 'Business Analyst',                                                                                      // 283
//         6: 'System Administrator',                                                                                  // 284
//         7: 'Architect',                                                                                             // 285
//         8: 'IT Decision Maker'                                                                                      // 286
//     },                                                                                                              // 287
//     Industry: {                                                                                                     // 288
//         20: "Business Services",                                                                                    // 289
//         21: "Manufacturing",                                                                                        // 290
//         22: "Finance",                                                                                              // 291
//         23: "Telecommunications",                                                                                   // 292
//         24: "Media & Internet",                                                                                     // 293
//         25: "Retail",                                                                                               // 294
//         26: "Other",                                                                                                // 295
//         27: "Software",                                                                                             // 296
//         28: "Healthcare ",                                                                                          // 297
//         29: "Education",                                                                                            // 298
//         30: "Government",                                                                                           // 299
//         31: "Energy, Raw Materials & Utilities",                                                                    // 300
//         32: "Construction & Real Estate",                                                                           // 301
//         33: "Transportation",                                                                                       // 302
//         34: "Leisure & Hospitality",                                                                                // 303
//         35: "Non-Profit & Professional Orgs.",                                                                      // 304
//         36: "Agriculture ",                                                                                         // 305
//         37: "Libraries",                                                                                            // 306
//         38: "Wholesale Trade"                                                                                       // 307
//                                                                                                                     // 308
//     },                                                                                                              // 309
//     CompanySize: {                                                                                                  // 310
//         1: "Enterprise",                                                                                            // 311
//         2: "Mid-Market Enterprise",                                                                                 // 312
//         3: "Medium Business",                                                                                       // 313
//         4: "Small Business"                                                                                         // 314
//     },                                                                                                              // 315
//     EngagementStatus: {                                                                                             // 316
//         1: "Inactive",                                                                                              // 317
//         2: "Lapsed",                                                                                                // 318
//         3: "Most Active",                                                                                           // 319
//         4: "Lapsing",                                                                                               // 320
//         5: "Invalid",                                                                                               // 321
//         6: "Internal"                                                                                               // 322
//     }                                                                                                               // 323
// };                                                                                                                  // 324
// const NameToDBMap = {                                                                                               // 325
//     SuperRegions: {                                                                                                 // 326
//         'NA': 1,                                                                                                    // 327
//         'LATAM': 2,                                                                                                 // 328
//         'EMEA': 3,                                                                                                  // 329
//         'APAC': 4                                                                                                   // 330
//     },                                                                                                              // 331
//     Persona: {                                                                                                      // 332
//         'IT Manager': 1,                                                                                            // 333
//         'Other': 2,                                                                                                 // 334
//         'Lead Developer': 3,                                                                                        // 335
//         'IT Executive': 4,                                                                                          // 336
//         'Business Analyst': 5,                                                                                      // 337
//         'System Administrator': 6,                                                                                  // 338
//         'Architect': 7,                                                                                             // 339
//         'IT Decision Maker': 8                                                                                      // 340
//     },                                                                                                              // 341
//     Industry: {                                                                                                     // 342
//         "Business Services": 20,                                                                                    // 343
//         "Manufacturing": 21,                                                                                        // 344
//         "Finance": 22,                                                                                              // 345
//         "Telecommunications": 23,                                                                                   // 346
//         "Media & Internet": 24,                                                                                     // 347
//         "Retail": 25,                                                                                               // 348
//         "Other": 26,                                                                                                // 349
//         "Software": 27,                                                                                             // 350
//         "Healthcare ": 28,                                                                                          // 351
//         "Education": 29,                                                                                            // 352
//         "Government": 30,                                                                                           // 353
//         "Energy, Raw Materials & Utilities": 31,                                                                    // 354
//         "Construction & Real Estate": 32,                                                                           // 355
//         "Transportation": 33,                                                                                       // 356
//         "Leisure & Hospitality": 34,                                                                                // 357
//         "Non-Profit & Professional Orgs.": 35,                                                                      // 358
//         "Agriculture ": 36,                                                                                         // 359
//         "Libraries": 37,                                                                                            // 360
//         "Wholesale Trade": 38                                                                                       // 361
//                                                                                                                     // 362
//     },                                                                                                              // 363
//     CompanySize: {                                                                                                  // 364
//         "Enterprise": 1,                                                                                            // 365
//         "Mid-Market Enterprise": 2,                                                                                 // 366
//         "Medium Business": 3,                                                                                       // 367
//         "Small Business": 4                                                                                         // 368
//     },                                                                                                              // 369
//     EngagementStatus: {                                                                                             // 370
//         "Inactive": 1,                                                                                              // 371
//         "Lapsed": 2,                                                                                                // 372
//         "Most Active": 3,                                                                                           // 373
//         "Lapsing": 4,                                                                                               // 374
//         "Invalid": 5,                                                                                               // 375
//         "Internal": 6                                                                                               // 376
//     }                                                                                                               // 377
// };                                                                                                                  // 378
//                                                                                                                     // 379
// const MOCK_RES = [                                                                                                  // 380
//     {                                                                                                               // 381
//         fieldCount: 0,                                                                                              // 382
//         affectedRows: 1321579,                                                                                      // 383
//         insertId: 0,                                                                                                // 384
//         serverStatus: 2058,                                                                                         // 385
//         warningCount: 0,                                                                                            // 386
//         message: ',Records: 1321579  Duplicates: 0  Warnings: 0',                                                   // 387
//         protocol41: true,                                                                                           // 388
//         changedRows: 0                                                                                              // 389
//     },                                                                                                              // 390
//     [{ Company: 'ABC' }, { Company: 'BGK' }],                                                                       // 391
//     [{ contactCount: 1321579, companyCount: 200225 }],                                                              // 392
//     [{                                                                                                              // 393
//         Efficiency: 0,                                                                                              // 394
//         Transitional: 0,                                                                                            // 395
//         Agility: 0,                                                                                                 // 396
//         Training: 0,                                                                                                // 397
//         Accelerate: 0,                                                                                              // 398
//         Integrate: 0                                                                                                // 399
//     }],                                                                                                             // 400
//     [{                                                                                                              // 401
//         RHEL: 286050,                                                                                               // 402
//         Red_Hat_Satellite: 166385,                                                                                  // 403
//         Enterprise_Application_Platform: 95007,                                                                     // 404
//         RHEV: 30178,                                                                                                // 405
//         OpenStack: 13993,                                                                                           // 406
//         CloudForms: 7997                                                                                            // 407
//     }],                                                                                                             // 408
//     [{ Count: 435755, Persona: null },                                                                              // 409
//         { Count: 218459, Persona: 1 },                                                                              // 410
//         { Count: 225690, Persona: 2 },                                                                              // 411
//         { Count: 167705, Persona: 3 },                                                                              // 412
//         { Count: 100141, Persona: 4 },                                                                              // 413
//         { Count: 74040, Persona: 5 },                                                                               // 414
//         { Count: 52140, Persona: 6 },                                                                               // 415
//         { Count: 47648, Persona: 7 },                                                                               // 416
//         { Count: 1, Persona: 8 }],                                                                                  // 417
//     [{ Count: 321192, Industry: null },                                                                             // 418
//         { Count: 151694, Industry: 20 },                                                                            // 419
//         { Count: 151833, Industry: 21 },                                                                            // 420
//         { Count: 144385, Industry: 22 },                                                                            // 421
//         { Count: 81059, Industry: 23 },                                                                             // 422
//         { Count: 40943, Industry: 24 },                                                                             // 423
//         { Count: 88061, Industry: 25 },                                                                             // 424
//         { Count: 49000, Industry: 26 },                                                                             // 425
//         { Count: 52760, Industry: 27 },                                                                             // 426
//         { Count: 53939, Industry: 28 },                                                                             // 427
//         { Count: 49375, Industry: 29 },                                                                             // 428
//         { Count: 48084, Industry: 30 },                                                                             // 429
//         { Count: 31314, Industry: 31 },                                                                             // 430
//         { Count: 21407, Industry: 32 },                                                                             // 431
//         { Count: 14549, Industry: 33 },                                                                             // 432
//         { Count: 11489, Industry: 34 },                                                                             // 433
//         { Count: 9527, Industry: 35 },                                                                              // 434
//         { Count: 34, Industry: 36 },                                                                                // 435
//         { Count: 927, Industry: 37 },                                                                               // 436
//         { Count: 7, Industry: 38 }],                                                                                // 437
//     [{ Count: 547910, Size: null },                                                                                 // 438
//         { Count: 409722, Size: 1 },                                                                                 // 439
//         { Count: 98793, Size: 2 },                                                                                  // 440
//         { Count: 73237, Size: 3 },                                                                                  // 441
//         { Count: 191917, Size: 4 }],                                                                                // 442
//     [{ Count: 839, EngagementStatus: null },                                                                        // 443
//         { Count: 822290, EngagementStatus: 1 },                                                                     // 444
//         { Count: 180192, EngagementStatus: 2 },                                                                     // 445
//         { Count: 171555, EngagementStatus: 3 },                                                                     // 446
//         { Count: 101214, EngagementStatus: 4 },                                                                     // 447
//         { Count: 39553, EngagementStatus: 5 },                                                                      // 448
//         { Count: 5936, EngagementStatus: 6 }]];                                                                     // 449
// const DEFAULT_STATS = {                                                                                             // 450
//     default: true,                                                                                                  // 451
//     date: new Date(),                                                                                               // 452
//     Count: { contactCount: 3768820, companyCount: 736823 },                                                         // 453
//     Segments: {                                                                                                     // 454
//         Efficiency: 66101,                                                                                          // 455
//         Transitional: 15472,                                                                                        // 456
//         Agility: 52780,                                                                                             // 457
//         Training: 34510,                                                                                            // 458
//         Accelerate: 54380,                                                                                          // 459
//         Integrate: 24378                                                                                            // 460
//     },                                                                                                              // 461
//     InstalledTechnologies: {                                                                                        // 462
//         RHEL: 540110,                                                                                               // 463
//         Red_Hat_Satellite: 212792,                                                                                  // 464
//         Enterprise_Application_Platform: 133732,                                                                    // 465
//         RHEV: 53146,                                                                                                // 466
//         OpenStack: 39084,                                                                                           // 467
//         CloudForms: 10691                                                                                           // 468
//     },                                                                                                              // 469
//     SuperRegions: { undefined: 8 },                                                                                 // 470
//     Persona: {                                                                                                      // 471
//         Architect: 85306,                                                                                           // 472
//         'Business Analyst': 136761,                                                                                 // 473
//         'IT Executive': 177567,                                                                                     // 474
//         'IT Manager': 415808,                                                                                       // 475
//         'Lead Developer': 342292,                                                                                   // 476
//         Other: 395879,                                                                                              // 477
//         'System Administrator': 124904,                                                                             // 478
//     },                                                                                                              // 479
//     Industry: {                                                                                                     // 480
//         Education: 67665,                                                                                           // 481
//         Finance: 187859,                                                                                            // 482
//         Government: 66187,                                                                                          // 483
//         'Healthcare ': 87858,                                                                                       // 484
//         Manufacturing: 200724,                                                                                      // 485
//         'Media & Internet': 150135,                                                                                 // 486
//     },                                                                                                              // 487
//     CompanySize: {                                                                                                  // 488
//         Enterprise: 528010,                                                                                         // 489
//         'Medium Business': 121449,                                                                                  // 490
//         'Mid-Market Enterprise': 149206,                                                                            // 491
//         'Small Business': 276430,                                                                                   // 492
//     },                                                                                                              // 493
//     EngagementStatus: {                                                                                             // 494
//         Inactive: 2258997,                                                                                          // 495
//         Internal: 16799,                                                                                            // 496
//         Invalid: 131612,                                                                                            // 497
//         Lapsed: 577054,                                                                                             // 498
//         Lapsing: 291377,                                                                                            // 499
//         'Most Activ': 492981                                                                                        // 500
//     },                                                                                                              // 501
//     companyCount: 736823,                                                                                           // 502
//     contactCount: 3768820                                                                                           // 503
// };                                                                                                                  // 504
// Given an object of filters, build a SQL Query                                                                       // 506
//                                                                                                                     // 507
// @param filters Object with shape {                                                                                  // 508
//      filter1: [],                                                                                                   // 509
//      filter2: [].                                                                                                   // 510
//      ...                                                                                                            // 511
//  }                                                                                                                  // 512
// @return String SQL Query to get counts                                                                              // 513
                                                                                                                       //
var heyLookAnotherStatsMethodTakesInFiltersOutputsStatsBlock = function (filters) {                                    // 514
    var query = getQueryPromise();                                                                                     // 515
    var sqlQuery = sqlBase + " " + getWhereClause(filters);                                                            // 516
    console.log('***** SQL *****\n', sqlQuery, '\n***** END SQL *****');                                               // 517
    var statsReturn = query(sqlBase + " " + getWhereClause(filters)).await(); // console.log('***** Return *****\n', statsReturn, '\n***** Return *****');
                                                                                                                       //
    var statsBlock = getStatsFromSQLResponse(statsReturn); // console.log('....StatsBlock.....\n', statsBlock);        // 520
                                                                                                                       //
    return statsBlock;                                                                                                 // 522
};                                                                                                                     // 523
                                                                                                                       //
var DBNameMap = {                                                                                                      // 524
    'Enterprise Application Platform': 'Enterprise_Application_Platform'                                               // 525
};                                                                                                                     // 524
var sqlBase = 'SELECT sum(count) AS count, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise_Application_Platform`) AS `Enterprise_Application_Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM contact_counts ';
                                                                                                                       //
var getWhereClause = function (filters) {                                                                              // 528
    var where = Object.keys(filters).filter(function (k) {                                                             // 529
        return filters[k].length;                                                                                      // 530
    }).map(function (k) {                                                                                              // 530
        var thisArr = filters[k];                                                                                      // 532
        return "(" + thisArr.map(function (val) {                                                                      // 533
            return DBNameMap[val] || val;                                                                              // 534
        }).map(function (val) {                                                                                        // 534
            return "`" + val + "`>0";                                                                                  // 535
        }).join(' OR ') + ")";                                                                                         // 535
    }).join(' AND ');                                                                                                  // 537
                                                                                                                       //
    if (where.length) {                                                                                                // 538
        return "WHERE " + where + ";";                                                                                 // 539
    }                                                                                                                  // 540
                                                                                                                       //
    return ';';                                                                                                        // 541
}; /**                                                                                                                 // 542
    *                                                                                                                  //
    * @param SQLRes has shape                                                                                          //
        [{                                                                                                             //
           NA: <Integer>,                                                                                              //
           LATAM: <Integer>,                                                                                           //
           EMEA: <Integer>,                                                                                            //
           APAC: <Integer>,                                                                                            //
           IT Manager: <Integer>,                                                                                      //
           Other: <Integer>,                                                                                           //
           Lead Developer: <Integer>,                                                                                  //
           IT Executive: <Integer>,                                                                                    //
           Business Analyst: <Integer>,                                                                                //
           System Administrator: <Integer>,                                                                            //
           Architect: <Integer>,                                                                                       //
           IT Decision Maker: <Integer>,                                                                               //
           Enterprise: <Integer>,                                                                                      //
           Mid-Market Enterprise: <Integer>,                                                                           //
           Medium Business: <Integer>,                                                                                 //
           Small Business: <Integer>,                                                                                  //
           Manufacturing: <Integer>,                                                                                   //
           Finance: <Integer>,                                                                                         //
           Telecommunications: <Integer>,                                                                              //
           Media & Internet: <Integer>,                                                                                //
           Healthcare: <Integer>,                                                                                      //
           Education: <Integer>,                                                                                       //
           Government: <Integer>,                                                                                      //
           Inactive: <Integer>,                                                                                        //
           Lapsed: <Integer>,                                                                                          //
           Most Active: <Integer>,                                                                                     //
           Lapsing: <Integer>,                                                                                         //
           Invalid: <Integer>,                                                                                         //
           Internal: <Integer>,                                                                                        //
           ModAppDev_Accelerate: <Integer>,                                                                            //
           ModAppDev_Integrate: <Integer>,                                                                             //
           ITWOB_Efficiency: <Integer>,                                                                                //
           ITWOB_Transitional: <Integer>,                                                                              //
           ITWOB_Agility: <Integer>,                                                                                   //
           Training: <Integer>,                                                                                        //
           RHEL: <Integer>,                                                                                            //
           Satellite: <Integer>,                                                                                       //
           RHEV: <Integer>,                                                                                            //
           Enterprise_Application_Platform: <Integer>,                                                                 //
           OpenStack: <Integer>,                                                                                       //
           CloudForms: <Integer>                                                                                       //
       }]                                                                                                              //
    *                                                                                                                  //
    * @return Object with shapeObject with shape                                                                       //
    {                                                                                                                  //
        Area1: {                                                                                                       //
            Element1: 123,                                                                                             //
            Element2: 234,                                                                                             //
            ...                                                                                                        //
        },                                                                                                             //
        Area2: {                                                                                                       //
            Element3: 345,                                                                                             //
            Element4: 456,                                                                                             //
            ...                                                                                                        //
        },                                                                                                             //
        ...                                                                                                            //
   }                                                                                                                   //
    */                                                                                                                 //
                                                                                                                       //
var getStatsFromSQLResponse = function (SQLRes) {                                                                      // 605
    if (SQLRes.length !== 1) {                                                                                         // 606
        console.log('SQLRes should have one row', SQLRes);                                                             // 607
    }                                                                                                                  // 608
                                                                                                                       //
    var thisRes = SQLRes[0];                                                                                           // 609
    return {                                                                                                           // 610
        contactCount: thisRes.count,                                                                                   // 611
        companyCount: thisRes.companies,                                                                               // 612
        'Super Regions': {                                                                                             // 613
            'NA': thisRes['NA'],                                                                                       // 614
            'LATAM': thisRes['LATAM'],                                                                                 // 615
            'EMEA': thisRes['EMEA'],                                                                                   // 616
            'APAC': thisRes['APAC']                                                                                    // 617
        },                                                                                                             // 613
        Persona: {                                                                                                     // 619
            'IT Manager': thisRes['IT Manager'],                                                                       // 620
            'Other': thisRes['Other'],                                                                                 // 621
            'Lead Developer': thisRes['Lead Developer'],                                                               // 622
            'IT Executive': thisRes['IT Executive'],                                                                   // 623
            'Business Analyst': thisRes['Business Analyst'],                                                           // 624
            'System Administrator': thisRes['System Administrator'],                                                   // 625
            'Architect': thisRes['Architect'],                                                                         // 626
            'IT Decision Maker': thisRes['IT Decision Maker']                                                          // 627
        },                                                                                                             // 619
        'Company Size': {                                                                                              // 629
            'Enterprise': thisRes['Enterprise'],                                                                       // 630
            'Mid-Market Enterprise': thisRes['Mid-Market Enterprise'],                                                 // 631
            'Medium Business': thisRes['Medium Business'],                                                             // 632
            'Small Business': thisRes['Small Business']                                                                // 633
        },                                                                                                             // 629
        Industry: {                                                                                                    // 635
            'Manufacturing': thisRes['Manufacturing'],                                                                 // 636
            'Finance': thisRes['Finance'],                                                                             // 637
            'Telecommunications': thisRes['Telecommunications'],                                                       // 638
            'Media & Internet': thisRes['Media & Internet'],                                                           // 639
            'Healthcare': thisRes['Healthcare'],                                                                       // 640
            'Education': thisRes['Education'],                                                                         // 641
            'Government': thisRes['Government']                                                                        // 642
        },                                                                                                             // 635
        'Engagement Status': {                                                                                         // 644
            'Inactive': thisRes['Inactive'],                                                                           // 645
            'Lapsed': thisRes['Lapsed'],                                                                               // 646
            'Most Active': thisRes['Most Active'],                                                                     // 647
            'Lapsing': thisRes['Lapsing'],                                                                             // 648
            'Invalid': thisRes['Invalid'],                                                                             // 649
            'Internal': thisRes['Internal']                                                                            // 650
        },                                                                                                             // 644
        Programs: {                                                                                                    // 652
            'Accelerate': thisRes['Accelerate'],                                                                       // 653
            'Integrate': thisRes['Integrate'],                                                                         // 654
            'Efficiency': thisRes['Efficiency'],                                                                       // 655
            'Transitional': thisRes['Transitional'],                                                                   // 656
            'Agility': thisRes['Agility'],                                                                             // 657
            'Training': thisRes['Training']                                                                            // 658
        },                                                                                                             // 652
        'Installed Technologies': {                                                                                    // 660
            'RHEL': thisRes['RHEL'],                                                                                   // 661
            'Satellite': thisRes['Satellite'],                                                                         // 662
            'RHEV': thisRes['RHEV'],                                                                                   // 663
            'Enterprise_Application_Platform': thisRes['Enterprise_Application_Platform'],                             // 664
            'OpenStack': thisRes['OpenStack'],                                                                         // 665
            'CloudForms': thisRes['CloudForms']                                                                        // 666
        }                                                                                                              // 660
    };                                                                                                                 // 610
};                                                                                                                     // 669
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"main.js":["meteor/meteor","./getEloquaData.js","../imports/collections.js","meteor/nimble:restivus","../imports/helpers/stats.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  updateSegmentList: function () {                                                                                     // 1
    return updateSegmentList;                                                                                          // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var Meteor = void 0;                                                                                                   // 1
module.import('meteor/meteor', {                                                                                       // 1
  "Meteor": function (v) {                                                                                             // 1
    Meteor = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var getEloquaDataPromise = void 0,                                                                                     // 1
    getEloquaDataResults = void 0,                                                                                     // 1
    getOneEloquaPage = void 0,                                                                                         // 1
    SEGMENTS_URL = void 0,                                                                                             // 1
    CONTACTS_URL = void 0;                                                                                             // 1
module.import('./getEloquaData.js', {                                                                                  // 1
  "getEloquaDataPromise": function (v) {                                                                               // 1
    getEloquaDataPromise = v;                                                                                          // 1
  },                                                                                                                   // 1
  "getEloquaDataResults": function (v) {                                                                               // 1
    getEloquaDataResults = v;                                                                                          // 1
  },                                                                                                                   // 1
  "getOneEloquaPage": function (v) {                                                                                   // 1
    getOneEloquaPage = v;                                                                                              // 1
  },                                                                                                                   // 1
  "SEGMENTS_URL": function (v) {                                                                                       // 1
    SEGMENTS_URL = v;                                                                                                  // 1
  },                                                                                                                   // 1
  "CONTACTS_URL": function (v) {                                                                                       // 1
    CONTACTS_URL = v;                                                                                                  // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Segments = void 0,                                                                                                 // 1
    EloquaLogs = void 0,                                                                                               // 1
    Logs = void 0;                                                                                                     // 1
module.import('../imports/collections.js', {                                                                           // 1
  "Segments": function (v) {                                                                                           // 1
    Segments = v;                                                                                                      // 1
  },                                                                                                                   // 1
  "EloquaLogs": function (v) {                                                                                         // 1
    EloquaLogs = v;                                                                                                    // 1
  },                                                                                                                   // 1
  "Logs": function (v) {                                                                                               // 1
    Logs = v;                                                                                                          // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var Restivus = void 0;                                                                                                 // 1
module.import('meteor/nimble:restivus', {                                                                              // 1
  "Restivus": function (v) {                                                                                           // 1
    Restivus = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var accumulateStats = void 0;                                                                                          // 1
module.import('../imports/helpers/stats.js', {                                                                         // 1
  "accumulateStats": function (v) {                                                                                    // 1
    accumulateStats = v;                                                                                               // 1
  }                                                                                                                    // 1
}, 4);                                                                                                                 // 1
// Take an Eloqua response and insert the elements into the Segments collection                                        // 7
// Use with getEloquaResponse                                                                                          // 8
var insertSegments = Meteor.bindEnvironment(function (body) {                                                          // 9
  for (var _iterator = body.elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;                                                                                                          // 10
                                                                                                                       //
    if (_isArray) {                                                                                                    // 10
      if (_i >= _iterator.length) break;                                                                               // 10
      _ref = _iterator[_i++];                                                                                          // 10
    } else {                                                                                                           // 10
      _i = _iterator.next();                                                                                           // 10
      if (_i.done) break;                                                                                              // 10
      _ref = _i.value;                                                                                                 // 10
    }                                                                                                                  // 10
                                                                                                                       //
    var obj = _ref;                                                                                                    // 10
    Segments.upsert({                                                                                                  // 11
      _id: obj.id                                                                                                      // 11
    }, {                                                                                                               // 11
      $set: {                                                                                                          // 11
        _id: obj.id,                                                                                                   // 11
        name: obj.name                                                                                                 // 11
      }                                                                                                                // 11
    });                                                                                                                // 11
  }                                                                                                                    // 12
}); // Called Daily to upsert new segment IDs                                                                          // 13
                                                                                                                       //
var updateSegmentList = Meteor.bindEnvironment(function () {                                                           // 17
  getEloquaDataPromise(SEGMENTS_URL, insertSegments).await();                                                          // 18
});                                                                                                                    // 19
///////////////                                                                                                        // 21
//                                                                                                                     // 22
// Meteor Startup code                                                                                                 // 23
//                                                                                                                     // 24
///////////////                                                                                                        // 25
Meteor.startup(function () {                                                                                           // 26
  if (Segments.find().count() === 0) {                                                                                 // 27
    // Populate the server with data if it is currently empty.                                                         // 27
    console.log('Populating Segments');                                                                                // 28
                                                                                                                       //
    Segments._ensureIndex({                                                                                            // 29
      name: 1                                                                                                          // 29
    });                                                                                                                // 29
                                                                                                                       //
    updateSegmentList();                                                                                               // 30
  }                                                                                                                    // 31
                                                                                                                       //
  var updateSegmentsEveryMorning = new Cron(updateSegmentList, {                                                       // 32
    minute: 0,                                                                                                         // 32
    hour: 1                                                                                                            // 32
  });                                                                                                                  // 32
}); ////////////////                                                                                                   // 33
//                                                                                                                     // 36
// Meteor.Methods here                                                                                                 // 37
//                                                                                                                     // 38
////////////////                                                                                                       // 39
                                                                                                                       //
Meteor.methods({                                                                                                       // 40
  //Get a segment's contacts and accumulate stats                                                                      // 42
  getSegmentStatsByName: function (name) {                                                                             // 43
    //Log lookup                                                                                                       // 44
    Logs.insert({                                                                                                      // 45
      type: 'Lookup',                                                                                                  // 46
      input: name,                                                                                                     // 47
      records: 1,                                                                                                      // 48
      date: new Date()                                                                                                 // 49
    }); //If we have the stats of the segment cached, return the existing results.                                     // 45
                                                                                                                       //
    var segment = Segments.findOne({                                                                                   // 52
      name: name                                                                                                       // 52
    });                                                                                                                // 52
                                                                                                                       //
    if (!segment) {                                                                                                    // 53
      throw new Meteor.Error("Could Not Find Segment Name: " + name);                                                  // 54
    }                                                                                                                  // 55
                                                                                                                       //
    if (segment.stats) {                                                                                               // 56
      return segment;                                                                                                  // 57
    }                                                                                                                  // 58
                                                                                                                       //
    console.log(segment); // Otherwise start to build and then return the stats                                        // 59
                                                                                                                       //
    return Meteor.call('getSegmentStats', segment);                                                                    // 61
  },                                                                                                                   // 62
  getSegmentStats: function (segment) {                                                                                // 64
    var firstPage = getOneEloquaPage(segment['_id']).await();                                                          // 65
    segment.total = firstPage.total;                                                                                   // 66
    segment.stats = accumulateStats(firstPage.elements, 'eloqua', null);                                               // 67
                                                                                                                       //
    if (firstPage.total > 1000) {                                                                                      // 68
      var N = Math.ceil((firstPage.total - 1) / 1000);                                                                 // 70
      var promArray = [];                                                                                              // 71
                                                                                                                       //
      for (var i = 2; i <= N; i++) {                                                                                   // 72
        promArray.push(getOneEloquaPage(segment['_id'], i).then(function (res) {                                       // 73
          return accumulateStats(res.elements, 'eloqua', segment.stats);                                               // 73
        }));                                                                                                           // 73
      }                                                                                                                // 74
                                                                                                                       //
      Promise.all(promArray).await();                                                                                  // 75
    } // Update the Cache                                                                                              // 76
                                                                                                                       //
                                                                                                                       //
    segment.lastRefreshed = new Date();                                                                                // 78
    segment.dataSample = firstPage.elements.slice(0, 40).map(function (row) {                                          // 79
      return {                                                                                                         // 79
        first: row.C_FirstName,                                                                                        // 80
        last: row.C_LastName,                                                                                          // 81
        email: row.C_EmailAddress.replace(/.*@/, '***@')                                                               // 82
      };                                                                                                               // 79
    });                                                                                                                // 79
    Segments.update({                                                                                                  // 84
      '_id': segment['_id']                                                                                            // 84
    }, segment);                                                                                                       // 84
    return segment;                                                                                                    // 85
  }                                                                                                                    // 86
}); /////////////                                                                                                      // 40
//                                                                                                                     // 93
// Rest API starts here                                                                                                // 94
//                                                                                                                     // 95
/////////////                                                                                                          // 96
                                                                                                                       //
var RESTAPI = new Restivus({                                                                                           // 97
  apiPath: 'ws',                                                                                                       // 98
  defaultHeaders: {                                                                                                    // 99
    'Content-Type': 'application/json'                                                                                 // 100
  },                                                                                                                   // 99
  prettyJson: true                                                                                                     // 102
}); // ADMIN UTILITY to refresh data                                                                                   // 97
//https://...com/ws/refresh                                                                                            // 106
// Use Eloqua Credentials in header                                                                                    // 107
                                                                                                                       //
RESTAPI.addRoute('refresh', {                                                                                          // 108
  post: function () {                                                                                                  // 109
    if (this.request.headers.authorization === process.env.AUTHORIZATION) {                                            // 110
      console.log('Well Authorized, good sirs! Refreshing Data!');                                                     // 111
      updateSegmentList();                                                                                             // 112
      return {                                                                                                         // 113
        statusCode: 200,                                                                                               // 114
        body: 'Success!'                                                                                               // 115
      };                                                                                                               // 113
    } else {                                                                                                           // 117
      console.log('/ws/refresh was activated but the authorization was incorrect');                                    // 118
      console.log(this.request.headers.authorization);                                                                 // 119
      console.log(process.env.AUTHORIZATION);                                                                          // 120
      return {                                                                                                         // 121
        statusCode: 401                                                                                                // 121
      };                                                                                                               // 121
    }                                                                                                                  // 122
  }                                                                                                                    // 123
}); //http:/...com/ws/eloquaCallsInLastNDays/:days                                                                     // 108
                                                                                                                       //
RESTAPI.addRoute('eloquaCallsInLastNDays/:days', {                                                                     // 127
  get: function () {                                                                                                   // 128
    var startDate = new Date(); // Current Date                                                                        // 129
                                                                                                                       //
    var days = this.urlParams.days;                                                                                    // 130
    startDate.setDate(startDate.getDate() - days); // Subtract N Days                                                  // 131
                                                                                                                       //
    startDate.setHours(0); // Set the hour, minute and second components to 0                                          // 132
                                                                                                                       //
    startDate.setMinutes(0);                                                                                           // 133
    startDate.setSeconds(0);                                                                                           // 134
    var count = EloquaLogs.find({                                                                                      // 135
      date: {                                                                                                          // 135
        $gte: startDate                                                                                                // 135
      }                                                                                                                // 135
    }).map(function (doc) {                                                                                            // 135
      return Math.ceil(doc.numPagesToGet);                                                                             // 135
    }).reduce(function (a, b) {                                                                                        // 135
      return a + b;                                                                                                    // 135
    }, 0);                                                                                                             // 135
    return {                                                                                                           // 136
      days: days,                                                                                                      // 136
      count: count                                                                                                     // 136
    };                                                                                                                 // 136
  }                                                                                                                    // 137
}); // http://...com/ws/PathCodes                                                                                      // 127
// http://...com/ws/PathCodes/:id                                                                                      // 141
                                                                                                                       //
RESTAPI.addCollection(Segments, {                                                                                      // 142
  excludedEndpoints: ['post', 'put', 'delete']                                                                         // 143
});                                                                                                                    // 142
RESTAPI.addCollection(EloquaLogs, {                                                                                    // 146
  excludedEndpoints: ['post', 'put', 'delete']                                                                         // 147
}); // Get a report of contacts looked up                                                                              // 146
                                                                                                                       //
RESTAPI.addRoute('usageReport', {                                                                                      // 151
  get: function () {                                                                                                   // 152
    var oneDay = new Date(); // Current Date                                                                           // 153
                                                                                                                       //
    oneDay.setDate(oneDay.getDate() - 1); // Subtract N Days                                                           // 154
                                                                                                                       //
    var sevenDays = new Date(); // Current Date                                                                        // 155
                                                                                                                       //
    sevenDays.setDate(sevenDays.getDate() - 7); // Subtract N Days                                                     // 156
                                                                                                                       //
    var fourteenDays = new Date(); // Current Date                                                                     // 157
                                                                                                                       //
    fourteenDays.setDate(fourteenDays.getDate() - 14); // Subtract N Days                                              // 158
                                                                                                                       //
    var thirtyDays = new Date(); // Current Date                                                                       // 159
                                                                                                                       //
    thirtyDays.setDate(thirtyDays.getDate() - 30); // Subtract N Days                                                  // 160
                                                                                                                       //
    var threeSixtyFiveDays = new Date(); // Current Date                                                               // 161
                                                                                                                       //
    threeSixtyFiveDays.setDate(thirtyDays.getDate() - 365); // Subtract N Days                                         // 162
                                                                                                                       //
    var REDUCE_SUM = function (a, b) {                                                                                 // 163
      return a + b;                                                                                                    // 163
    };                                                                                                                 // 163
                                                                                                                       //
    var lastDay = Logs.find({                                                                                          // 164
      type: 'Lookup',                                                                                                  // 164
      date: {                                                                                                          // 164
        $gte: oneDay                                                                                                   // 164
      }                                                                                                                // 164
    });                                                                                                                // 164
    var lastWeek = Logs.find({                                                                                         // 165
      type: 'Lookup',                                                                                                  // 165
      date: {                                                                                                          // 165
        $gte: sevenDays                                                                                                // 165
      }                                                                                                                // 165
    });                                                                                                                // 165
    var lastTwoWeeks = Logs.find({                                                                                     // 166
      type: 'Lookup',                                                                                                  // 166
      date: {                                                                                                          // 166
        $gte: fourteenDays                                                                                             // 166
      }                                                                                                                // 166
    });                                                                                                                // 166
    var lastMonth = Logs.find({                                                                                        // 167
      type: 'Lookup',                                                                                                  // 167
      date: {                                                                                                          // 167
        $gte: thirtyDays                                                                                               // 167
      }                                                                                                                // 167
    });                                                                                                                // 167
    var lastYear = Logs.find({                                                                                         // 168
      type: 'Lookup',                                                                                                  // 168
      date: {                                                                                                          // 168
        $gte: threeSixtyFiveDays                                                                                       // 168
      }                                                                                                                // 168
    });                                                                                                                // 168
    return {                                                                                                           // 169
      contactsFound: {                                                                                                 // 170
        lastDay: lastDay.map(function (doc) {                                                                          // 171
          return doc.records;                                                                                          // 171
        }).reduce(REDUCE_SUM, 0),                                                                                      // 171
        lastWeek: lastWeek.map(function (doc) {                                                                        // 172
          return doc.records;                                                                                          // 172
        }).reduce(REDUCE_SUM, 0),                                                                                      // 172
        lastTwoWeeks: lastTwoWeeks.map(function (doc) {                                                                // 173
          return doc.records;                                                                                          // 173
        }).reduce(REDUCE_SUM, 0),                                                                                      // 173
        lastMonth: lastMonth.map(function (doc) {                                                                      // 174
          return doc.records;                                                                                          // 174
        }).reduce(REDUCE_SUM, 0),                                                                                      // 174
        lastYear: lastYear.map(function (doc) {                                                                        // 175
          return doc.records;                                                                                          // 175
        }).reduce(REDUCE_SUM, 0)                                                                                       // 175
      },                                                                                                               // 170
      uses: {                                                                                                          // 177
        lastDay: lastDay.count(),                                                                                      // 178
        lastWeek: lastWeek.count(),                                                                                    // 179
        lastTwoWeeks: lastTwoWeeks.count(),                                                                            // 180
        lastMonth: lastMonth.count(),                                                                                  // 181
        lastYear: lastYear.count()                                                                                     // 182
      }                                                                                                                // 177
    };                                                                                                                 // 169
  }                                                                                                                    // 185
});                                                                                                                    // 151
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"testEloquaRest.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// testEloquaRest.js                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 'use strict';                                                                                                       // 1
//                                                                                                                     // 2
// const http = require('https');                                                                                      // 3
// const SEGMENT_LOOKUP = {                                                                                            // 4
//   host: 'secure.p01.eloqua.com',                                                                                    // 5
//   path: '/Api/rest/2.0/assets/contact/segments?depth=Complete',                                                     // 6
//   headers: {                                                                                                        // 7
//     authorization: process.env.AUTHORIZATION                                                                        // 8
//   }                                                                                                                 // 9
// };                                                                                                                  // 10
//                                                                                                                     // 11
// http.get(SEGMENT_LOOKUP, (res) => {                                                                                 // 12
//   let body = '';                                                                                                    // 13
//   res.on('data', (chunk) => {                                                                                       // 14
//     console.log('Got a chunk!');                                                                                    // 15
//     body += chunk;                                                                                                  // 16
//   });                                                                                                               // 17
//   res.on('end', () => {                                                                                             // 18
//     const elementTypes = {};                                                                                        // 19
//     const fullResponse = JSON.parse(body);                                                                          // 20
//     for (const obj of fullResponse.elements) {                                                                      // 21
//       for (const obj2 of obj.elements) {                                                                            // 22
//         if (obj2.type.includes('Filter')) {                                                                         // 23
//           console.log('***************');                                                                           // 24
//           console.log(JSON.stringify(obj2));                                                                        // 25
//           console.log('+++++++++++++++');                                                                           // 26
//           console.log(JSON.stringify(obj));                                                                         // 27
//           console.log('***************');                                                                           // 28
//         }                                                                                                           // 29
//                                                                                                                     // 30
//       }                                                                                                             // 31
//     }                                                                                                               // 32
//     console.log(JSON.stringify(elementTypes));                                                                      // 33
//   });                                                                                                               // 34
// });                                                                                                                 // 35
// console.log('This may take a while');                                                                               // 36
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},{"extensions":[".js",".json",".jsx"]});
require("./server/getEloquaData.js");
require("./server/segmentBuilderMethods.js");
require("./server/segmentBuilderMethodsV3.js");
require("./testEloquaRest.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
