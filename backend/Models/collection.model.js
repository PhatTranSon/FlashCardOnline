module.exports = (sequelize, Sequelize) => {
    //Define model
    const Collection = sequelize.define('collection', {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Collection;
}