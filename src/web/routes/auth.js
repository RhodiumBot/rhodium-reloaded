const express = require('express');
const centra  = require('@aero/centra');
const client = require('../../main.js');
const router  = express.Router();
const config  = require('./../../main.js').config;

router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        return res.redirect('/dash/guilds');
    }
    res.render('layouts/master', { body: 'auth/login', header: 'empty', client_id: config.oauth.clientID, redirect_uri: config.oauth.redirectURI });
});

router.get('/discord', (req, res) => {
    centra('https://discord.com/api/oauth2/token', 'POST').body({
        'client_id': config.oauth.clientID,
        'client_secret': config.oauth.clientSecret,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': config.oauth.redirectURI,
        'scope': 'identify guilds'
    }, 'form').header('Content-Type', 'application/x-www-form-urlencoded').send().then(token => {
        if(token.statusCode === 200){
            token = JSON.parse(token.body.toString());

            centra('https://discord.com/api/users/@me')
            .header('authorization', token.token_type + ' ' + token.access_token)
            .send().then(userdata => {
                if(userdata.statusCode === 200){
                    // TODO: Leftoff here
                    let data = JSON.parse(userdata.body.toString());

                    req.session.loggedIn = true;
                    req.session.data = data;
                    req.session.token = token;

                    return res.redirect('/dash/guilds');
                }
                else return res.render('layouts/master', {
                    header: 'empty',
                    body: 'error',
                    title: 'Authorization failed.',
                    description: 'Discord didn\'t return Any user data. Please try again.'
                });
            });
        }
        else return res.render('layouts/master', {
            header: 'empty',
            body: 'error',
            title: 'Authorization failed.',
            description: 'Discord didn\'t return a token for the authorization flow. Please try again.'
        });
    });
});

module.exports = router;