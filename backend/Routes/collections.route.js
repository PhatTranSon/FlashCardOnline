const controller = require('../Controllers/collections.controller');
const { validateToken } = require('../Helpers/auth.helper');

module.exports = (app) => {
    //Collection that belongs to a user
    app.get('/mine/collections', validateToken, controller.getAllCollections);
    
    //All the collection with user logged in

    //All the collection with user not logged in

    app.post('/collections', validateToken, controller.createCollection);
    app.put('/collections/:collectionId', validateToken, controller.updateCollection);
    app.delete('/collections/:collectionId', validateToken, controller.deleteCollection);
    app.post('/collections/likes', validateToken, controller.likeCollection);
}