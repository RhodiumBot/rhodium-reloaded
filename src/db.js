// Setting up the database connection

module.exports = client => {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host     : '127.0.0.1',
            user     : 'your_database_user',
            password : 'your_database_password',
            database : 'myapp_test',
            charset  : 'utf8'
        }
    })
    const bookshelf = require('bookshelf')(knex)
    
    // Defining models
    const User = bookshelf.model('User', {
    tableName: 'users'
    })
}