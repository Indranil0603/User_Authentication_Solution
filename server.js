const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./models/database.js");
const userRoutes = require("./routes/userRoutes.js");
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT ;

//MongoDB connection checked
db.on("error", (error) => {
	console.log("MongoDB connection error", error);
});

db.once("open", () => {
	console.log("Connected to MongoDB");
});

//user Routes endpoints
app.use('/api', userRoutes);


//App config
if(process.env.NODE_ENV=== "development"){
	app.listen(PORT, ()=>{
		console.log(`Server is running on PORT:${PORT}`);
	});
}

//To close connection to monogDB
process.on("SIGINT", () => {
	mongoose.connection.close();
    console.log("Closed mongodb connection on termination");
});

module.exports = { app };