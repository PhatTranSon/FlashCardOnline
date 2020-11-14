const database = require('../Models/index');
const Collection = database.Collection;
const CollectionLike = database.CollectionLike;
const User = database.User;
const Card = database.Card;

const { ValidationError } = database.Sequelize;

const sequelize = database.sequelize;

//Helpers function to count the number of likes and check if user has liked the post
function getAllCollectionsLikeCount(userId) {
    let collectionsLikesCounted = Collection
    .findAll(
        {
            where: {
                userId
            },
            include: [
                {
                    //Check if user liked or not
                    model: User,
                    attributes: [
                        "id"
                    ],
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
            group: ['collection.id']
        }
    );

    return collectionsLikesCounted;
}

function getAllCollectionsCheckLiked(userId) {
    let collectionsLikeChecked = Collection
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
                        attributes: [ "id", "name" ],
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
                group: ['collection.id']
            }
        );

    return collectionsLikeChecked;
}

//Method to get one collection using id
exports.getOneCollection = (req, resp) => {
    //Get the user id
    const userId = req.user.id;

    //Get the parameters
    const { collectionId } = req.params;

    //Create two promises
    const getCollectionWithLikes = Collection
        .findOne(
            {
                where: {
                    id: collectionId
                },
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [
                            "id"
                        ],
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
                group: ['collection.id']
            }
        );

    const getCollectionWithLiked = Collection
        .findOne(
            {
                where: {
                    id: collectionId
                },
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id: userId
                        },
                        attributes: [ "id", "name" ],
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
                group: ['collection.id']
            }
        );

    //Call promises
    Promise.all([getCollectionWithLikes, getCollectionWithLiked])
        .then(response => {
            //Expand
            const [collectionWithLikes, collectionWithLiked] = response;

            //Merge them
            const collection = {
                userId: collectionWithLiked.dataValues.userId,
                id: collectionWithLiked.dataValues.id,
                title: collectionWithLiked.dataValues.title,
                color: collectionWithLiked.dataValues.color,
                liked: collectionWithLiked.dataValues.liked,
                likes: collectionWithLikes.dataValues.likes,
                description: collectionWithLikes.dataValues.description
            }

            //Respond
            resp.json(collection);
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);

            //Reponse
            resp.status(500).json({
                message: "Error getting collection"
            });
        });
}

//Get all collections
exports.getAllCollections = (req, resp) => {
    if (req.user) {
        //console.log("LOGGED IN");
        getAllCollectionsLoggedIn(req, resp);
    } else {
        getAllCollectionsNotLoggedIn(req, resp);
    }
}

//Get all collections in the database -> For non-user
function getAllCollectionsNotLoggedIn(req, resp) {
    Collection
        .findAll(
            {
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
                group: ['collection.id']
            }
        )
        .then(collections => {
            //Serve result
            resp.json({
                collections
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting collections"
            });
            resp.end();
        });
}

//Get all collections in the database -> For non-user
function getAllCollectionsLoggedIn(req, resp) {
    //Get user id 
    let userId = req.user.id;

    let collectionsLikesCounted = Collection
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        attributes: [
                            "id"
                        ],
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
                order: sequelize.literal('likes DESC'),
                group: ['collection.id']
            }
        );

    let collectionsLikeChecked = Collection
        .findAll(
            {
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id: userId
                        },
                        attributes: [ "id", "name" ],
                        through: {
                            attributes: ["createdAt"]
                        },
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [database.sequelize.fn("COUNT", database.sequelize.col("users.id")), "liked"],
                    ]
                },
                group: ['collection.id']
            }
        );

    //Find all collections belong to the userId
    Promise
        .all([collectionsLikeChecked, collectionsLikesCounted])
        .then(response => {
            //Get the result
            const checkLiked = response[0];
            const countLikes = response[1];

            //Create an array to merge rows
            const results = [];

            //Merge objects from 2 arrays
            countLikes.forEach((countedLikesRow, index) => {
                //Find the index of the same id
                let matchedIndex = checkLiked.findIndex(item => item.dataValues.id === countedLikesRow.dataValues.id);

                //Get the count like row
                let checkedLikeRow = checkLiked[matchedIndex];

                //Create new object and add to result
                results.push(
                    {
                        id: checkedLikeRow.dataValues.id,
                        title: checkedLikeRow.dataValues.title,
                        description: checkedLikeRow.dataValues.description,
                        createdAt: checkedLikeRow.dataValues.createdAt,
                        updatedAt: checkedLikeRow.dataValues.updatedAt,
                        liked: checkedLikeRow.dataValues.liked,
                        likes: countedLikesRow.dataValues.likes,
                        color: checkedLikeRow.dataValues.color
                    }
                );
            });

            //Serve result
            resp.json({
                collections: results.slice(0, 7) //Get only 7 items [Need reimplementation]
            });
            resp.end();
        })
        .catch((error) => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting collections"
            });
            resp.end();
        });
}

//Get all collections belongs to a user
exports.getMyCollections = (req, resp) => {
    //Get user id
    const { id } = req.user;

    //Find all collections belong to the userId
    Promise
        .all([getAllCollectionsCheckLiked(id), getAllCollectionsLikeCount(id)])
        .then(response => {
            //Get the result
            const checkLiked = response[0];
            const countLikes = response[1];

            //Create an array to merge rows
            const results = [];

            //Merge objects from 2 arrays
            checkLiked.forEach((checkedLikeRow, index) => {
                //Get the count like row
                let countedLikesRow = countLikes[index];

                //Create new object and add to result
                results.push(
                    {
                        id: checkedLikeRow.dataValues.id,
                        title: checkedLikeRow.dataValues.title,
                        description: checkedLikeRow.dataValues.description,
                        createdAt: checkedLikeRow.dataValues.createdAt,
                        updatedAt: checkedLikeRow.dataValues.updatedAt,
                        liked: checkedLikeRow.dataValues.liked,
                        likes: countedLikesRow.dataValues.likes,
                        color: checkedLikeRow.dataValues.color
                    }
                );
            });

            //Serve result
            resp.json({
                collections: results
            });
            resp.end();
        })
        .catch((error) => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error getting collections"
            });
            resp.end();
        });
}

