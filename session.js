var session = require('client-sessions');

module.exports = session({
  cookieName: 'session',
  secret: 'sadasdasdasd',
  duration: 30*60*1000,
  activeDuration: 5*60*1000
});