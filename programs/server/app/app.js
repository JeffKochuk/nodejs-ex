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
module.importSync("mysql", {                                                                                           // 1
    "default": function (v) {                                                                                          // 1
        mysql = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var getConnection = function () {                                                                                      // 3
    var connection = mysql.createConnection(JSON.parse(process.env.MYSQL_OBJECT));                                     // 4
    connection.connect();                                                                                              // 5
    return connection;                                                                                                 // 6
};                                                                                                                     // 7
                                                                                                                       //
var getQueryPromise = function () {                                                                                    // 9
    var connection = getConnection();                                                                                  // 10
    return function (qString) {                                                                                        // 11
        return new Promise(function (resolve, reject) {                                                                // 12
            connection.query(qString, function (err, data) {                                                           // 13
                if (err) return reject(err);                                                                           // 14
                resolve(data);                                                                                         // 15
            });                                                                                                        // 16
        });                                                                                                            // 17
    };                                                                                                                 // 18
};                                                                                                                     // 19
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
module.importSync("meteor/mongo", {                                                                                    // 1
  Mongo: function (v) {                                                                                                // 1
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
module.importSync("node-fetch", {                                                                                      // 1
  "default": function (v) {                                                                                            // 1
    fetch = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var EloquaLogs = void 0;                                                                                               // 1
module.importSync("../imports/collections.js", {                                                                       // 1
  EloquaLogs: function (v) {                                                                                           // 1
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

}],"segmentBuilderMethods.js":["meteor/meteor","../imports/helpers/mysql.js","../imports/helpers/stats.js","node-fetch","sqlstring",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethods.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor = void 0;                                                                                                   // 1
module.importSync("meteor/meteor", {                                                                                   // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var getConnection = void 0,                                                                                            // 1
    getQueryPromise = void 0;                                                                                          // 1
module.importSync("../imports/helpers/mysql.js", {                                                                     // 1
    getConnection: function (v) {                                                                                      // 1
        getConnection = v;                                                                                             // 1
    },                                                                                                                 // 1
    getQueryPromise: function (v) {                                                                                    // 1
        getQueryPromise = v;                                                                                           // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var accumulateStats = void 0,                                                                                          // 1
    mysqlMap = void 0;                                                                                                 // 1
module.importSync("../imports/helpers/stats.js", {                                                                     // 1
    accumulateStats: function (v) {                                                                                    // 1
        accumulateStats = v;                                                                                           // 1
    },                                                                                                                 // 1
    mysqlMap: function (v) {                                                                                           // 1
        mysqlMap = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var fetch = void 0;                                                                                                    // 1
module.importSync("node-fetch", {                                                                                      // 1
    "default": function (v) {                                                                                          // 1
        fetch = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
var sqlstring = void 0;                                                                                                // 1
module.importSync("sqlstring", {                                                                                       // 1
    "default": function (v) {                                                                                          // 1
        sqlstring = v;                                                                                                 // 1
    }                                                                                                                  // 1
}, 4);                                                                                                                 // 1
// Data should look like this                                                                                          // 11
// {                                                                                                                   // 12
//      email: "jkochuk@redhat.com",                                                                                   // 13
//      areasOfInterest: Array[2],                                                                                     // 14
//      interestSource: Array[1],                                                                                      // 15
//      activeUsers: false,                                                                                            // 16
//      personas: Array[2],                                                                                            // 17
//      completeness: true,                                                                                            // 18
//      geography: "",                                                                                                 // 19
//      geographyRadius: "",                                                                                           // 20
//      industry: Array[1]                                                                                             // 21
// }                                                                                                                   // 22
var statsFields = ['Language', 'Size', 'Industry', 'SuperRegion', 'Persona'];                                          // 23
var sparseStatsFields = ['Company', 'Country', 'MetroArea'];                                                           // 24
var fullStatsFields = ['Persona', 'Language', 'Size', 'Industry', 'Company', 'Country', 'MLSMScore', 'MLSMRank'];      // 25
Meteor.methods({                                                                                                       // 27
    // getQuickStats(filters) {                                                                                        // 28
    //     if (!(filters.Themes && filters.Themes.length)) {                                                           // 29
    //         console.log('No Themes')                                                                                // 30
    //         console.log(filters);                                                                                   // 31
    //         return { loading: false };                                                                              // 32
    //     }                                                                                                           // 33
    //     const query = getQueryPromise();                                                                            // 34
    //     // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
    //     // const startTime = Date.now(); // @todo remove                                                            // 36
    //     const { Themes, ...rest } = filters;                                                                        // 37
    //     const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);                                    // 38
    //     let qs = `SELECT ${statsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY Language, Size, Industry, SuperRegion, Persona;`;
    //     console.log(qs);                                                                                            // 40
    //     const res = query(qs).await();                                                                              // 41
    //     // const midTime = Date.now();// @todo remove                                                               // 42
    //     let count = 0;                                                                                              // 43
    //     const stats = { count: 0 };                                                                                 // 44
    //     for (let n of statsFields) {                                                                                // 45
    //         stats[n]={};                                                                                            // 46
    //     }                                                                                                           // 47
    //     for (let row of res) {                                                                                      // 48
    //         const { count } = row;                                                                                  // 49
    //         stats.count += count;                                                                                   // 50
    //         for (let stat of statsFields) {                                                                         // 51
    //             stats[stat][row[stat]] = (stats[stat][row[stat]] || 0) + count;                                     // 52
    //         }                                                                                                       // 53
    //     }                                                                                                           // 54
    //     // console.log('Count', stats.count); //@todo                                                               // 55
    //     // console.log('Half Way', midTime - startTime);//@todo                                                     // 56
    //     // console.log('Full time', Date.now() - startTime);//@todo                                                 // 57
    //     return { stats }                                                                                            // 58
    // },                                                                                                              // 59
    //                                                                                                                 // 60
    // // @todo you can just put this as another instance of getStats                                                  // 61
    // getSparseStats(filters) {                                                                                       // 62
    //     if (!(filters.Themes && filters.Themes.length)) {                                                           // 63
    //         console.log('No Themes');                                                                               // 64
    //         console.log(filters);                                                                                   // 65
    //         return { loading: false };                                                                              // 66
    //     }                                                                                                           // 67
    //     const query = getQueryPromise();                                                                            // 68
    //     // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
    //     // const startTime = Date.now(); // @todo remove                                                            // 70
    //     const { Themes, ...rest } = filters;                                                                        // 71
    //     const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);                                    // 72
    //     let qs = `SELECT ${sparseStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${sparseStatsFields};`;
    //     console.log(qs);                                                                                            // 74
    //     const res = query(qs).await();                                                                              // 75
    //     const sparseStats = {};                                                                                     // 76
    //     for (let n of sparseStatsFields) {                                                                          // 77
    //         sparseStats[n]={};                                                                                      // 78
    //     }                                                                                                           // 79
    //     for (let row of res) {                                                                                      // 80
    //         const { count } = row;                                                                                  // 81
    //         sparseStats.count += count;                                                                             // 82
    //         for (let stat of sparseStatsFields) {                                                                   // 83
    //             sparseStats[stat][row[stat]] = (sparseStats[stat][row[stat]] || 0) + count;                         // 84
    //         }                                                                                                       // 85
    //     }                                                                                                           // 86
    //     return { sparseStats }                                                                                      // 87
    // },                                                                                                              // 88
    //                                                                                                                 // 89
    // getFullStats(filters) {                                                                                         // 90
    //     // const startTime = Date.now(); // @todo remove                                                            // 91
    //     if (!(filters.Themes && filters.Themes.length)) {                                                           // 92
    //         console.log('No Themes');                                                                               // 93
    //         console.log(filters);                                                                                   // 94
    //         return { loading: false };                                                                              // 95
    //     }                                                                                                           // 96
    //     const { Themes, ...rest } = filters;                                                                        // 97
    //     const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length); // Get keys of rest with values of non-empty arrays
    //     let qs = `SELECT ${fullStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${fullStatsFields};`;
    //     const query = getQueryPromise();                                                                            // 100
    //     console.log(qs);                                                                                            // 101
    //     const queryReturn = query(qs)                                                                               // 102
    //         .then((rows) => {                                                                                       // 103
    //             console.log(rows.length);                                                                           // 104
    //             return rows;                                                                                        // 105
    //         })                                                                                                      // 106
    //         .await();                                                                                               // 107
    //     const fullStats = accumulateStats(queryReturn, 'mysql', null);                                              // 108
    //     console.log(fullStats.total);                                                                               // 109
    //     return {                                                                                                    // 110
    //         fullStats                                                                                               // 111
    //     };                                                                                                          // 112
    // },                                                                                                              // 113
    //                                                                                                                 // 114
    //                                                                                                                 // 115
    // segmentBuilderBuildOriginalStats(formData) {                                                                    // 116
    //     let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
    //     let whereClauses = [];                                                                                      // 118
    //     let isThereEnoughData = false;                                                                              // 119
    //     if (formData.engagement && formData.engagement.length) {                                                    // 120
    //         whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);                        // 121
    //         isThereEnoughData = true;                                                                               // 122
    //     }                                                                                                           // 123
    //     if (formData.personas.length) {                                                                             // 124
    //         whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);                                   // 125
    //         isThereEnoughData = true;                                                                               // 126
    //     }                                                                                                           // 127
    //     if (formData.completeness && formData.completeness.length) {                                                // 128
    //         whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);                     // 129
    //         isThereEnoughData = true;                                                                               // 130
    //     }                                                                                                           // 131
    //     if (formData.industry.length) {                                                                             // 132
    //         whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);                                  // 133
    //         isThereEnoughData = true;                                                                               // 134
    //     }                                                                                                           // 135
    //     if (formData.metro.length) {                                                                                // 136
    //         whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);                                    // 137
    //         isThereEnoughData = true;                                                                               // 138
    //     }                                                                                                           // 139
    //     if (formData.theme.length) {                                                                                // 140
    //         query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
    //         isThereEnoughData = true;                                                                               // 142
    //     }                                                                                                           // 143
    //                                                                                                                 // 144
    //     if (isThereEnoughData) {                                                                                    // 145
    //         if (whereClauses.length) {                                                                              // 146
    //             query = query + ' where ' + whereClauses.join(' AND ');                                             // 147
    //         }                                                                                                       // 148
    //         console.log(query);                                                                                     // 149
    //         //@todo remove this LIMIT once you have indices in place                                                // 150
    //         query = query + ' LIMIT 10000';                                                                         // 151
    //         const connection = getConnection();                                                                     // 152
    //         const queryDB = promisify(connection.query, connection);                                                // 153
    //         const queryReturn = queryDB(query)                                                                      // 154
    //             .then((rows) => {                                                                                   // 155
    //                 console.log(rows.length);                                                                       // 156
    //                 return rows;                                                                                    // 157
    //             })                                                                                                  // 158
    //             .await();                                                                                           // 159
    //                                                                                                                 // 160
    //         const stats = accumulateStats(queryReturn, 'mysql', null);                                              // 161
    //         // console.log(stats);                                                                                  // 162
    //         const segment = {                                                                                       // 163
    //             stats,                                                                                              // 164
    //             total: queryReturn.length                                                                           // 165
    //         };                                                                                                      // 166
    //         // console.log(segment);                                                                                // 167
    //         return segment;                                                                                         // 168
    //                                                                                                                 // 169
    //     } else {                                                                                                    // 170
    //         throw new Meteor.Error('Need more details');                                                            // 171
    //     }                                                                                                           // 172
    // },                                                                                                              // 173
    // testStatsMethod(formData) {                                                                                     // 174
    //     const startTimeMethod1 = Date.now();                                                                        // 175
    //     let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
    //     let whereClauses = [];                                                                                      // 177
    //     let isThereEnoughData = false;                                                                              // 178
    //     if (formData.engagement && formData.engagement.length) {                                                    // 179
    //         whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);                        // 180
    //         isThereEnoughData = true;                                                                               // 181
    //     }                                                                                                           // 182
    //     if (formData.personas.length) {                                                                             // 183
    //         whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);                                   // 184
    //         isThereEnoughData = true;                                                                               // 185
    //     }                                                                                                           // 186
    //     if (formData.completeness && formData.completeness.length) {                                                // 187
    //         whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);                     // 188
    //         isThereEnoughData = true;                                                                               // 189
    //     }                                                                                                           // 190
    //     if (formData.industry.length) {                                                                             // 191
    //         whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);                                  // 192
    //         isThereEnoughData = true;                                                                               // 193
    //     }                                                                                                           // 194
    //     if (formData.metro.length) {                                                                                // 195
    //         whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);                                    // 196
    //         isThereEnoughData = true;                                                                               // 197
    //     }                                                                                                           // 198
    //     if (formData.theme.length) {                                                                                // 199
    //         query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
    //         isThereEnoughData = true;                                                                               // 201
    //     }                                                                                                           // 202
    //                                                                                                                 // 203
    //     if (isThereEnoughData) {                                                                                    // 204
    //         if (whereClauses.length) {                                                                              // 205
    //             query = query + ' where ' + whereClauses.join(' AND ');                                             // 206
    //         }                                                                                                       // 207
    //         console.log(query);                                                                                     // 208
    //         //@todo remove this LIMIT once you have indices in place                                                // 209
    //         // query = query + ' LIMIT 10000';                                                                      // 210
    //         const connection = getConnection();                                                                     // 211
    //         const queryDB = promisify(connection.query, connection);                                                // 212
    //         const queryReturn = queryDB(query)                                                                      // 213
    //             .then((rows) => {                                                                                   // 214
    //                 console.log(rows.length);                                                                       // 215
    //                 return rows;                                                                                    // 216
    //             })                                                                                                  // 217
    //             .await();                                                                                           // 218
    //                                                                                                                 // 219
    //         const stats = accumulateStats(queryReturn, 'mysql', null);                                              // 220
    //         // console.log(stats);                                                                                  // 221
    //         const segment = {                                                                                       // 222
    //             stats,                                                                                              // 223
    //             total: queryReturn.length                                                                           // 224
    //         };                                                                                                      // 225
    //         // console.log(segment);                                                                                // 226
    //         const endTimeMethod1 = Date.now();                                                                      // 227
    //         console.log('Time for stats method 1', endTimeMethod1 - startTimeMethod1, '::::', Math.ceil((endTimeMethod1 - startTimeMethod1) / 1000), 'sec')
    //         return segment;                                                                                         // 229
    //                                                                                                                 // 230
    //         // const startTimeMethod2 = Date.now();                                                                 // 231
    //         // const fromQuery = query.slice(query.indexOf('from'));                                                // 232
    //         // const countQueries = [];                                                                             // 233
    //         // mysqlMap.forEach((key, name) => countQueries.push(`SELECT ${name}, COUNT(*) as 'count' ${fromQuery} GROUP BY ${name}`));
    //         // console.log(countQueries);                                                                           // 235
    //         // const joinedQuery = countQueries.join('; ');                                                         // 236
    //         // const stats2 = {};                                                                                   // 237
    //         // queryDB(joinedQuery)                                                                                 // 238
    //         //     .then((results) => {                                                                             // 239
    //         //         // console.log(stats);                                                                       // 240
    //         //         // console.log(results);                                                                     // 241
    //         //         //results is an array of [{word, count(*)},{}],[]                                            // 242
    //         //         results.forEach((entries) => {                                                               // 243
    //         //             let thisSetOfStats = '';                                                                 // 244
    //         //             let thisDbName = '';                                                                     // 245
    //         //             entries.forEach((entry) => {                                                             // 246
    //         //                 if (!thisSetOfStats) {                                                               // 247
    //         //                     const thisEntryHolder = Object.keys(entry).filter((x) => x !== 'count');         // 248
    //         //                     if (thisEntryHolder.length) {                                                    // 249
    //         //                         thisDbName = thisEntryHolder[0];                                             // 250
    //         //                         thisSetOfStats = mysqlMap.get(thisDbName);                                   // 251
    //         //                         stats2[thisSetOfStats] = {}                                                  // 252
    //         //                     }                                                                                // 253
    //         //                 }                                                                                    // 254
    //         //                 // Yeah this will be annoying to figure out so here's how it goes:                   // 255
    //         //                 //                                                                                   // 256
    //         //                 // Entries looks like this:                                                          // 257
    //         //                 // [ { MLSMScore: 'B1', 'count': 70 },                                               // 258
    //         //                 // { MLSMScore: 'B2', 'count': 94 }, ... ]                                           // 259
    //         //                 //                                                                                   // 260
    //         //                 // We want it to look like this:                                                     // 261
    //         //                 // { MLSMScore: {                                                                    // 262
    //         //                 //      B1: 70,                                                                      // 263
    //         //                 //      B2: 94, ...                                                                  // 264
    //         //                 //    }                                                                              // 265
    //         //                 // }                                                                                 // 266
    //         //                 stats2[thisSetOfStats][entry[thisDbName]] = entry.count;                             // 267
    //         //             });                                                                                      // 268
    //         //         });                                                                                          // 269
    //         //     })                                                                                               // 270
    //         //     .catch(console.log)                                                                              // 271
    //         //     .await();                                                                                        // 272
    //         // //rankData, companies, map, etc...                                                                   // 273
    //         //                                                                                                      // 274
    //         //                                                                                                      // 275
    //         //                                                                                                      // 276
    //         // const endTimeMethod2 = Date.now();                                                                   // 277
    //         // console.log('Time for stats method 1', endTimeMethod2 - startTimeMethod2, '::::', Math.ceil((endTimeMethod2 - startTimeMethod2) / 1000), 'sec');
    //         //                                                                                                      // 279
    //         // // console.log(stats2);                                                                              // 280
    //         //                                                                                                      // 281
    //         //                                                                                                      // 282
    //         //                                                                                                      // 283
    //         //                                                                                                      // 284
    //         //                                                                                                      // 285
    //         // segment.stats = stats2;                                                                              // 286
    //         // return segment;                                                                                      // 287
    //                                                                                                                 // 288
    //     } else {                                                                                                    // 289
    //         throw new Meteor.Error('Need more details');                                                            // 290
    //     }                                                                                                           // 291
    // },                                                                                                              // 292
    //@TODO IMPLEMENT EVENTUALLY                                                                                       // 296
    segmentBuilderSaveToEloqua: function (formData) {                                                                  // 297
        var placeToPostTo = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment';                       // 298
        var thenQueue = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment/queue';                     // 299
        var criteria = [];                                                                                             // 301
                                                                                                                       //
        if (formData.engagement && formData.engagement.length) {                                                       // 302
            var criterion = {                                                                                          // 303
                "type": "ContactFieldCriterion",                                                                       // 304
                "id": "-1",                                                                                            // 305
                "condition": {                                                                                         // 306
                    "type": "TextSetCondition",                                                                        // 307
                    "operator": "in",                                                                                  // 308
                    "optionListId": "-1",                                                                              // 309
                    "quickListString": formData.engagement.join(',')                                                   // 310
                },                                                                                                     // 306
                "fieldId": "100837"                                                                                    // 312
            };                                                                                                         // 303
            criteria.push(criterion);                                                                                  // 314
        }                                                                                                              // 315
                                                                                                                       //
        if (formData.personas && formData.personas.length) {                                                           // 317
            var _criterion = {                                                                                         // 318
                "type": "ContactFieldCriterion",                                                                       // 319
                "id": "-2",                                                                                            // 320
                "condition": {                                                                                         // 321
                    "type": "TextSetCondition",                                                                        // 322
                    "operator": "in",                                                                                  // 323
                    "optionListId": "-2",                                                                              // 324
                    "quickListString": formData.personas.join(',')                                                     // 325
                },                                                                                                     // 321
                "fieldId": "100837"                                                                                    // 327
            };                                                                                                         // 318
            criteria.push(_criterion);                                                                                 // 329
        }                                                                                                              // 330
                                                                                                                       //
        if (formData.completeness && formData.completeness.length) {                                                   // 332
            var _criterion2 = {                                                                                        // 333
                "type": "ContactFieldCriterion",                                                                       // 334
                "id": "-3",                                                                                            // 335
                "condition": {                                                                                         // 336
                    "type": "TextSetCondition",                                                                        // 337
                    "operator": "in",                                                                                  // 338
                    "optionListId": "-3",                                                                              // 339
                    "quickListString": formData.completeness.join(',')                                                 // 340
                },                                                                                                     // 336
                "fieldId": "100811"                                                                                    // 342
            };                                                                                                         // 333
            criteria.push(_criterion2);                                                                                // 344
        }                                                                                                              // 345
                                                                                                                       //
        if (formData.industry && formData.industry.length) {                                                           // 347
            var _criterion3 = {                                                                                        // 348
                "type": "ContactFieldCriterion",                                                                       // 349
                "id": "-4",                                                                                            // 350
                "condition": {                                                                                         // 351
                    "type": "TextSetCondition",                                                                        // 352
                    "operator": "in",                                                                                  // 353
                    "optionListId": "-4",                                                                              // 354
                    "quickListString": formData.industry.join(',')                                                     // 355
                },                                                                                                     // 351
                "fieldId": "100046"                                                                                    // 357
            };                                                                                                         // 348
            criteria.push(_criterion3);                                                                                // 359
        }                                                                                                              // 360
                                                                                                                       //
        if (formData.metro && formData.metro.length) {                                                                 // 362
            var _criterion4 = {                                                                                        // 363
                "type": "ContactFieldCriterion",                                                                       // 364
                "id": "-5",                                                                                            // 365
                "condition": {                                                                                         // 366
                    "type": "TextSetCondition",                                                                        // 367
                    "operator": "in",                                                                                  // 368
                    "optionListId": "-5",                                                                              // 369
                    "quickListString": formData.metro.join(',')                                                        // 370
                },                                                                                                     // 366
                "fieldId": "100818"                                                                                    // 372
            };                                                                                                         // 363
            criteria.push(_criterion4);                                                                                // 374
        }                                                                                                              // 375
                                                                                                                       //
        if (formData.theme && formData.theme.length) {                                                                 // 377
            //@todo do theme here                                                                                      // 378
            console.log("We don't *DO* theme here...");                                                                // 379
        }                                                                                                              // 380
                                                                                                                       //
        var filter = {                                                                                                 // 382
            "isIncluded": "true",                                                                                      // 383
            "filter": {                                                                                                // 384
                "name": "Filter Criterion 1",                                                                          // 385
                "scope": "local",                                                                                      // 386
                "id": "-111",                                                                                          // 387
                "createdBy": "2084",                                                                                   // 388
                "createdAt": "" + new Date().valueOf() / 1000,                                                         // 389
                "type": "ContactFilter",                                                                               // 390
                "criteria": criteria,                                                                                  // 391
                "statement": criteria.map(function (c) {                                                               // 392
                    return c.id;                                                                                       // 392
                }).join(' AND '),                                                                                      // 392
                "x_e10_isTemplate": "false",                                                                           // 393
                "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]                                         // 394
            },                                                                                                         // 384
            "id": "-112",                                                                                              // 401
            "type": "ContactFilterSegmentElement"                                                                      // 402
        };                                                                                                             // 382
        var template = {                                                                                               // 405
            "createdBy": "2084",                                                                                       // 406
            "createdAt": "1476197319",                                                                                 // 407
            // "updatedBy": "2084",                                                                                    // 408
            // "updatedAt": "1476197319",                                                                              // 409
            "currentStatus": "Draft",                                                                                  // 410
            "type": "ContactSegment",                                                                                  // 411
            "elements": [filter],                                                                                      // 412
            "isBlankTemplate": true,                                                                                   // 415
            "id": "-211",                                                                                              // 416
            "name": "TESTTEST: " + formData.name,                                                                      // 417
            "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],                                            // 418
            "folderId": "180344",                                                                                      // 424
            "x_e10_isTemplate": "false",                                                                               // 425
            "depth": "complete"                                                                                        // 426
        };                                                                                                             // 405
        console.log(JSON.stringify(template)); // Actually post to Eloqua                                              // 428
                                                                                                                       //
        fetch(placeToPostTo, {                                                                                         // 431
            method: 'POST',                                                                                            // 431
            body: JSON.stringify(template),                                                                            // 431
            headers: {                                                                                                 // 431
                authorization: process.env.AUTHORIZATION,                                                              // 431
                "Content-Type": "application/json"                                                                     // 431
            }                                                                                                          // 431
        }).then(function (res) {                                                                                       // 431
            return res.json();                                                                                         // 432
        }).then(function (json) {                                                                                      // 432
            console.log('***** First Half *****');                                                                     // 434
            console.log(json);                                                                                         // 435
            return fetch(thenQueue + "/" + json.id, {                                                                  // 436
                method: 'POST',                                                                                        // 436
                headers: {                                                                                             // 436
                    authorization: process.env.AUTHORIZATION,                                                          // 436
                    "Content-Type": "application/json"                                                                 // 436
                }                                                                                                      // 436
            });                                                                                                        // 436
        }).then(function (res) {                                                                                       // 437
            return res.json();                                                                                         // 438
        }).then(function (json) {                                                                                      // 438
            console.log('***** QUEUE RES *****');                                                                      // 440
            console.log(json);                                                                                         // 441
        }).await();                                                                                                    // 442
        console.log('DONE!');                                                                                          // 444
    }                                                                                                                  // 447
}); // const thisOneWorked = {                                                                                         // 27
//     "createdBy": "2084",                                                                                            // 452
//     "createdAt": "1476197319",                                                                                      // 453
//     "currentStatus": "Draft",                                                                                       // 454
//     "type": "ContactSegment",                                                                                       // 455
//     "elements": [                                                                                                   // 456
//         {                                                                                                           // 457
//             "isIncluded": "true",                                                                                   // 458
//             "filter": {                                                                                             // 459
//                 "name": "Filter Criteria 1",                                                                        // 460
//                 "scope": "local",                                                                                   // 461
//                 "id": "-111",                                                                                       // 462
//                 "createdBy": "2084",                                                                                // 463
//                 "createdAt": "1476197359",                                                                          // 464
//                 "type": "ContactFilter",                                                                            // 465
//                 "criteria": [{                                                                                      // 466
//                     "type": "ContactFieldCriterion",                                                                // 467
//                     "id": "-5",                                                                                     // 468
//                     "condition": {                                                                                  // 469
//                         "type": "TextSetCondition",                                                                 // 470
//                         "operator": "in",                                                                           // 471
//                         "optionListId": "-5",                                                                       // 472
//                         "quickListString": "High,Medium"                                                            // 473
//                     },                                                                                              // 474
//                     "fieldId": "100811"                                                                             // 475
//                 }],                                                                                                 // 476
//                 "statement": "-5",                                                                                  // 477
//                 "x_e10_isTemplate": "false",                                                                        // 478
//                 "permissions": [                                                                                    // 479
//                     "Retrieve",                                                                                     // 480
//                     "Update",                                                                                       // 481
//                     "Delete",                                                                                       // 482
//                     "SetSecurity"                                                                                   // 483
//                 ]                                                                                                   // 484
//             },                                                                                                      // 485
//             "id": "-112",                                                                                           // 486
//             "type": "ContactFilterSegmentElement"                                                                   // 487
//         }                                                                                                           // 488
//     ],                                                                                                              // 489
//     "isBlankTemplate": true,                                                                                        // 490
//     "id": "-211",                                                                                                   // 491
//     "name": "TEST REST 123123",                                                                                     // 492
//     "permissions": [                                                                                                // 493
//         "Retrieve",                                                                                                 // 494
//         "Update",                                                                                                   // 495
//         "Delete",                                                                                                   // 496
//         "SetSecurity"                                                                                               // 497
//     ],                                                                                                              // 498
//     "folderId": "180344",                                                                                           // 499
//     "x_e10_isTemplate": "false",                                                                                    // 500
//     "depth": "complete"                                                                                             // 501
// };                                                                                                                  // 502
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
                },                                                                                                     // 522
                "fieldId": "100046"                                                                                    // 528
            }],                                                                                                        // 519
            "statement": "-4",                                                                                         // 530
            "x_e10_isTemplate": "false",                                                                               // 531
            "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]                                             // 532
        },                                                                                                             // 512
        "id": "-112",                                                                                                  // 534
        "type": "ContactFilterSegmentElement"                                                                          // 535
    }],                                                                                                                // 510
    "isBlankTemplate": true,                                                                                           // 537
    "id": "-211",                                                                                                      // 538
    "name": "TEST: Leia Created 1479321218138",                                                                        // 539
    "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],                                                    // 540
    "folderId": "180344",                                                                                              // 541
    "x_e10_isTemplate": "false",                                                                                       // 542
    "depth": "complete"                                                                                                // 543
};                                                                                                                     // 505
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"segmentBuilderMethodsV3.js":["babel-runtime/helpers/slicedToArray","babel-runtime/helpers/extends","meteor/meteor","../imports/collections.js","sqlstring","../imports/helpers/mysql.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/segmentBuilderMethodsV3.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");                                                  //
                                                                                                                       //
var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);                                                         //
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var Meteor = void 0;                                                                                                   // 1
module.importSync("meteor/meteor", {                                                                                   // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Stats = void 0,                                                                                                    // 1
    SqlCache = void 0;                                                                                                 // 1
module.importSync("../imports/collections.js", {                                                                       // 1
    Stats: function (v) {                                                                                              // 1
        Stats = v;                                                                                                     // 1
    },                                                                                                                 // 1
    SqlCache: function (v) {                                                                                           // 1
        SqlCache = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var sqlstring = void 0;                                                                                                // 1
module.importSync("sqlstring", {                                                                                       // 1
    "default": function (v) {                                                                                          // 1
        sqlstring = v;                                                                                                 // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var getQueryPromise = void 0;                                                                                          // 1
module.importSync("../imports/helpers/mysql.js", {                                                                     // 1
    getQueryPromise: function (v) {                                                                                    // 1
        getQueryPromise = v;                                                                                           // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
Meteor.methods({                                                                                                       // 10
    // Given an object of filters, get counts for all of the elements NOT filtered                                     // 11
    //                                                                                                                 // 12
    // @param filters Object with shape {                                                                              // 13
    //      filter1: [],                                                                                               // 14
    //      filter2: [].                                                                                               // 15
    //      ...                                                                                                        // 16
    // }                                                                                                               // 17
    // @return Object with shape {                                                                                     // 18
    //      Area1: {                                                                                                   // 19
    //          Element1: 123,                                                                                         // 20
    //          Element2: 234,                                                                                         // 21
    //          ...                                                                                                    // 22
    //      },                                                                                                         // 23
    //      Area2: {                                                                                                   // 24
    //          Element3: 345,                                                                                         // 25
    //          Element4: 456,                                                                                         // 26
    //          ...                                                                                                    // 27
    //      },                                                                                                         // 28
    //      ...                                                                                                        // 29
    // }                                                                                                               // 30
    getStats: function (filters) {                                                                                     // 31
        // See if we have stats logged for the given filters and return them if we do                                  // 33
        var thisWeek = new Date(); // Current Date                                                                     // 34
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 35
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 36
            date: {                                                                                                    // 36
                $gt: thisWeek                                                                                          // 36
            },                                                                                                         // 36
            hasStats: true                                                                                             // 36
        }, filters)).fetch();                                                                                          // 36
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 37
            return existingStats[0].stats;                                                                             // 38
        } // Make the SQL Query to get the required stats                                                              // 39
                                                                                                                       //
                                                                                                                       //
        var stats = getStats(filters); //Insert the document into the Mongo Cache AFTER we return it to the            // 42
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 45
            Stats.upsert((0, _extends3.default)({}, filters), (0, _extends3.default)({                                 // 46
                date: new Date(),                                                                                      // 47
                hasStats: true,                                                                                        // 48
                stats: stats                                                                                           // 49
            }, filters));                                                                                              // 46
        }, 0);                                                                                                         // 52
        return stats;                                                                                                  // 53
    },                                                                                                                 // 54
    getCompanies: function (filters) {                                                                                 // 56
        // See if we have stats logged for the given filters and return them if we do                                  // 58
        var thisWeek = new Date(); // Current Date                                                                     // 59
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 60
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 61
            date: {                                                                                                    // 61
                $gt: thisWeek                                                                                          // 61
            },                                                                                                         // 61
            companies: true                                                                                            // 61
        }, filters)).fetch();                                                                                          // 61
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 62
            return existingStats[0].companiesList;                                                                     // 63
        } // Make the SQL Query to get the required stats                                                              // 64
                                                                                                                       //
                                                                                                                       //
        var companiesList = getCompanyStats(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 70
            Stats.upsert((0, _extends3.default)({}, filters, {                                                         // 71
                companies: true                                                                                        // 71
            }), (0, _extends3.default)({                                                                               // 71
                date: new Date(),                                                                                      // 72
                companies: true,                                                                                       // 73
                companiesList: companiesList                                                                           // 74
            }, filters));                                                                                              // 71
        }, 0);                                                                                                         // 78
        return companiesList;                                                                                          // 79
    },                                                                                                                 // 81
    // There are two ways to grab Countries based on whether we're filtering by Companies or not.                      // 83
    getCountries: function (filters) {                                                                                 // 84
        // See if we have stats logged for the given filters and return them if we do                                  // 86
        var thisWeek = new Date(); // Current Date                                                                     // 87
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 88
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 89
            date: {                                                                                                    // 89
                $gt: thisWeek                                                                                          // 89
            },                                                                                                         // 89
            getCountries: true                                                                                         // 89
        }, filters)).fetch();                                                                                          // 89
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 90
            return existingStats[0].countryList;                                                                       // 91
        } // Make the SQL Query to get the required stats                                                              // 92
                                                                                                                       //
                                                                                                                       //
        var countryList = getCountryStats(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 98
            Stats.upsert((0, _extends3.default)({}, filters, {                                                         // 99
                companies: true                                                                                        // 99
            }), (0, _extends3.default)({                                                                               // 99
                date: new Date(),                                                                                      // 100
                getCountries: true,                                                                                    // 101
                countryList: countryList                                                                               // 102
            }, filters));                                                                                              // 99
        }, 0);                                                                                                         // 106
        return countryList;                                                                                            // 107
    },                                                                                                                 // 108
    getStatsWithCompany: function (filters) {                                                                          // 110
        // See if we have stats logged for the given filters and return them if we do                                  // 111
        var thisWeek = new Date(); // Current Date                                                                     // 112
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 113
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 114
            date: {                                                                                                    // 114
                $gt: thisWeek                                                                                          // 114
            },                                                                                                         // 114
            hasStats: true                                                                                             // 114
        }, filters)).fetch();                                                                                          // 114
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 115
            return existingStats[0].stats;                                                                             // 116
        } // Make the SQL Query to get the required stats                                                              // 117
                                                                                                                       //
                                                                                                                       //
        var stats = getStatsWithCompany(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 123
            Stats.upsert((0, _extends3.default)({}, filters), (0, _extends3.default)({                                 // 124
                date: new Date(),                                                                                      // 125
                hasStats: true,                                                                                        // 126
                stats: stats                                                                                           // 127
            }, filters));                                                                                              // 124
        }, 0);                                                                                                         // 130
        return stats;                                                                                                  // 131
    },                                                                                                                 // 133
    getStatsWithCountry: function (filters) {                                                                          // 135
        // See if we have stats logged for the given filters and return them if we do                                  // 136
        var thisWeek = new Date(); // Current Date                                                                     // 137
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 138
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 139
            date: {                                                                                                    // 139
                $gt: thisWeek                                                                                          // 139
            },                                                                                                         // 139
            getStatsWithCountry: true                                                                                  // 139
        }, filters)).fetch();                                                                                          // 139
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 140
            return existingStats[0].stats;                                                                             // 141
        } // Make the SQL Query to get the required stats                                                              // 142
                                                                                                                       //
                                                                                                                       //
        var stats = getStatsWithCountry(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 148
            Stats.upsert((0, _extends3.default)({}, filters), (0, _extends3.default)({                                 // 149
                date: new Date(),                                                                                      // 150
                getStatsWithCountry: true,                                                                             // 151
                stats: stats                                                                                           // 152
            }, filters));                                                                                              // 149
        }, 0);                                                                                                         // 155
        return stats;                                                                                                  // 156
    },                                                                                                                 // 158
    getStatsWithCountryAndCompany: function (filters) {                                                                // 159
        // See if we have stats logged for the given filters and return them if we do                                  // 160
        var thisWeek = new Date(); // Current Date                                                                     // 161
                                                                                                                       //
        thisWeek.setDate(thisWeek.getDate() - 7);                                                                      // 162
        var existingStats = Stats.find((0, _extends3.default)({                                                        // 163
            date: {                                                                                                    // 163
                $gt: thisWeek                                                                                          // 163
            },                                                                                                         // 163
            getStatsWithCountryAndCompany: true                                                                        // 163
        }, filters)).fetch();                                                                                          // 163
                                                                                                                       //
        if (existingStats.length) {                                                                                    // 164
            return existingStats[0].stats;                                                                             // 165
        } // Make the SQL Query to get the required stats                                                              // 166
                                                                                                                       //
                                                                                                                       //
        var stats = getStatsWithCountryAndCompany(filters); //Insert the document into the Mongo Cache AFTER we return it to the
                                                                                                                       //
        Meteor.setTimeout(function () {                                                                                // 172
            Stats.upsert((0, _extends3.default)({}, filters), (0, _extends3.default)({                                 // 173
                date: new Date(),                                                                                      // 174
                getStatsWithCountryAndCompany: true,                                                                   // 175
                stats: stats                                                                                           // 176
            }, filters));                                                                                              // 173
        }, 0);                                                                                                         // 179
        return stats;                                                                                                  // 180
    }                                                                                                                  // 181
}); // Grab a full stats block from country_counts                                                                     // 10
                                                                                                                       //
