//Import auth controller
const controller = require("../Controllers/auth.controller");

module.exports = (app) => {
    app.get('/auth/create', controller.createAccount);
    app.get('/auth/validate', controller.validateAccount);
}