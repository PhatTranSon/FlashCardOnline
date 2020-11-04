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

//Export database
module.exports = database;