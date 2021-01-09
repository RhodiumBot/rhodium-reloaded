const { enable } = require('colors');
const express = require('express');
const client  = require('../../main.js');
const router  = express.Router();

router.post('/modules/modify/welcomer', function(req, res, next) {
    client.db.models.Guild.findOne({
        where:{
            id: req.body.guildID,
        },
        include: client.db.models.Welcomer
    }).then(db => {
        console.log(db)

        if(
            typeof req.body.enabled === 'boolean' && 
            typeof req.body.channel === 'string' && 
            typeof req.body.messageJoin === 'string' && 
            typeof req.body.messageLeave === 'string' && 
            typeof req.body.enabledPrivate === 'boolean' && 
            typeof req.body.messagePrivate === 'string'
        ){

            if(
                req.body.channel.length < 32 &&
                req.body.messageJoin.length < 2000 && 
                req.body.messageLeave.length < 2000 && 
                req.body.messagePrivate.length < 2000
            ){

                client.db.models.Welcomer.update(
                    {
                        enabled : req.body.enabled,
                        channel : req.body.channel,
                        messageJoin : req.body.messageJoin,
                        messageLeave : req.body.messageLeave,
                        enabledPrivate : req.body.enabledPrivate,
                        messagePrivate : req.body.messagePrivate
                    },
                    {
                        returning: true, 
                        where: { GuildId: req.body.guildID }
                    }
                ).then(wel => {
                    res.sendStatus(200);

                }).catch(err => {
                    res.sendStatus(500);
                });

            }
            else return res.sendStatus(413);

        }
        else return res.sendStatus(420);

    }).catch(err => {
        res.sendStatus(500);
    });
});

module.exports = router;