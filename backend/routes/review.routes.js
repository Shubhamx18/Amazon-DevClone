const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { auth } = require('../middleware/auth');
router.get('/product/:productId', ctrl.getProductReviews);
router.post('/', auth, ctrl.createReview);
router.put('/:id', auth, ctrl.updateReview);
router.delete('/:id', auth, ctrl.deleteReview);
router.post('/:id/helpful', auth, ctrl.markHelpful);
module.exports = router;
