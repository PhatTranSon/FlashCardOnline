//Import controller for card
const controller =  require('../Controllers/cards.controller');

//Import authentication helper
const { validateToken, getUser } = require('../Helpers/auth.helper');

module.exports = (app) => {
    //View all cards
    app.get('/cards', getUser, controller.viewAllCards);

    //View all cards from users
    app.get('/mine/cards', validateToken, controller.viewAllCardsFromUser);

    //View all cards from collection
    app.get('/cardsfromcollection', getUser, controller.viewAllCardsFromCollections);

    //View all liked cards
    app.get('/mine/cards/liked', validateToken, controller.viewAllLikedCards);

    app.post('/cards', validateToken, controller.createNewCard);
    app.put('/cards', validateToken, controller.updateCard);
    app.post('/cards/delete', validateToken, controller.deleteCard);

    //Like
    app.post('/cards/likes', validateToken, controller.likeCard);
    app.post('/cards/unlikes', validateToken, controller.unlikeCard);
}