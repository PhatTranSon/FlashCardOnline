module.exports = (sequelize, Sequelize) => {
    //Create like model
    const CardLike = sequelize.define('card_like', {});

    //Return model
    return CardLike;
}