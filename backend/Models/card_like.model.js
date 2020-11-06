const { Sequelize } = require("sequelize/types");
const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    //Create like model
    const CardLike = sequelize.define('card_like', {});

    //Return model
    return CardLike;
}