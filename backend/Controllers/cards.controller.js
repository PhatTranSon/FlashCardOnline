//Import database
const { response } = require('express');
const database = require('../Models/');
const Card = database.Card;
const Collection = database.Collection;
const CardLike = database.CardLike;
const User = database.User;

const { ValidationError } = database.Sequelize;

const sequelize = database.sequelize;

//Helper methods to get cards along likes
function getAllCardsLikeCount(collectionId) {
    let cardsLikesCounted = Card
    .findAll(
        {
            where: {
                collectionId
            },
            include: [
                {
                    //Check if user liked or not
                    model: User,
                    attributes: [],
                    through: {
                        attributes: ["createdAt"]
                    },
                    required: false
                }
            ],
            attributes: {
                include: [
                    [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "likes"]
                ]
            },
            group: ['card.id']
        }
    );

    return cardsLikesCounted;
}

function getAllCardsCheckLiked(collectionId, userId) {
    let cardsLikeChecked = Card
    .findAll(
        {
            where: {
                collectionId
            },
            include: [
                {
                    //Check if user liked or not
                    model: User,
                    where: {
                        id: userId
                    },
                    attributes: [],
                    through: {
                        attributes: ["createdAt"]
                    },
                    required: false
                }
            ],
            attributes: {
                include: [
                    [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "liked"]
                ]
            },
            group: ['card.id']
        }
    );

    return cardsLikeChecked;
}

//Func to get all cards from collection -> Logged in case
function viewAllCardsFromCollectionLoggedIn(req, resp) {
    //Get the collection id from body
    const { collectionId } = req.body;
    const userId = req.user.id;

    //Collect all cards which belong to the collections
    Promise.all([getAllCardsCheckLiked(collectionId, userId), getAllCardsLikeCount(collectionId)])
        .then(response => {
            //Expand
            const [checkLiked, countLikes] = response;

            //Combine the data
            const results = [];

            //Aggregate data
            //Merge objects from 2 arrays
            checkLiked.forEach((checkedLikeRow, index) => {
                //Get the count like row
                let countedLikesRow = countLikes[index];

                //Create new object and add to result
                results.push(
                    {
                        id: checkedLikeRow.dataValues.id,
                        title: checkedLikeRow.dataValues.title,
                        phonetic: checkedLikeRow.dataValues.phonetic,
                        description: checkedLikeRow.dataValues.description,
                        createdAt: checkedLikeRow.dataValues.createdAt,
                        updatedAt: checkedLikeRow.dataValues.updatedAt,
                        liked: checkedLikeRow.dataValues.liked,
                        likes: countedLikesRow.dataValues.likes
                    }
                );
            });

            //Respond with data
            resp.json({
                cards: results
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting cards"
            });
            resp.end();
        });
}

//Func to get all cards from collection -> Not logged in case
function viewAllCardsFromCollectionNotLoggedIn(req, resp) {
    //Get the collection id from body
    const { collectionId } = req.body;

    //Collect all cards which belong to the collections
    getAllCardsLikeCount(collectionId)
        .then(results => {
            //Respond with data
            resp.json({
                cards: results
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting cards"
            });
            resp.end();
        });
}

//Func to get all cards -> Logged in case
function viewAllCardsLoggedIn(req, resp) {
    //Get user id
    const userId = req.user.id;

    let cardsLikesCounted = Card
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [],
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "likes"]
                    ]
                },
                order: sequelize.literal("likes DESC"),
                group: ['card.id']
            }
        );

    let cardsLikeChecked = Card
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id: userId
                        },
                        attributes: [],
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "liked"]
                    ]
                },
                group: ['card.id']
            }
        );

    Promise.all([cardsLikeChecked, cardsLikesCounted])
        .then(response => {
            //Expand
            const [checkLiked, countLikes] = response;

            //Combine the data
            const results = [];

            //Aggregate data
            //Merge objects from 2 arrays
            countLikes.forEach((countedLikesRow, index) => {
                //Find index
                let matchedIndex = checkLiked.findIndex(item => item.dataValues.id === countedLikesRow.dataValues.id);

                //Get the count like row
                let checkedLikeRow = checkLiked[matchedIndex];

                //Create new object and add to result
                results.push(
                    {
                        id: checkedLikeRow.dataValues.id,
                        title: checkedLikeRow.dataValues.title,
                        phonetic: checkedLikeRow.dataValues.phonetic,
                        description: checkedLikeRow.dataValues.description,
                        createdAt: checkedLikeRow.dataValues.createdAt,
                        updatedAt: checkedLikeRow.dataValues.updatedAt,
                        liked: checkedLikeRow.dataValues.liked,
                        likes: countedLikesRow.dataValues.likes,
                        color: checkedLikeRow.dataValues.color
                    }
                );
            });

            //Respond with data
            resp.json({
                cards: results
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting cards"
            });
            resp.end();
    });
}

