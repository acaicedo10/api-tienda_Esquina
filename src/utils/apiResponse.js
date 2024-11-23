class ApiResponse {
    static success(res, data, message = 'Success', code = 200) {
      return res.status(code).json({
        success: true,
        message,
        data,
        errors: false
      });
    }
  
    static error(res, message = 'Error', code = 500, errors = true) {
      return res.status(code).json({
        success: false,
        message,
        errors
      });
    }
  }
  
  module.exports = ApiResponse;