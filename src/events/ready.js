module.exports = client => {
    client.log.verb('Client ready');
    client.log.log('Client logged in');
    client.log.log('Client username: ' + client.user.username);
    client.log.log('Client ID:       ' + client.user.id);

    let webApp = require('./../web/webManager.js');
}