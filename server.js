var APP_DNS = process.env.OPENSHIFT_APP_DNS_ALIAS || process.env.OPENSHIFT_APP_DNS;

// process.env.ROOT_URL = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
process.env.MONGO_URL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
// process.env.MAIL_URL = "smtp://email:password@smtp.gmail.com:465";
process.env.PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
process.env.BIND_IP = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// process.env.DDP_DEFAULT_CONNECTION_URL = 'http://' + APP_DNS + ':8000';

// Show connection details on startup
console.log("*********** Meteor Env ************");
console.log("MONGO_URL IS: " + process.env.MONGO_URL);
console.log("ROOT_URL IS: " + process.env.ROOT_URL);
console.log("PORT: " + process.env.PORT);
console.log("BIND_IP: " + process.env.BIND_IP);
console.log("DDP_URL: " + process.env.DDP_DEFAULT_CONNECTION_URL);
console.log("************ Meteor Env is ready ************");


require('./bundle/main.js');