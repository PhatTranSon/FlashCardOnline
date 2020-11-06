//Import jwt and config
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = require('../token.config').ACCESS_TOKEN_SECRET;

exports.validateToken = (req, resp, next) => {
    //Get authorization token from header
    const authorizationHeader = req.headers.authorization;

    //Check if authHeader exists
    if (authorizationHeader) {
        //Split token from bearer
        const tokens = authorizationHeader.split(' ');

        if (tokens.length > 1) {
            //Verify token
            const token = tokens[1];

            //Decrypt
            jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) {
                    //401: Not Authorized
                    resp.sendStatus(403).end();
                } else {
                    //Set user
                    req.user = user;
                    //Call next
                    next();
                }
            });
        } else {
            //401: Not authorized
            resp.sendStatus(403);
        }
    } else {
        //401: Not authorized
        resp.sendStatus(403);
    }
}

exports.getUser = (req, resp, next) => {
    //Get authorization token from header
    const authorizationHeader = req.headers.authorization;

    //Check if authHeader exists
    if (authorizationHeader) {
        //Split token from bearer
        const tokens = authorizationHeader.split(' ');

        if (tokens.length > 1) {
            //Verify token
            const token = tokens[1];

            //Decrypt
            jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user) => {
                if (!error) {
                    //Set user
                    req.user = user;
                }
                //Call next
                next();
            });
        } else {
            next();
        }
    } else {
        //401: Not authorized
        next();
    }
}