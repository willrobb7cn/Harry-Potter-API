let UserSchema = require('../models/user')

function getPassword(password) {
    return new Promise((resolve, reject) => {

        UserSchema.find({ password }, (err, docs) => {
            if(err) reject(err);

            resolve(docs);
        });
    });
}

module.exports = getPassword;