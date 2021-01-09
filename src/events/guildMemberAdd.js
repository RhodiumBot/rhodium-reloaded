const djs = require('discord.js');

module.exports = (client, member) => {
    client.db.models.Guild.findOne({
        where:{
            id: member.guild.id
        },
        include: [{model: client.db.models.Welcomer}]
    }).then(g => {
        if(
            g.dataValues.managed &&
            g.dataValues.Welcomer.enabled &&
            g.dataValues.Welcomer.messageJoin && 
            g.dataValues.Welcomer.channel
        ) {
            let joinString = g.dataValues.Welcomer.messageJoin
                .replace(/::NAME::/g, member.user.username)
                .replace(/::TAG::/g, member.user.discriminator)
                .replace(/::ID::/g, member.user.id)
                .replace(/::CREATED::/g, member.user.createdAt)
                .replace(/::MENT::/g, member.user)
                .replace(/::COUNT::/g, member.guild.memberCount)
                .replace(/::GUILD::/g, member.guild.name);
    
            member.guild.channels.resolve(g.dataValues.Welcomer.channel).send(joinString)
        }
        if(
            g.dataValues.managed &&
            g.dataValues.Welcomer.enabledPrivate &&
            g.dataValues.Welcomer.messagePrivate
        ) {
            let joinString = g.dataValues.Welcomer.messageJoin
                .replace(/::NAME::/g, member.user.username)
                .replace(/::TAG::/g, member.user.discriminator)
                .replace(/::ID::/g, member.user.id)
                .replace(/::CREATED::/g, member.user.createdAt)
                .replace(/::COUNT::/g, member.guild.memberCount)
                .replace(/::GUILD::/g, member.guild.name);
    
            member.send(joinString);
        }
    });
}