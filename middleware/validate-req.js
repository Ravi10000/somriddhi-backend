const { validationResult } = require("express-validator");

function validateReq(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  ``;
  result.errors.forEach((err) => {
    errors[err.param] = err.msg;
  });
  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
  });
}

module.exports = validateReq;
