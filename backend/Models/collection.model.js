module.exports = (sequelize, Sequelize) => {
    //Define model
    const Collection = sequelize.define('collection', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Collection;
}