var getStatsWithCountry = function (filters) {                                                                         // 185
    var query = getQueryPromise();                                                                                     // 186
    var whereClause = getWhereClause(filters);                                                                         // 187
    var sqlQuery = fullStatsCountryBase + " " + whereClause;                                                           // 188
    var statsReturn = query(sqlQuery).await();                                                                         // 189
    var stats = getStatsFromSQLResponse(statsReturn);                                                                  // 190
                                                                                                                       //
    if (filters['Countries'].filter(function (k) {                                                                     // 191
        return k === 'US';                                                                                             // 191
    }).length) {                                                                                                       // 191
        // Also grab MetroAreas if the US is selected                                                                  // 192
        var metroQuery = metroStatsBase + " " + whereClause + " " + metroStatsBase2;                                   // 193
        console.log('Metro Query\n', metroQuery);                                                                      // 194
        var metroReturn = query(metroQuery).await();                                                                   // 195
        var metroAreas = {}; // This replace is stupid. We should do it in the DB but for now, this will allow us to store the values in Mongo
                                                                                                                       //
        metroReturn.forEach(function (row) {                                                                           // 198
            return metroAreas[row.MetroArea.replace(/\./g, '')] = row.count;                                           // 198
        });                                                                                                            // 198
        stats['Metro Areas'] = metroAreas;                                                                             // 199
    }                                                                                                                  // 200
                                                                                                                       //
    return stats;                                                                                                      // 201
};                                                                                                                     // 202
                                                                                                                       //
