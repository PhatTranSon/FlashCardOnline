const database = require('../Models');
const sequelize = database.sequelize;
const Sequelize = database.Sequelize;
const { Op } = Sequelize;

const Score = database.Score;
const Collection = database.Collection;

//Controller methods for test
const getAllTestResults = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Find all latest test results
    Score
        .findAll({
            where: {
                userId
            },
            group: [sequelize.col('score.userId'), sequelize.col('score.collectionId')],
            attributes: [[sequelize.fn('max', sequelize.col('score.id')), 'id']],
        })
        .then((latestScores) => {
            //Map the scores to id only
            const maxIds = latestScores.map(score => {
                return score.dataValues.id;
            });

            return Score.findAll({
                where: {
                    id: {
                        [Op.in]: maxIds
                    },
                },
                attributes: {
                    include: [[sequelize.fn('date_format', sequelize.col('score.createdAt'), '%Y/%m/%d'), 'createdAt']]
                },
                include: [
                    {
                        model: Collection
                    }
                ]
            });
        })
        .then(results => {
            //Respond
            resp.json(results);
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);

            //Respond
            resp.status(500).json({
                messsage: "Error getting test results"
            });
            resp.end();
        });
}

const getTestResult = (req, resp) => {
    //Get the userId
    const userId = req.user.id;

    //Get the collection id
    const collectionId = req.params.collectionId;

    //Find all scores of the user
    Score
        .findAll({
            where: {
                userId,
                collectionId
            },
            attributes: {
                include: [[sequelize.fn('date_format', sequelize.col('score.createdAt'), '%Y/%m/%d'), 'createdAt']]
            }
        })
        .then(scores => {
            //Respond
            resp.json(scores);
            resp.end();
        })  
        .catch(error => {
            //Debug
            console.log(error);
            //With error
            resp.status(500).json({
                message: "Error getting results"
            });
            resp.end();
        });
}

const postTestResult = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get collection id
    const { collectionId } = req.params;

    //Get the correct questions and total questions
    const { rightQuestions, totalQuestions } = req.body;

    //Insert into table
    Score
        .create({
            userId,
            collectionId,
            rightQuestions,
            totalQuestions
        })
        .then(score => {
            //Map to get the id
            return score.id;
        })
        .then(id => {
            return Score.findOne({
                where: {
                    id
                },
                attributes: {
                    include: [
                        [sequelize.fn('date_format', sequelize.col('score.createdAt'), '%Y/%m/%d'), 'createdAt']
                    ]
                }
            });
        })
        .then(score => {
            //Respond
            resp.json({
                message: "Successfully submitted score",
                ...score.dataValues
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error adding score"
            });
        });
}

module.exports = {
    getAllTestResults,
    getTestResult,
    postTestResult
}