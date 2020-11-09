module.exports = (sequelize, Sequelize) => {
    //Define model
    const Card = sequelize.define('card', {
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
        phonetic: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    //Return the model
    return Card;
}