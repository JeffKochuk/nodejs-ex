
// The debugger pauses here when you run `meteor debug`, because this is
// the very first code to be executed by the server process. If you have
// not already added any `debugger` statements to your code, feel free to
// do so now, wait for the server to restart, then reload this page and
// click the |▶ button to continue.

// process.env.MONGO_URL='mongodb://userLEF:lyck1Ol0jGMhFWES@172.30.121.26:27017/sampledb';
// process.env.ROOT_URL='http://nodejs-mongo-persistent-ideas.int.open.paas.redhat.com/';
// // process.env.IP='0.0.0.0';
// process.env.PORT='8080';
//
//
// var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//     ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
//     mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
//     mongoURLLabel = "";
//
// if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
//   var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//       mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//       mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//       mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//       mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//       mongoUser = process.env[mongoServiceName + '_USER'];
//
//   if (mongoHost && mongoPort && mongoDatabase) {
//     mongoURLLabel = mongoURL = 'mongodb://';
//     if (mongoUser && mongoPassword) {
//       mongoURL += mongoUser + ':' + mongoPassword + '@';
//     }
//     // Provide UI label that excludes user id and pw
//     mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//     mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//
//   }
// }


// var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//     mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//     mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//     mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//     mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
//     mongoUser = process.env[mongoServiceName + '_USER'];
//
// if (mongoHost && mongoPort && mongoDatabase) {
//   mongoURLLabel = mongoURL = 'mongodb://';
//   if (mongoUser && mongoPassword) {
//     mongoURL += mongoUser + ':' + mongoPassword + '@';
//   }
//   // Provide UI label that excludes user id and pw
//   mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//   process.env.MONGO_URL = mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//
// }



process.argv.splice(2, 0, 'program.json');
process.chdir(require('path').join(__dirname, 'programs', 'server'));
require('./programs/server/boot.js');
