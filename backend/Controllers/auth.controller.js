//Import database and model
const database = require('../Models');
const User = database.User;

//Create controllers for authentication
exports.createAccount = async (req, resp) => {
    //Get username and password from request object
    const name = req.body.name, password = req.body.password;
    const user = {
        name,
        password
    }

    //Create a new user
    User.create(user)
        .then(data => {
            //Display 
            resp.json({
                message: "Account created successfully",
                username: name,
                password: password
            });
        })
        .catch(error => {
            //Error handling -> Later
            resp.status(500).send({
                message: "Error creating account"
            })
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
                resp.json({
                    message: "Successfully logged in"
                });
            } else {
                resp.json({
                    message: "Invalid username/password combination"
                });
            }

            resp.end();
        })
        .catch((error) => {
            //Debug
            console.log(error);
            //Error handling -> Later
            resp.status(500).send({
                message: "Error validating account"
            });
        });
}

