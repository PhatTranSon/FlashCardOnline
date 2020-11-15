const {
    validateToken
} = require('../Helpers/auth.helper');

const {
    getAllTestResults,
    getTestResult,
    postTestResult
}  = require('../Controllers/test.controller');

module.exports = (app) => {
    //Routing
    app.get('/tests/:collectionId', validateToken, getTestResult);
    app.post('/tests/:collectionId', validateToken, postTestResult);
    app.get('/tests', validateToken, getAllTestResults);
}