var fullStatsCountryBase = 'SELECT sum(count) AS count, sum(`Email`) AS `Email`, sum(`Phone`) AS `Phone`, sum(`Mail`) AS `Mail`, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise Application Platform`) AS `Enterprise Application Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM country_counts ';
var metroStatsBase = 'SELECT sum(count) AS count, MetroArea FROM country_counts';                                      // 204
var metroStatsBase2 = 'GROUP BY MetroArea ORDER BY count'; // Given an object of filters, build a SQL Query            // 205
//                                                                                                                     // 209
// @param filters Object with shape {                                                                                  // 210
//      filter1: [],                                                                                                   // 211
//      filter2: [].                                                                                                   // 212
//      ...                                                                                                            // 213
//  }                                                                                                                  // 214
// @return String SQL Query to get counts                                                                              // 215
                                                                                                                       //
var getStats = function (filters) {                                                                                    // 216
    var query = getQueryPromise();                                                                                     // 217
    var whereClause = getWhereClause(filters);                                                                         // 218
    var sqlQuery = sqlBase + " " + whereClause + ";";                                                                  // 219
    var statsReturn = query(sqlQuery);                                                                                 // 220
    return getStatsFromSQLResponse(statsReturn.await());                                                               // 221
};                                                                                                                     // 222
                                                                                                                       //
