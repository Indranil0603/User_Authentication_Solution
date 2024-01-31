const mongoose = require("mongoose");
const { config } = require("dotenv");

config();

//Connection to databse established
mongoose.connect(process.env.MONGODB_URL);

module.exports = mongoose.connection;