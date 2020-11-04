const controller = require('../Controllers/collections.controller');
const { validateToken } = require('../Helpers/auth.helper');

module.exports = (app) => {
    //Routing
    app.get('/collections', validateToken, controller.getAllCollections);
    app.post('/collections', validateToken, controller.createCollection);
    app.put('/collections/:collectionId', validateToken, controller.updateCollection);
    app.delete('/collections/:collectionId', validateToken, controller.deleteCollection);
}