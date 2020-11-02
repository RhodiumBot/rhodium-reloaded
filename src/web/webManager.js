// Import dependencies
const express = require('express');
const session = require('express-session');
const path    = require('path');


// Set up express

let app = express();
// TODO: Get app port from client config and set app port through app.set('port', port)


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
    // NOTE: Use res.locals here to get session data into views
    next();
});


// Add routers & define routing paths

const indexRouter   = require('./routes/index.js'); // Index and main subpages
const apiRouter     = require('./routes/api.js');   // routes for the web API /api
const adminRouter   = require('./routes/admin.js'); // Admin interface routes. Will check for permissions

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);



module.exports = app;