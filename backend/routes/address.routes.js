const router = require('express').Router();
const ctrl = require('../controllers/address.controller');
const { auth } = require('../middleware/auth');
router.get('/', auth, ctrl.getAddresses);
router.post('/', auth, ctrl.addAddress);
router.put('/:id', auth, ctrl.updateAddress);
router.delete('/:id', auth, ctrl.deleteAddress);
router.put('/:id/default', auth, ctrl.setDefault);
module.exports = router;
