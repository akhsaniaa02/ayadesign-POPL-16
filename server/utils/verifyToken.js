// utils/verifyTokenAndGetUserId.js
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('./constant');

const verifyTokenAndGetUserId = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_KEY); 
        return decoded._id;
    } catch (error) {
        return null;
    }
};

module.exports = verifyTokenAndGetUserId;
