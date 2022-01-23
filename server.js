import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

let database = process.env.DATABASE;
database = database.replace("<password>", process.env.DATABASE_PASSWORD);
//console.log(database);

mongoose.connect(database).then(() => {
  console.log("Database connection successful");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}....`);
});
