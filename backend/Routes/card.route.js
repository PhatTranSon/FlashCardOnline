//Import controller for card
const controller =  require('../Controllers/cards.controller');

//Import authentication helper
const { validateToken } = require('../Helpers/auth.helper');

module.exports = (app) => {
    app.post('/cards', validateToken, controller.createNewCard);
    app.get('/cards', validateToken, controller.viewAllCards);
    app.put('/cards', validateToken, controller.updateCard);
    app.delete('/cards', validateToken, controller.deleteCard);

    //Like
    app.post('/cards/likes', validateToken, controller.likeCard);
    app.delete('/cards/likes', validateToken, controller.unlikeCard);
}