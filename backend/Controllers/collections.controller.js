const database = require('../Models/index');
const Collection = database.Collection;
const CollectionLike = database.CollectionLike;
const User = database.User;

//Helper methods for multiple versions of get collection
function getAllCollectionsLoggedIn(req, resp) {

} 

function getAllCollectionsNotLoggedIn(req, resp) {

}

exports.getMineCollections = (req, resp) => {
    //Get user id
    const { id } = req.user;

    //Find all collections belong to the userId
    Collection
        .findAll(
            {
                where: {
                    userId: id
                },
                include: [
                    {
                        //Check if user liked or not
                        model: User,
                        where: {
                            id
                        },
                        attributes: [
                            "id"
                        ],
                        through: {
                            attributes: ["createdAt"]
                        },
                        required: false
                    }
                ]
            }
        )
        .then((collections) => {
            //Modify the collections object
            collections = collections.map(collection => {
                return {
                    "id": collection.id,
                    "title": collection.title,
                    "description": collection.description,
                    "createdAt": collection.createdAt,
                    "updatedAt": collection.updatedAt,
                    "userId": 6,
                    "liked": collection.users.length > 0 ? true : false
                }
            });

            //Return json
            resp.json(collections);
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