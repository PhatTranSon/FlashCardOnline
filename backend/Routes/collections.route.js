const controller = require('../Controllers/collections.controller');
const { validateToken } = require('../Helpers/auth.helper');

module.exports = (app) => {
    //Collection that belongs to a user
    app.get('/mine/collections', validateToken, controller.getMineCollections);
    
    //TODO: All the collection with user logged in

    //TODO: All the collection with user not logged in

    //Like stuff
    app.post('/collections/likes', validateToken, controller.likeCollection);
    app.delete('/collections/likes', validateToken, controller.unlikeCollection);

    //CRUD
    app.post('/collections', validateToken, controller.createCollection);
    app.put('/collections/:collectionId', validateToken, controller.updateCollection);
    app.delete('/collections/:collectionId', validateToken, controller.deleteCollection);
}