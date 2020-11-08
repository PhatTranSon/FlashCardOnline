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