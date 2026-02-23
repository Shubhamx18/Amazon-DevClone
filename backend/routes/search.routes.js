const router = require('express').Router();
const ctrl = require('../controllers/search.controller');
router.get('/', ctrl.search);
router.get('/suggestions', ctrl.suggestions);
module.exports = router;
