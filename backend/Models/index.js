//Import sequelize
const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');

//Import configuration file
const config = require('../db.config');

//Create sequelize instance
const sequelizeInstance = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});

//Create database wrapper object
const database = {}

//Save sequelize for later import
database.Sequelize = Sequelize;
database.sequelize = sequelizeInstance;

//Create model
database.User = require('./user.model')(sequelizeInstance, Sequelize);
database.Collection = require('./collection.model')(sequelizeInstance, Sequelize);
database.Card = require('./card.model')(sequelizeInstance, Sequelize);

//Create one-to-many relationship from user to collection
database.User.hasMany(database.Collection, {
    as: "collections"
});

database.Collection.belongsTo(database.User, {
    foreignKey: "userId",
    as: "user"
});

//Create one-to-many relationship from collection to cards
database.Collection.hasMany(database.Card, {
    as: "card"
});

database.Card.belongsTo(database.Collection, {
    foreignKey: "collectionId",
    as: "collection"
})

//Export database
module.exports = database;