var sqlBase = 'SELECT sum(count) AS count, sum(`Email`) AS `Email`, sum(`Phone`) AS `Phone`, sum(`Mail`) AS `Mail`, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise Application Platform`) AS `Enterprise Application Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM contact_counts '; // Return an array of Company names... top 10
                                                                                                                       //
var getCompanyStats = function (filters) {                                                                             // 227
    var query = getQueryPromise();                                                                                     // 228
    var whereClause = getWhereClause(filters);                                                                         // 229
    var companyQuery = sqlCompanyBase + " " + whereClause + " " + sqlCompanyBase2 + "; select count(distinct Companies) as companyCount from company_counts " + whereClause + ";";
    var companiesReturn = query(companyQuery).await();                                                                 // 231
    return {                                                                                                           // 232
        companies: companiesReturn[0].map(function (r) {                                                               // 233
            return r.Companies;                                                                                        // 233
        }),                                                                                                            // 233
        companyCount: companiesReturn[1][0].companyCount                                                               // 234
    };                                                                                                                 // 232
};                                                                                                                     // 236
                                                                                                                       //
var sqlCompanyBase = 'SELECT SUM(count) AS count, Companies FROM company_counts ';                                     // 237
var sqlCompanyBase2 = 'GROUP BY Companies ORDER BY count DESC LIMIT 10'; // When filters contains a 'Company' field, use this method to grab the full stats.
                                                                                                                       //
