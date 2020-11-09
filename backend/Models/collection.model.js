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
        color: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "e63946",
            validate: {
                len: [6, 6]
            }
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Collection;
}