module.exports = (sequelize, Sequelize) => {
    //Create score model
    const Score = sequelize.define('score', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rightQuestions: {
            type: Sequelize.INTEGER
        },
        totalQuestions: {
            type: Sequelize.INTEGER
        }
    });

    //Return the modal
    return Score;
}