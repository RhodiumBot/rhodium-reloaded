const express = require('express');
const router  = express.Router();

router.get('/login', function(req, res, next) {
    let client = require('./../../main.js');
    if(req.session.loggedIn) return res.redirect('/guilds');
    res.render('layouts/master', { body: 'auth/login', header: 'empty', link: client.config.oauth.oauthURL });
});

module.exports = router;