//Func to get all cards -> Not logged in case
function viewAllCardsNotLoggedIn(req, resp) {
    let cardsLikesCounted = Card
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [],
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "likes"]
                    ]
                },
                group: ['card.id']
            }
        );

    cardsLikesCounted
            .then(cards => {
                resp.json({
                    cards
                });
            })
            .catch(error => {
                //Debug
                console.log(error);
                resp.status(500).json({
                    message: "Error getting cards"
                });
                resp.end();
            });
}

//Func to perform CRUD operations on Card
exports.viewAllCards = (req, resp) => {
    if (req.user) {
        viewAllCardsLoggedIn(req, resp);
    } else {
        viewAllCardsNotLoggedIn(req, resp);
    }
}

//Func to view all liked cards
exports.viewAllLikedCards = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    let cardsLikesCounted = Card
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id: userId
                        },
                        attributes: [],
                        required: true
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "likes"]
                    ]
                },
                group: ['card.id']
            }
        );

    //Get cards and respond
    cardsLikesCounted
        .then(cards => {
            //Map
            cards = cards.map(card => {
                return {
                    ...card.dataValues,
                    liked: 1
                }
            })

            //Respond
            resp.json({
                cards
            });
            resp.send();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting cards"
            });
        });
}

exports.viewAllCardsFromCollections = (req, resp) => {
    if (req.user) {
        viewAllCardsFromCollectionLoggedIn(req, resp);
    } else {
        viewAllCardsFromCollectionNotLoggedIn(req, resp);
    }
}

//Helper function to retrieve cards that belongs to a user

exports.viewAllCardsFromUser = (req, resp) => {
    //This is fundamentally wrong
    //Get user id
    const userId = req.user.id;

    //Get the cards with user id
    let cardsLikesCounted = Card
        .findAll(
            {
                where: {
                    userId
                },
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [],
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "likes"]
                    ]
                },
                order: sequelize.literal("likes DESC"),
                group: ['card.id']
            }
        );

    let cardsLikeChecked = Card
        .findAll(
            {
                where: {
                    userId
                },
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id: userId
                        },
                        attributes: [],
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "liked"]
                    ]
                },
                group: ['card.id']
            }
        );

    Promise.all([cardsLikeChecked, cardsLikesCounted])
        .then(response => {
            //Expand
            const [checkLiked, countLikes] = response;

            //Combine the data
            const results = [];

            //Aggregate data
            //Merge objects from 2 arrays
            countLikes.forEach((countedLikesRow, index) => {
                //Find index
                let matchedIndex = checkLiked.findIndex(item => item.dataValues.id === countedLikesRow.dataValues.id);

                //Get the count like row
                let checkedLikeRow = checkLiked[matchedIndex];

                //Create new object and add to result
                results.push(
                    {
                        id: checkedLikeRow.dataValues.id,
                        title: checkedLikeRow.dataValues.title,
                        phonetic: checkedLikeRow.dataValues.phonetic,
                        description: checkedLikeRow.dataValues.description,
                        createdAt: checkedLikeRow.dataValues.createdAt,
                        updatedAt: checkedLikeRow.dataValues.updatedAt,
                        liked: checkedLikeRow.dataValues.liked,
                        likes: countedLikesRow.dataValues.likes,
                        color: checkedLikeRow.dataValues.color
                    }
                );
            });

            //Respond with data
            resp.json({
                cards: results
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting cards"
            });
            resp.end();
    });
}

//Helper function to extract validation error
function extractCardValidationMessage(e) {
    //Get only the first error key
    const errorKey = e.errors[0].validatorKey;
    //console.log(errorKey);

    //Check the key
    if (errorKey === 'notEmpty') {
        return "Card's title should not be empty";
    } else if (errorKey === 'len') {
        return "Color must be a valid hex value";
    } else if (errorKey === 'is_null') {
        return "Please fill in all the fields: title and color";
    } else {
        return "Something went wrong. Try again";
    }
}

