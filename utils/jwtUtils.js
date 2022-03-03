import dotenv from "dotenv";
const jwt = require("jsonwebtoken");

dotenv.config({ path: "../config.env" });

const signJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.sendJWT = (res, user) => {
  //const payload = { id: user.id, userType: user.userType }; // usertype will be undefined if teh user signed in via email.
  //console.log(payload);
  const token = signJWT({ id: user.id });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000 // convert days to milisec
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // remove password field from output

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.verifyJWT = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};