var getStatsWithCompany = function (filters) {                                                                         // 242
    var query = getQueryPromise();                                                                                     // 243
    var whereClause = getWhereClause(filters);                                                                         // 244
    var sqlQuery = fullStatsCompanyBase + " " + whereClause;                                                           // 245
    var statsReturn = query(sqlQuery).await();                                                                         // 246
    var stats = getStatsFromSQLResponse(statsReturn);                                                                  // 247
    return {                                                                                                           // 248
        stats: stats,                                                                                                  // 248
        companyCount: filters.Companies.length                                                                         // 248
    };                                                                                                                 // 248
};                                                                                                                     // 249
                                                                                                                       //
var fullStatsCompanyBase = 'SELECT sum(count) AS count, sum(`Email`) AS `Email`, sum(`Phone`) AS `Phone`, sum(`Mail`) AS `Mail`, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise Application Platform`) AS `Enterprise Application Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM company_counts ';
                                                                                                                       //
var getCountryStats = function (filters) {                                                                             // 253
    var query = getQueryPromise();                                                                                     // 254
    var whereClause = getWhereClause(filters);                                                                         // 255
                                                                                                                       //
    if (filters.Companies.length) {                                                                                    // 256
        console.log('Getting Countries from contact table');                                                           // 257
        console.log('NOT IMPLEMENTED'); //@TODO Get Countries from contacts Table                                      // 258
    } else {                                                                                                           // 260
        var sqlQuery = countryCountsSQLBase1 + " " + whereClause + " " + countryCountsSQLBase2;                        // 262
        var countries = query(sqlQuery).await();                                                                       // 263
        var retObj = {};                                                                                               // 264
        countries.forEach(function (_ref) {                                                                            // 265
            var Country = _ref.Country,                                                                                // 265
                count = _ref.count;                                                                                    // 265
            return retObj[Country] = count;                                                                            // 265
        });                                                                                                            // 265
        return retObj;                                                                                                 // 266
    }                                                                                                                  // 267
};                                                                                                                     // 268
                                                                                                                       //
