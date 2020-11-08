//Import database
const database = require('../Models/');
const Card = database.Card;
const Collection = database.Collection;
const CardLike = database.CardLike;
const User = database.User;

const { ValidationError } = database.Sequelize;

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
                resp.send();
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
            resp.end();
        });
}

exports.viewAllCardsFromCollections = (req, resp) => {
    if (req.user) {
        viewAllCardsFromCollectionLoggedIn(req, resp);
    } else {
        viewAllCardsFromCollectionNotLoggedIn(req, resp);
    }
}

exports.viewAllCardsFromUser = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get cards
    let cardsLikesCounted = Card
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [],
                        where: {
                            id: userId
                        },
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

    //Repond
    cardsLikesCounted
        .then(cards => {
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
            resp.end();
        });
}

//Helper function to extract validation error
function extractCardValidationMessage(e) {
    //Get only the first error key
    const errorKey = e.errors[0].validatorKey;

    //Check the key
    if (errorKey === 'notEmpty') {
        return "Card's title should not be empty";
    } else {
        return "Please select another username";
    }
}

exports.createNewCard = (req, resp) => {
    //Get the collection id
    const { collectionId, title, phonetic, description } = req.body;

    //Check if user has authority over collection
    Collection
        .findOne({
            where: {
                id: collectionId
            }
        })
        .then(collection => {
            //Check the user id
            if (collection.userId === req.user.id) {
                //Create new card
                const data = {
                    collectionId,
                    title, 
                    phonetic, 
                    description
                };

                Card.create(data)
                    .then(card => {
                        //Response
                        resp.json({
                            message: "Successfully created card",
                            id: card.title,
                            title: card.title,
                            phonetic: card.phonetic,
                            description: card.description
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
    const { id, title, phonetic, description } = req.body;

    //Get the card
    Card
        .findOne({
            where: {
                id
            }
        })
        .then(card => {
            //Get the card collection
            Collection
                .findOne({
                    where: {
                        id: card.collectionId
                    }
                })
                .then(collection => {
                    if (collection.userId === req.user.id) {
                        //Update
                        card.title = title;
                        card.phonetic = phonetic;
                        card.description = description;
                        //Save
                        card.save()
                            .then(newCard => {
                                resp.json({
                                    message: "Successfully updated card",
                                    title: newCard.title,
                                    phonetic: newCard.phonetic,
                                    description: newCard.description
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
            //Get the card collection
            Collection
                .findOne({
                    where: {
                        id: card.collectionId
                    }
                })
                .then(collection => {
                    if (collection.userId === req.user.id) {
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