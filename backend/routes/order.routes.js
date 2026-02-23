const router = require('express').Router();
const ctrl = require('../controllers/order.controller');
const { auth } = require('../middleware/auth');
router.get('/track/:orderNumber', ctrl.trackOrder);
router.post('/', auth, ctrl.createOrder);
router.get('/', auth, ctrl.getMyOrders);
router.get('/:id', auth, ctrl.getOrderById);
router.put('/:id/cancel', auth, ctrl.cancelOrder);
module.exports = router;