var countryCountsSQLBase1 = 'SELECT Country, sum(count) AS count FROM country_counts ';                                // 269
var countryCountsSQLBase2 = 'GROUP BY Country ORDER BY count DESC';                                                    // 270
                                                                                                                       //
var getStatsWithCountryAndCompany = function (filters) {                                                               // 273
    // get normal stats                                                                                                // 274
    var query = getQueryPromise();                                                                                     // 275
    var whereClause = getWhereClause(filters);                                                                         // 276
    var sqlQuery = fullStatsCountryCompanyBase + " " + whereClause;                                                    // 277
    console.log('***** SQL COMPANY *****', sqlQuery, '***** END SQL COMPANY *****');                                   // 278
    var statsReturn = query(sqlQuery).await();                                                                         // 279
    var stats = getStatsFromSQLResponse(statsReturn);                                                                  // 280
    console.log(statsReturn); // Also grab MetroAreas and Countries specifically                                       // 281
                                                                                                                       //
    var metroQuery = metroStatsBaseCC + " " + whereClause + " " + metroStatsBaseCC2 + "; " + countryStatsBaseCC + " " + whereClause + " " + countryStatsBaseCC2 + ";";
    console.log('Metro Query\n', metroQuery);                                                                          // 284
    var queryReturn = query(metroQuery).await();                                                                       // 285
                                                                                                                       //
    var _queryReturn = (0, _slicedToArray3.default)(queryReturn, 2),                                                   // 273
        metroReturn = _queryReturn[0],                                                                                 // 273
        countryReturn = _queryReturn[1];                                                                               // 273
                                                                                                                       //
    var metroAreas = {};                                                                                               // 287
    var countries = {}; // This replace is stupid. We SHOULD do it in the DB.  But for now, this will allow us to store the values in Mongo
                                                                                                                       //
    metroReturn.forEach(function (row) {                                                                               // 290
        return metroAreas[row.MetroArea.replace(/\./g, '')] = row.count;                                               // 290
    });                                                                                                                // 290
    countryReturn.forEach(function (row) {                                                                             // 291
        return countries[row.Country] = row.count;                                                                     // 291
    });                                                                                                                // 291
    stats['Metro Areas'] = metroAreas;                                                                                 // 293
    stats['Countries'] = countries;                                                                                    // 294
    return stats;                                                                                                      // 295
};                                                                                                                     // 296
                                                                                                                       //
