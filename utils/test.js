const GitUser = require("../models/githubUserModel");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: "C:/Users/jycam/OneDrive/Documents/Projects-DESKTOP-CC563GG/i-reccommend/i-recommend-back-end/config.env",
});

// Connect to DATABASE
const PORT = process.env.PORT || 3000;
let database = process.env.DATABASE;
database = database.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(database).then(() => {
  console.log("Database connection successful....");
});

const createGithubUser = async function (githubUserData) {
  // "login": "gerbil742",
  // "id": 23387795,
  console.log(githubUserData);
  const modifiedData = githubUserData;
  modifiedData.username = githubUserData.login;
  modifiedData.githubID = githubUserData.id;

  const user = await GitUser.create(modifiedData);
  // const mongoID = user._id;

  // user = await GitUser.findByIdAndUpdate(mongoID, {
  //   $set: {
  //     username: githubUserData.login,
  //     githubID: githubUserData.id,
  //   },
  // });

  return user;
};

const readData = function () {
  let file;
  fs.readFile("./githubUserExample.json", (data) => {
    file = JSON.parse(data);

    console.log("file contents");
    console.log(file);
    return file;
  });
};

// fix promises
// readData().then((data) => {
//   const user = (async () => {
//     await createGithubUser(data);
//     console.log(user);
//   })();
// });
