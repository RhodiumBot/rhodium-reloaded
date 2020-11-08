const express = require('express');
const centra  = require('@aero/centra');
const client  = require('../../main.js');
const router  = express.Router();
const { Op }  = require('sequelize');  

router.get('/*', (req, res, next) => {
   if(req.session.loggedIn) return next();
   res.redirect('/auth/login');
});

router.get(['/', '/guilds'], (req, res) => {

    centra('https://discord.com/api/users/@me/guilds')
    .header('authorization', req.session.token.token_type + ' ' + req.session.token.access_token)
    .send().then(async guilds => {
        if(guilds.statusCode === 200){
            let data = await JSON.parse(guilds.body.toString());

            // Parse all Guild IDs into an array
            
            let allIDs = [];
            data.forEach(async (g, i) => {
                allIDs.push(g.id);
            });

            client.db.models.Guild.findAll({
                where:{
                    id: {
                        [Op.or]: allIDs
                    }
                }
            }).then(g => {
                let guildsManaged = [];

                g.forEach(gu => {
                    guildsManaged.push(client.guilds.resolve(gu.dataValues.id));
                    data = data.filter(o => {
                        return o.id !== gu.id;
                    });
                });

                return res.render('layouts/master', {
                    header: 'dash',
                    body: 'dash/guilds',
                    managed: guildsManaged,
                    unmanaged: data
                });
            }).catch(err => {
                client.log.err(err, err)
            })
        }
        else return res.render('layouts/master', {
            header: 'empty',
            body: 'error',
            title: 'Guild fetch error',
            description: 'There was an error fetching your guilds from Discord. Please try again.'
        });
    });
});

router.get('/guild/*', (req, res) => {
    let guild = client.guilds.cache.get(req.params[0])
    console.log(guild)
    if(guild) 
        return res.render('layouts/master', {
            header: 'dash',
            body: 'dash/guild',
            guild
        });
    
    res.render('layouts/master', {
        header: 'empty',
        body: 'error',
        title: 'Guild fetch error',
        description: 'A guild with this ID could not be found.'
    });
});


module.exports = router;