exports.createNewCard = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get the collection id
    const { collectionId, title, phonetic, description, color } = req.body;

    //Check if user has authority over collection
    Collection
        .findOne({
            where: {
                id: collectionId
            }
        })
        .then(collection => {
            //Check the user id
            if (collection.userId === userId) {
                //Create new card
                const data = {
                    collectionId,
                    title, 
                    phonetic, 
                    description,
                    color,
                    userId
                };

                Card.create(data)
                    .then(card => {
                        //Response
                        resp.json({
                            message: "Successfully created card",
                            id: card.id,
                            title: card.title,
                            phonetic: card.phonetic,
                            description: card.description,
                            color: card.color,
                            liked: 0,
                            likes: 0
                        });
                        resp.end();
                    })
                    .catch(error => {
                        //Check validation error
                        if (error instanceof ValidationError) {
                            //Extract message
                            const message = extractCardValidationMessage(error);
                            
                            //Respond
                            resp.status(500).json({
                                message
                            });
                            resp.end();
                        } else {
                            //Debug
                            console.log(error);
                            resp.status(500).json({
                                message: "Error creating collection"
                            });
                            resp.end();
                        }
                    });
            } else {
                resp.status(403).json({
                    message: "Unauthorized"
                });
                resp.end();
            }
        })
        .catch(error => {
            console.log(error);
            resp.status(500).json({
                message: "Error creating card"
            });
            resp.end();
        });
}

exports.updateCard = (req, resp) => {
    //Get the card id
    const { id, title, phonetic, description, color } = req.body;

    //Get the card
    Card
        .findOne({
            where: {
                id
            }
        })
        .then(card => {
            if (card.userId === req.user.id) {
                //Update
                card.title = title;
                card.phonetic = phonetic;
                card.description = description;
                card.color = color;

                //Save
                card.save()
                    .then(newCard => {
                        resp.json({
                            message: "Successfully updated card",
                            title: newCard.title,
                            phonetic: newCard.phonetic,
                            description: newCard.description,
                            color: newCard.color
                        });
                        resp.end();
                    })
                    .catch(error => {
                        //Check validation error
                        if (error instanceof ValidationError) {
                            //Extract message
                            const message = extractCardValidationMessage(error);
                            
                            //Respond
                            resp.status(500).json({
                                message
                            });
                            resp.end();
                        } else {
                            //Debug
                            console.log(error);
                            resp.status(500).json({
                                message: "Error creating collection"
                            });
                            resp.end();
                        }
                    });
            } else {
                resp.status(403).json({
                    message: "Unauthorized"
                });
                resp.end();
            }
        })
        .catch(error => {
            console.log(error);
            resp.status(500).json({
                message: "Error creating card"
            });
            resp.end();
        });
}

exports.deleteCard = (req, resp) => {
    //Get the card id
    const { id } = req.body;

    //Get the card
    Card
        .findOne({
            where: {
                id
            }
        })
        .then(card => {
            if (card.userId === req.user.id) {
                //Delete card
                card.destroy()
                    .then(data => {
                        resp.json({
                            message: "Successfully deleted card"
                        });
                        resp.end();
                    })
                    .catch(error => {
                        console.log(error);
                        resp.status(500).json({
                            message: "Error deleting card"
                        });
                        resp.end();
                    });
            } else {
                resp.status(403).json({
                    message: "Unauthorized"
                });
                resp.end();
            }
        })
        .catch(error => {
            console.log(error);
            resp.status(500).json({
                message: "Error deleting card"
            });
            resp.end();
        });
}

exports.likeCard = (req, resp) => {
   //Get user id
   const userId = req.user.id;

   //Get collection id through body
   const { cardId } = req.body;

   //Check if user has liked post already
    CardLike
       .findOne({
           where: {
               userId,
               cardId
           }
       })
       .then(like => {
           if (like) {
               //User already like the collection -> Through error
               resp.status(403).json({
                   message: "Card already liked"
               });
               resp.end();
           } else {
               //Create new like
               const data = {
                   userId, 
                   cardId
               };

               CardLike
                   .create(data)
                   .then(newLike => {
                       resp.json({
                           message: "Successfully liked card",
                           userId,
                           cardId
                       });
                       resp.end();
                   })
                   .catch(error => {
                       //Debug
                       console.log(error);
                       resp.status(500).json({
                           message: "Error liking card"
                       });
                       resp.end();
                   });
           }
       })
       .catch(error => {
           //Debug
           console.log(error);
           resp.status(500).json({
               message: "Error liking card"
           });
           resp.end();
       });
}

exports.unlikeCard = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get collection id through body
    const { cardId } = req.body;

    //Check if user has liked post already
    CardLike
        .findOne({
            where: {
                userId,
                cardId
            }
        })
        .then(like => {
            if (!like) {
                //User already like the collection -> Through error
                resp.status(403).json({
                    message: "Card is not yet liked"
                });
                resp.end();
            } else {
                like.destroy()
                    .then(data => {
                        resp.json({
                            message: "Successfully unliked card"
                        });
                        resp.end();
                    })
                    .catch(error => {
                        //Debug
                        console.log(error);
                        resp.status(500).json({
                            message: "Error unliking card"
                        });
                        resp.end();
                    });
            }
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error liking card"
            });
            resp.end();
        });
}