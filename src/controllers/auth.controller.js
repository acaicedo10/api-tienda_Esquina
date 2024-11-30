const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/env");
const ApiResponse = require("../utils/apiResponse");
const { sendEmail } = require("../services/email.service");

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(
        res,
        "El correo electrónico ya ha sido registrado.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const codeVerification = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);

    const TemplateData = JSON.stringify({
      codigo: codeVerification,
    });

    const user = new User({
      email,
      password: hashedPassword,
      profile: { firstName, lastName },
      emailVerificationToken: codeVerification,
      emailVerificationExpires: emailVerificationExpires,
    });
    const confirmationEmailsent = await sendEmail(
      [email],
      "SupermercadoLaEsquina",
      TemplateData
    );
    await user.save();

    return ApiResponse.success(
      res,
      confirmationEmailsent,
      "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico para continuar.",
      201
    );
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.error(
        res,
        "Correo electronico incorrecto no se encuentra registrado",
        401
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, "Contraseña incorrecta", 401);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    user.lastLogin = new Date();
    await user.save();

    return ApiResponse.success(res, { token }, "Inicio de sesión exitoso");
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const veryfyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const dataNow = new Date();
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return ApiResponse.error(res, "Codigo de verificacion incorrecto.", 400);
    }

    if (user.emailVerificationExpires < dataNow) {
      return ApiResponse.error(res, "El codigo ingresado ha expirado", 400);
    }

    if (user.emailVerified) {
      return ApiResponse.error(
        res,
        "El correo electrónico ya ha sido verificado",
        400
      );
    }

    const tokenLogin = jwt.sign({ id: user._id }, JWT_SECRET);
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.lastLogin = new Date();
    await user.save();

    return ApiResponse.success(
      res,
      tokenLogin,
      "Correo electrónico verificado exitosamente",
      200
    );
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  register,
  login,
  veryfyEmail,
};
