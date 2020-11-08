const express = require('express');
const centra  = require('@aero/centra');
const client = require('../../main.js');
const router  = express.Router();

router.get('/*', (req, res, next) => {
   if(req.session.loggedIn) return next();
   res.redirect('/auth/login');
});

router.get(['/', '/guilds'], (req, res) => {

    centra('https://discord.com/api/users/@me/guilds')
    .header('authorization', req.session.token.token_type + ' ' + req.session.token.access_token)
    .send().then(async guilds => {
        if(guilds.statusCode === 200){
            // TODO: Leftoff here
            let data = await JSON.parse(guilds.body.toString());

            client.db.models.Guild.findOne({
                where:{
                    id: '510821805108232193'
                },
                include: [{model: client.db.models.Welcomer}]
            }).then(([g, l]) => {
                client.log.log('GUILD FOUND ' + g.welcomer)
            }).catch(err => {
                client.log.err(err)
            })

            let guildsManaged = [];
            /*await data.forEach(async (g, i) => {
                try{
                    await client.guilds.fetch(g.id);
                    if(client.guilds.cache.has(g.id)) {
                        await guildsManaged.push(g);
                        data.splice(i, 1);
                    }
                }
                catch (err) {
                    client.log.warn('Guild fetch failed for guild ' + g.id);
                }
            });*/

            return res.render('layouts/master', {
                header: 'dash',
                body: 'dash/guilds',
                managed: guildsManaged,
                unmanaged: data
            });
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