const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { cartSchema } = require("../utils/validators");

router.use(auth);

router.post("/add", validate(cartSchema, "body"), cartController.addToCart);

router.delete("/remove", cartController.removeFromCart);

// router.patch('/update-quantity', cartController.updateCartItemQuantity);

router.get("/", cartController.getCart);

module.exports = router;
