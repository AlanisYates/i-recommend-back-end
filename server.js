import dotenv from "dotenv";
import mongoose from "mongoose";

const app = require("./app");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION. SHUTTING DOWN");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

// Connect to DATABASE
const PORT = process.env.PORT || 3000;
let database = process.env.DATABASE;
database = database.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(database).then(() => {
  console.log("Database connection successful....");
});

// SERVER
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}....`);
});

// Handle unresolved promises
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION. SHUTTING DOWN");
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
