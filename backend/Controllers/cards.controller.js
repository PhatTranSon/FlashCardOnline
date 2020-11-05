//Import database
const database = require('../Models/');
const Card = database.Card;
const Collection = database.Collection;

//Func to perform CRUD operations on Card
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
                            title: card.title,
                            phonetic: card.phonetic,
                            description: card.description
                        });
                        resp.end();
                    })
                    .catch(error => {
                        console.log(error);
                        resp.status(500).json({
                            message: "Error creating card"
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
                                console.log(error);
                                resp.status(500).json({
                                    message: "Error updating card"
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

exports.viewAllCards = (req, resp) => {
    //Get the collection id from body
    const { collectionId } = req.body;

    //Collect all cards which belong to the collections
    Card
        .findAll({
            where: {
                collectionId
            }
        })
        .then(cards => {
            resp.json({
                cards
            });
            resp.end();
        })
        .catch(error => {
            console.log(error);
            resp.status(500).json({
                message: "Error retrieving card"
            });
            resp.end();
        });
}