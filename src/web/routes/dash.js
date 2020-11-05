const express = require('express');
const centra  = require('@aero/centra');
const client = require('../../main.js');
const router  = express.Router();
const config  = require('./../../main.js').config;

router.get('/*', (req, res, next) => {
   if(req.session.loggedIn) return next();
   res.redirect('/auth/login');
});

router.get(['/', '/guilds'], (req, res) => {
    return res.render('layouts/master', {
        header: 'dash',
        body: 'dash/guilds'
    });
});


module.exports = router;