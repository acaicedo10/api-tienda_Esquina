const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const { auth } = require('../middlewares/auth.middleware');

router.post('/', auth, OrderController.createOrder.bind(OrderController));
router.post('/capture-payment', auth, OrderController.capturePayPalPayment);
router.get('/', auth, OrderController.getUserOrders);
router.get('/:orderId', auth, OrderController.getOrderDetails);

module.exports = router;