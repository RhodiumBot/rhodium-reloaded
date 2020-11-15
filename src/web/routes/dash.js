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

            client.db.models.Guild.findAll({
                where:{
                    id: {
                        [Op.or]: data.map(d => d.id) // Get all shared Guilds
                    }
                }
            }).then(g => {
                let guildsManaged = [],
                    guildsRegistered = [];

                g.forEach(gu => {
                    if(!client.guilds.resolve(gu.dataValues.id)) return;

                    if(!gu.dataValues.managed) guildsRegistered.push(client.guilds.resolve(gu.dataValues.id));
                    else guildsManaged.push(client.guilds.resolve(gu.dataValues.id));
                    data = data.filter(o => {
                        return o.id !== gu.id;
                    });
                });

                return res.render('layouts/master', {
                    header: 'dash',
                    body: 'dash/guilds',
                    managed: guildsManaged,
                    registered: guildsRegistered,
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

router.get('/guild/*/*', (req, res) => {
    let guild = client.guilds.resolve(req.params[0]);
    let modules = require('../../config/modules.json');
    
    if(guild){

        guild.members.fetch(req.session.data.id).then(member => {

            if(!member) return res.render('layouts/master', {
                header: 'empty',
                body: 'error',
                title: 'Access permission error',
                description: 'You are not on this guild.'
            });
    
            if(!(modules[req.params[1]].permissions === 'NONE' || member.permissions.has(modules[req.params[1]].permissions))) return res.render('layouts/master', {
                header: 'empty',
                body: 'error',
                title: 'Access permission error',
                description: 'You don\'t have sufficient permissions to access this section.'
            });
    
            client.db.models.Guild.findOne({
                where:{
                    id: guild.id,
                },
                include: client.db.models.Welcomer
            }).then(db => {
                return res.render('layouts/master', {
                    header: 'dash',
                    body: 'dash/guild',
                    guild,
                    db,
                    member,
                    modules,
                    settings: req.params[1] || 'info'
                });
            }).catch(err => {
                res.render('layouts/master', {
                    header: 'empty',
                    body: 'error',
                    title: 'Guild fetch error',
                    description: 'There was an error fetching the data for this guild. Try again later.'
                });
            });

        });
    } 

    else res.render('layouts/master', {
        header: 'empty',
        body: 'error',
        title: 'Guild fetch error',
        description: 'A guild with this ID could not be found.'
    });
});

router.get('/guild/*', (req, res) => {
    let guild = client.guilds.resolve(req.params[0]);
    let modules = require('../../config/modules.json');
    
    if(guild){
        
        guild.members.fetch(req.session.data.id).then(member => {

            if(!member) return res.render('layouts/master', {
                header: 'empty',
                body: 'error',
                title: 'Access permission error',
                description: 'You are not on this guild.'
            });

            client.db.models.Guild.findOne({
                where:{
                    id: guild.id
                }
            }).then(db => {
                return res.render('layouts/master', {
                    header: 'dash',
                    body: 'dash/guild',
                    guild,
                    db,
                    member,
                    modules,
                    settings: 'info'
                });
            }).catch(err => {
                res.render('layouts/master', {
                    header: 'empty',
                    body: 'error',
                    title: 'Guild fetch error',
                    description: 'There was an error fetching the data for this guild. Try again later.'
                });
            });
        });
    } 

    else res.render('layouts/master', {
        header: 'empty',
        body: 'error',
        title: 'Guild fetch error',
        description: 'A guild with this ID could not be found.'
    });
});


module.exports = router;