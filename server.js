import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import db from "./models/database.js";
import userRoutes from "./routes/userRoutes.js"
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//MongoDB connection checked
db.on("error", (error) => {
	console.log("MongoDB connection error", error);
});

db.once("open", () => {
	console.log("Connected to MongoDB");
});

//Signup service endpoint
app.use('/api', userRoutes);


//App config
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`);
})

process.on("SIGINT", () => {
	mongoose.connection.close();
    console.log("Closed mongodb connection on termination");
});
