const { DataTypes, Model } = require('sequelize');

class Welcomer extends Model {};
class Guild extends Model {};

module.exports = (sequelize, client) => {

    client.log.log('Initializing database models');

    Welcomer.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        messageJoin: DataTypes.TEXT,
        messageLeave: DataTypes.TEXT,
        channel: DataTypes.STRING(18),
        enabledPrivate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        messagePrivate: DataTypes.TEXT
    }, {
        sequelize,
        modelName : 'Welcomer'
    });

    Guild.init({
        id: {
            type: DataTypes.STRING(18), // Yes, this has to be a string
            primaryKey: true
        },
        managed: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName : 'Guild',
        hooks: {
            afterCreate: (guild, m) => {
                Welcomer.create({
                    enabled: true,
                    GuildId: guild.id
                });
            }
        }
    });

    Guild.hasOne(Welcomer);

    client.log.log('Syncing database models');
-
    sequelize.sync().then(() => {
        client.log.log('Database sync success');
    }).catch(err => {
        client.log.err('Database sync failed');
        throw err;
    });

}