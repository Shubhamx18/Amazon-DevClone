const router = require('express').Router();
const ctrl = require('../controllers/wishlist.controller');
const { auth } = require('../middleware/auth');
router.get('/', auth, ctrl.getWishlist);
router.post('/', auth, ctrl.addToWishlist);
router.delete('/:productId', auth, ctrl.removeFromWishlist);
router.get('/check/:productId', auth, ctrl.checkWishlist);
module.exports = router;
