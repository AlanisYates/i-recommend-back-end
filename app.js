import express from "express";
import morgan from "morgan";

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const recRouter = require("./routes/recRoutes");
const itinRouter = require("./routes/itinerariesRouter");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// MIDDLEWARE

// Request Body Parser
app.use(express.json({ limit: "10kb" }));

// Development logging info
app.use(morgan("dev"));

// ROUTES
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/recs", recRouter);
app.use("/itins", itinRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Unknown route catch all
app.get("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    data: `Page not found for ${req.origionalUrl}`,
  });
});

// GLOBAL ERROR HANDLER. Processes all caught errors.
app.use(globalErrorHandler);

module.exports = app;
