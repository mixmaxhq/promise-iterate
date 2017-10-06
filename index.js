const semver = require('semver');

let main;
if (semver.lt(process.version, '7.6.0')) {
  main = require('./dist/node/index.js');
} else {
  main = require('./src/index.js');
}
module.exports = main;
