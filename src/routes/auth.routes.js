const express = require("express");
const router = express.Router();
const {
  register,
  login,
  veryfyEmail,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  veryfyEmailSchema,
} = require("../utils/validators");

router.post("/register", validate(registerSchema, "body"), register);
router.post("/login", validate(loginSchema, "body"), login);
router.post("/veryfyEmail", validate(veryfyEmailSchema, "body"), veryfyEmail);

module.exports = router;
