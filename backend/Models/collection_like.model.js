module.exports = (sequelize, Sequelize) => {
    //Create a junction table model
    const CollectionLike = sequelize.define('collection_like', {});

    //Return model
    return CollectionLike;
}