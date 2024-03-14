// middleware/auth.js

const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                reject('Forbidden: Invalid token');
            } else {
                resolve(decoded.user_id);
            }
        });
    });
};
