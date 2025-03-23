const AppErr = require("../Helper/AppError");

const IsbranchAccess = async (req, res, next) => {
  try {
    
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = IsbranchAccess;