var fullStatsCountryCompanyBase = 'SELECT sum(count) AS count, sum(`Email`) AS `Email`, sum(`Phone`) AS `Phone`, sum(`Mail`) AS `Mail`, sum(`NA`) AS `NA`, sum(`LATAM`) AS `LATAM`, sum(`EMEA`) AS `EMEA`, sum(`APAC`) AS `APAC`, sum(`IT Manager`) AS `IT Manager`, sum(`Other`) AS `Other`, sum(`Lead Developer`) AS `Lead Developer`, sum(`IT Executive`) AS `IT Executive`, sum(`Business Analyst`) AS `Business Analyst`, sum(`System Administrator`) AS `System Administrator`, sum(`Architect`) AS `Architect`, sum(`IT Decision Maker`) AS `IT Decision Maker`, sum(`Enterprise`) AS `Enterprise`, sum(`Mid-Market Enterprise`) AS `Mid-Market Enterprise`, sum(`Medium Business`) AS `Medium Business`, sum(`Small Business`) AS `Small Business`, sum(`Manufacturing`) AS `Manufacturing`, sum(`Finance`) AS `Finance`, sum(`Telecommunications`) AS `Telecommunications`, sum(`Media & Internet`) AS `Media & Internet`, sum(`Healthcare`) AS `Healthcare`, sum(`Education`) AS `Education`, sum(`Government`) AS `Government`, sum(`Inactive`) AS `Inactive`, sum(`Lapsed`) AS `Lapsed`, sum(`Most Active`) AS `Most Active`, sum(`Lapsing`) AS `Lapsing`, sum(`Invalid`) AS `Invalid`, sum(`Internal`) AS `Internal`, sum(`Accelerate`) AS `Accelerate`, sum(`Integrate`) AS `Integrate`, sum(`Efficiency`) AS `Efficiency`, sum(`Transitional`) AS `Transitional`, sum(`Agility`) AS `Agility`, sum(`Training`) AS `Training`, sum(`RHEL`) AS `RHEL`, sum(`Satellite`) AS `Satellite`, sum(`RHEV`) AS `RHEV`, sum(`Enterprise Application Platform`) AS `Enterprise Application Platform`, sum(`OpenStack`) AS `OpenStack`, sum(`CloudForms`) AS `CloudForms` FROM country_company_counts ';
var metroStatsBaseCC = 'SELECT sum(count) AS count, MetroArea FROM country_company_counts';                            // 298
var metroStatsBaseCC2 = 'GROUP BY MetroArea ORDER BY count';                                                           // 299
var countryStatsBaseCC = 'SELECT sum(count) AS count, Country FROM country_company_counts';                            // 300
var countryStatsBaseCC2 = 'GROUP BY Country ORDER BY count'; //                                                        // 301
// WHERE CLAUSES HERE                                                                                                  // 306
//                                                                                                                     // 307
                                                                                                                       //
var countableFields = {                                                                                                // 308
    'Programs': true,                                                                                                  // 308
    'Super Regions': true,                                                                                             // 308
    'Persona': true,                                                                                                   // 308
    'Industry': true,                                                                                                  // 308
    'Company Size': true,                                                                                              // 308
    'Engagement Status': true,                                                                                         // 308
    'Installed Technologies': true,                                                                                    // 308
    'Campaign Type': true                                                                                              // 308
};                                                                                                                     // 308
var uncountableFields = {                                                                                              // 309
    'Countries': 'Country',                                                                                            // 309
    'Metro Areas': 'MetroArea',                                                                                        // 309
    'Companies': 'Companies'                                                                                           // 309
};                                                                                                                     // 309
                                                                                                                       //
