//Import database and model
const database = require('../Models');
const { ValidationError } = database.Sequelize
const User = database.User;

//Import JWT library to generate web token
const ACCESS_TOKEN_SECRET = require('../token.config').ACCESS_TOKEN_SECRET;
const jwt = require('jsonwebtoken');

//Custom method to handle validation error
function extractUserValidationMessage(e) {
    //Get only the first error key
    const errorKey = e.errors[0].validatorKey;
    //console.log(errorKey);

    //Check the key
    if (errorKey === 'isEmail') {
        return "Username must be in the form of an email";
    } else if (errorKey === 'len') {
        return "Please choose password with length 8 - 20";
    } else if (errorKey === 'not_unique') {
        return "Username already used";
    } else {
        return "Please select another username";
    }
}

//Create controllers for authentication
exports.createAccount = async (req, resp) => {
    console.log(req.body);
    //Get username and password from request object
    const name = req.body.name, password = req.body.password;
    const user = {
        name,
        password
    }

    //Create a new user
    User.create(user)
        .then(data => {
            //Generate a new token
            const createdUser = {
                id: data.id
            }

            const accessToken = jwt.sign(
                createdUser, 
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '24h'
                }
            );


            //Display 
            resp.json({
                message: "Account created successfully",
                id: data.id,
                username: name,
                password: password,
                accessToken: accessToken
            });
        })
        .catch(error => {
            //Check validation error
            if (error instanceof ValidationError) {
                //Get the message
                const message = extractUserValidationMessage(error);

                //Response with message
                resp.status(500).send({
                    message
                });
            } else {
                console.log(error);
                //Error handling -> Later
                resp.status(500).send({
                    message: "Unknown error creating account"
                });
            }
        });
}

exports.validateAccount = async (req, resp) => {
    //Get user name and password
    const { name, password } = req.body;

    //Check name
    User.findOne({ where: { name }})
        .then(async (user) => {
            //Check password
            const isValidPassword = await user.isPasswordValid(password);

            //If valid
            if (isValidPassword) {
                //Generate a web token
                const data = {
                    id: user.id
                };

                const accessToken = jwt.sign(
                    data, 
                    ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '24h'
                    }
                );

                //Give back to user
                resp.json({
                    id: user.id,
                    message: "Successfully logged in",
                    accessToken
                });
            } else {
                resp.status(500).send({
                    message: "Invalid username/password combination"
                });
            }
            resp.end();
        })
        .catch((error) => {
            //Error handling -> Later
            resp.status(500).send({
                message: "Error validating account"
            });
        });
}

