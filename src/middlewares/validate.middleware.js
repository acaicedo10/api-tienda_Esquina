const ApiResponse = require("../utils/apiResponse");

const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errors = error.details.reduce((acc, err) => {
        const key = err.context.key;
        acc[key] = err.message;
        return acc;
      }, {});
      return ApiResponse.error(res, errors, 400);
    }
    next();
  };
};

module.exports = validate;