//Get liked collections
exports.getLikedCollections = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    Collection
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
                        through: {
                            attributes: ["createdAt"]
                        },
                        required: true //Inner join -> Get only the collections user liked
                    }
                ],
                group: ['collection.id']
            }
        )
        .then(collections => {
            //Map
            collections = collections.map(collection => {
                return {
                    ...collection.dataValues,
                    liked: 1
                }
            });

            //Serve result
            resp.json({
                collections
            });
            resp.end();
        })
        .catch(error => {
            console.log(error);
            resp.status(500).json({
                message: "Error getting collection"
            });
            resp.end();
        });
}

//Helper function to extract validation error
function extractCollectionValidationMessage(e) {
    //Get only the first error key
    const errorKey = e.errors[0].validatorKey;

    //Check the key
    if (errorKey === 'notEmpty') {
        return "Collection's title should not be empty";
    } else if (errorKey === 'len') {
        return "Collection's color must not be empty";
    } else {
        return "Please select another username";
    }
}

exports.createCollection = (req, resp) => {
    //Get data from request body
    const { id } = req.user;
    const { title, description, color } = req.body;

    //Create collection
    const collection = {
        userId: id,
        title,
        description,
        color
    }

    Collection.create(collection)
        .then(collection => {
            resp.json({
                message: "Successfully created collection",
                id: collection.id,
                title: collection.title,
                description: collection.description,
                color: collection.color,
                liked: 0,
                likes: 0
            });
            resp.end();
        })
        .catch(error => {
            //Check validation error
            if (error instanceof ValidationError) {
                //Extract message
                const message = extractCollectionValidationMessage(error);
                
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
}

exports.updateCollection = (req, resp) => {
    //Get data from request body
    const { id } = req.user;
    const { title, description, color } = req.body;

    //Get collection id from params
    const { collectionId } = req.params;

    Collection
        .findOne({
            where: {
                id: collectionId
            }
        })
        .then(collection => {
            //Check ownership
            if (id === collection.userId) {
                //Update collection
                collection.title = title;
                collection.description = description;
                collection.color = color;

                //Save
                collection.save()
                    .then(data => {
                        resp.json({
                            message: "Successfully modify collection",
                            id: data.id,
                            title: data.title,
                            description: data.description,
                            color: data.color
                        });
                    })
                    .catch(error => {
                        if (error instanceof ValidationError) {
                            //Extract message
                            const message = extractCollectionValidationMessage(error);
                            
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
                    message: "Not collection owner"
                });
                resp.end();
            }
        })
        .catch(error => {
            //Debug
            resp.status(500).json({
                message: "Error find collection"
            });
            resp.end();
        });
}

exports.deleteCollection = (req, resp) => {
    //Get collection id from params
    const { id } = req.user;
    const { collectionId } = req.params;

    Collection
        .findOne({
            where: {
                id: collectionId
            }
        })
        .then(collection => {
            if (id === collection.userId) {
                //Save
                collection.destroy()
                    .then(() => {
                        resp.json({
                            message: "Successfully deleted collection"
                        });
                    })
                    .catch(error => {
                        //Debug
                        console.log(error);
                        resp.status(500).json({
                            message: "Error deleting collection"
                        });
                        resp.end();
                    });
            } else {
                resp.status(403).json({
                    message: "Not collection owner"
                });
                resp.end();
            }
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error finding collection"
            });
            resp.end();
        });
}

//Function to like the collection
exports.likeCollection = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get collection id through body
    const { collectionId } = req.body;

    //Check if user has liked post already
    CollectionLike
        .findOne({
            where: {
                userId,
                collectionId
            }
        })
        .then(like => {
            if (like) {
                //User already like the collection -> Through error
                resp.status(403).json({
                    message: "Collection already liked"
                });
                resp.end();
            } else {
                //Create new like
                const data = {
                    userId, 
                    collectionId
                };

                CollectionLike
                    .create(data)
                    .then(newLike => {
                        resp.json({
                            message: "Successfully like collection",
                            userId,
                            collectionId
                        });
                        resp.end();
                    })
                    .catch(error => {
                        //Debug
                        console.log(error);
                        resp.status(500).json({
                            message: "Error liking collection"
                        });
                        resp.end();
                    });
            }
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error liking collection"
            });
            resp.end();
        });
}

//Function to like the collection
exports.unlikeCollection = (req, resp) => {
    //Get user id
    const userId = req.user.id;

    //Get collection id through body
    const { collectionId } = req.body;

    //Check if user has liked post already
    CollectionLike
        .findOne({
            where: {
                userId,
                collectionId
            }
        })
        .then(like => {
            if (!like) {
                //User already like the collection -> Through error
                resp.status(403).json({
                    message: "Collection is not yet liked"
                });
                resp.end();
            } else {
                like.destroy()
                    .then(data => {
                        resp.json({
                            message: "Successfully unliked collection"
                        });
                        resp.end();
                    })
                    .catch(error => {
                        //Debug
                        console.log(error);
                        resp.status(500).json({
                            message: "Error unliking collection"
                        });
                        resp.end();
                    });
            }
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error liking collection"
            });
            resp.end();
        });
}