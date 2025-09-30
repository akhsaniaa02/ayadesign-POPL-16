const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const JWT_KEY = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
module.exports = {
  JWT_KEY,
  MONGO_URI
};
