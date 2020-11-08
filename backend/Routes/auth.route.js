//Import auth controller
const controller = require("../Controllers/auth.controller");

module.exports = (app) => {
    app.post('/auth/create', controller.createAccount);
    app.post('/auth/validate', controller.validateAccount);
}