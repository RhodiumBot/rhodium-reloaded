// Import dependencies
const express = require('express');
const session = require('express-session');
const path    = require('path');
const http    = require('http');
let client    = require('./../main.js');


// Set up express

client.log.verb('Starting up express');
let app = express();
app.set('port', client.config.webinterface.port);


// Create http server

client.log.verb('Starting up HTTP Server');
let server = http.createServer(app);

server.listen(client.config.webinterface.port);

server.on('listening', () => {
  client.log.log('HTTP Server: Listening');
  client.log.log('HTTP Server: Port Number ' + client.config.webinterface.port);
});

server.on('error', err => {
  switch (err.code){
    case 'EACCES':
      client.log.err('Missing permissions to bind port');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      client.log.err('Cannot bind port: Address already in use :' + client.config.webinterface.port);
      process.exit(1);
      break;

    default:
      throw err;
  }
});


// Set up view engine

app.set('views', path.join(__dirname, 'components'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Set up express sessions

app.set('trust proxy', 1);
app.use(session({
  secret: 'RhodiumSuperSecretCookiePassphrase',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// Set up routing initialization

app.use(function(req,res,next){
  client.log.verb('Express: Request received');
  client.log.verb(`Express: Serving request ${req.url} to ${ req.ip }`);
  // NOTE: Use res.locals here to get session data into views
  next();
});


// Add routers & define routing paths

client.log.verb('Express: Routers Initializing');
const indexRouter   = require('./routes/index.js'); // Index and main subpages
const apiRouter     = require('./routes/api.js');   // routes for the web API /api
const adminRouter   = require('./routes/admin.js'); // Admin interface routes. Will check for permissions

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);



module.exports = app;