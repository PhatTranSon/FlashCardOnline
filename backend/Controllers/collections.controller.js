const database = require('../Models/index');
const Collection = database.Collection;
const CollectionLike = database.CollectionLike;
const User = database.User;

//Helper methods for multiple versions of get collection
function getAllCollectionsLoggedIn(req, resp) {

} 

function getAllCollectionsNotLoggedIn(req, resp) {

}

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

exports.getMineCollections = (req, resp) => {
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
                        likes: countedLikesRow.dataValues.likes
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

exports.createCollection = (req, resp) => {
    //Get data from request body
    const { id } = req.user;
    const { title, description } = req.body;

    //Create collection
    const collection = {
        userId: id,
        title,
        description
    }

    Collection.create(collection)
        .then(collection => {
            resp.json({
                message: "Successfully created collection",
                id: collection.id,
                title: collection.title,
                description: collection.description
            });
            resp.end();
        })
        .catch(error => {
            //Debug
            console.log(error);
            resp.status(500).json({
                message: "Error creating collection"
            });
            resp.end();
        });
}

exports.updateCollection = (req, resp) => {
    //Get data from request body
    const { id } = req.user;
    const { title, description } = req.body;

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

                //Save
                collection.save()
                    .then(data => {
                        resp.json({
                            message: "Successfully modify collection",
                            id: data.id,
                            title: data.title,
                            description: data.description
                        });
                    })
                    .catch(error => {
                        //Debug
                        console.log(error);
                        resp.status(500).json({
                            message: "Error find collection"
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