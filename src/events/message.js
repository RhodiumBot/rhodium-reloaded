const djs = require('discord.js');

module.exports = (client, msg) => {
    if( msg.author.bot ) return;

    if( 
        msg.content === `<@${client.user.id}>` ||
        msg.content === `<@!${client.user.id}>`
    ) {
        let mEmb = new djs.MessageEmbed();

        mEmb.setTitle('Welcome to Rhodium');
        mEmb.setDescription('Rhodium is a bot that is based all around web.\nWhy configure a bot through complicated text messages, when web dashboards exist?');
        mEmb.addField('Get Started', `To get started with the webinterface, follow [this link](https://${ client.config.webinterface.localAddress }${ (client.config.webinterface.port && client.config.webinterface.port != 80) ? ':' + client.config.webinterface.port : '' }).`);
        mEmb.setFooter('Thank you for choosing Rhodium.');
        mEmb.setThumbnail('https://cdn.discordapp.com/avatars/455392659096207370/fc800d2d6f6cca8c790e23883be6a847.png?size=128');

        msg.channel.send(mEmb);
    }
}