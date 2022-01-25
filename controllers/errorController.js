module.exports = function sendErrorResponse(err, req, res, next) {
  res.status(400).json({
    status: "fail",
    data: {
      error: err,
      message: err.message,
      stack: err.stack,
    },
  });
};