var getWhereClause = function (filters) {                                                                              // 310
    var keys = Object.keys(filters).filter(function (k) {                                                              // 311
        return filters[k].length;                                                                                      // 311
    });                                                                                                                // 311
    var whereCountable = keys.filter(function (k) {                                                                    // 312
        return countableFields[k];                                                                                     // 313
    }).map(function (k) {                                                                                              // 313
        var thisArr = filters[k];                                                                                      // 315
        return "(" + thisArr.map(function (val) {                                                                      // 316
            return "`" + val + "`>0";                                                                                  // 317
        }).join(' OR ') + ")";                                                                                         // 317
    });                                                                                                                // 319
    var whereUncountable = keys.filter(function (k) {                                                                  // 320
        return !countableFields[k];                                                                                    // 321
    }).map(function (k) {                                                                                              // 321
        var thisArr = filters[k];                                                                                      // 323
        var name = uncountableFields[k] || k;                                                                          // 324
        return "`" + name + "` IN (" + thisArr.map(sqlstring.escape).join(', ') + ")";                                 // 325
    });                                                                                                                // 326
    var where = whereCountable.concat(whereUncountable);                                                               // 327
                                                                                                                       //
    if (where.length) {                                                                                                // 328
        return "WHERE " + where.join(' AND ');                                                                         // 329
    }                                                                                                                  // 330
                                                                                                                       //
    return '';                                                                                                         // 331
}; /**                                                                                                                 // 332
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
var getStatsFromSQLResponse = function (SQLRes) {                                                                      // 396
    if (SQLRes.length !== 1) {                                                                                         // 397
        console.log('SQLRes should have one row', SQLRes);                                                             // 398
    }                                                                                                                  // 399
                                                                                                                       //
    var thisRes = SQLRes[0];                                                                                           // 400
    return {                                                                                                           // 401
        contactCount: thisRes.count,                                                                                   // 402
        companyCount: thisRes.companies,                                                                               // 403
        'Campaign Type': {                                                                                             // 404
            'Mail': thisRes['Mail'],                                                                                   // 405
            'Email': thisRes['Email'],                                                                                 // 406
            'Phone': thisRes['Phone']                                                                                  // 407
        },                                                                                                             // 404
        'Super Regions': {                                                                                             // 409
            'NA': thisRes['NA'],                                                                                       // 410
            'LATAM': thisRes['LATAM'],                                                                                 // 411
            'EMEA': thisRes['EMEA'],                                                                                   // 412
            'APAC': thisRes['APAC']                                                                                    // 413
        },                                                                                                             // 409
        Persona: {                                                                                                     // 415
            'IT Manager': thisRes['IT Manager'],                                                                       // 416
            'Other': thisRes['Other'],                                                                                 // 417
            'Lead Developer': thisRes['Lead Developer'],                                                               // 418
            'IT Executive': thisRes['IT Executive'],                                                                   // 419
            'Business Analyst': thisRes['Business Analyst'],                                                           // 420
            'System Administrator': thisRes['System Administrator'],                                                   // 421
            'Architect': thisRes['Architect'],                                                                         // 422
            'IT Decision Maker': thisRes['IT Decision Maker']                                                          // 423
        },                                                                                                             // 415
        'Company Size': {                                                                                              // 425
            'Enterprise': thisRes['Enterprise'],                                                                       // 426
            'Mid-Market Enterprise': thisRes['Mid-Market Enterprise'],                                                 // 427
            'Medium Business': thisRes['Medium Business'],                                                             // 428
            'Small Business': thisRes['Small Business']                                                                // 429
        },                                                                                                             // 425
        Industry: {                                                                                                    // 431
            'Manufacturing': thisRes['Manufacturing'],                                                                 // 432
            'Finance': thisRes['Finance'],                                                                             // 433
            'Telecommunications': thisRes['Telecommunications'],                                                       // 434
            'Media & Internet': thisRes['Media & Internet'],                                                           // 435
            'Healthcare': thisRes['Healthcare'],                                                                       // 436
            'Education': thisRes['Education'],                                                                         // 437
            'Government': thisRes['Government']                                                                        // 438
        },                                                                                                             // 431
        'Engagement Status': {                                                                                         // 440
            'Inactive': thisRes['Inactive'],                                                                           // 441
            'Lapsed': thisRes['Lapsed'],                                                                               // 442
            'Most Active': thisRes['Most Active'],                                                                     // 443
            'Lapsing': thisRes['Lapsing'],                                                                             // 444
            'Invalid': thisRes['Invalid'],                                                                             // 445
            'Internal': thisRes['Internal']                                                                            // 446
        },                                                                                                             // 440
        Programs: {                                                                                                    // 448
            'Accelerate': thisRes['Accelerate'],                                                                       // 449
            'Integrate': thisRes['Integrate'],                                                                         // 450
            'Efficiency': thisRes['Efficiency'],                                                                       // 451
            'Transitional': thisRes['Transitional'],                                                                   // 452
            'Agility': thisRes['Agility'],                                                                             // 453
            'Training': thisRes['Training']                                                                            // 454
        },                                                                                                             // 448
        'Installed Technologies': {                                                                                    // 456
            'RHEL': thisRes['RHEL'],                                                                                   // 457
            'Satellite': thisRes['Satellite'],                                                                         // 458
            'RHEV': thisRes['RHEV'],                                                                                   // 459
            'Enterprise Application Platform': thisRes['Enterprise Application Platform'],                             // 460
            'OpenStack': thisRes['OpenStack'],                                                                         // 461
            'CloudForms': thisRes['CloudForms']                                                                        // 462
        }                                                                                                              // 456
    };                                                                                                                 // 401
};                                                                                                                     // 465
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
module.importSync("meteor/meteor", {                                                                                   // 1
  Meteor: function (v) {                                                                                               // 1
    Meteor = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var getEloquaDataPromise = void 0,                                                                                     // 1
    getEloquaDataResults = void 0,                                                                                     // 1
    getOneEloquaPage = void 0,                                                                                         // 1
    SEGMENTS_URL = void 0,                                                                                             // 1
    CONTACTS_URL = void 0;                                                                                             // 1
module.importSync("./getEloquaData.js", {                                                                              // 1
  getEloquaDataPromise: function (v) {                                                                                 // 1
    getEloquaDataPromise = v;                                                                                          // 1
  },                                                                                                                   // 1
  getEloquaDataResults: function (v) {                                                                                 // 1
    getEloquaDataResults = v;                                                                                          // 1
  },                                                                                                                   // 1
  getOneEloquaPage: function (v) {                                                                                     // 1
    getOneEloquaPage = v;                                                                                              // 1
  },                                                                                                                   // 1
  SEGMENTS_URL: function (v) {                                                                                         // 1
    SEGMENTS_URL = v;                                                                                                  // 1
  },                                                                                                                   // 1
  CONTACTS_URL: function (v) {                                                                                         // 1
    CONTACTS_URL = v;                                                                                                  // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Segments = void 0,                                                                                                 // 1
    EloquaLogs = void 0,                                                                                               // 1
    Logs = void 0;                                                                                                     // 1
module.importSync("../imports/collections.js", {                                                                       // 1
  Segments: function (v) {                                                                                             // 1
    Segments = v;                                                                                                      // 1
  },                                                                                                                   // 1
  EloquaLogs: function (v) {                                                                                           // 1
    EloquaLogs = v;                                                                                                    // 1
  },                                                                                                                   // 1
  Logs: function (v) {                                                                                                 // 1
    Logs = v;                                                                                                          // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var Restivus = void 0;                                                                                                 // 1
module.importSync("meteor/nimble:restivus", {                                                                          // 1
  Restivus: function (v) {                                                                                             // 1
    Restivus = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var accumulateStats = void 0;                                                                                          // 1
module.importSync("../imports/helpers/stats.js", {                                                                     // 1
  accumulateStats: function (v) {                                                                                      // 1
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
