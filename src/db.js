const { Sequelize } = require('sequelize');


// Setting up the database connection

module.exports = client => {
    client.log.verb('Initiating DB connection');
    
    // Option 2: Passing parameters separately (other dialects)
    const sequelize = new Sequelize(client.config.database.name, client.config.database.user, client.config.database.password, {
      host: client.config.database.url,
      port: client.config.database.port,
      dialect: 'mysql',
      logging: log => client.log.db(log)
    });

    try {
        sequelize.authenticate().then( () => {
            client.log.log('Database connection success');
        });
    } catch (error) {
        client.log.err('Database connection failed. See below for details');
        throw error;
    }


    // Define Models

    require('./models.js')(sequelize, client);
    
    return sequelize;
}