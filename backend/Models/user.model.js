const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    //Create user model
    const User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                len: [8, 20]
            }
        }
    }, {
        hooks: {
            //Add hook to automatically encrypt password
            beforeCreate: async function(user) {
                //Generate salt
                const salt = await bcrypt.genSalt();
                //Encrypt and use encrypted version
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    });

    //Append password checking method
    User.prototype.isPasswordValid = async function(password) {
        return await bcrypt.compare(password, this.password);
    }

    return User;
}