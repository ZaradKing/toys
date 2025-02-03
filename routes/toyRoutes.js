const express = require('express');
const router = express.Router();
const ToyController = require('../controllers/toyController');
const { auth } = require('../middlewares/auth');

// Public routes
router.get('/', ToyController.getAllToys);
router.get('/search', ToyController.searchToys);
router.get('/category/:category', ToyController.getToysByCategory);
router.get('/price-range', ToyController.getToysByPriceRange);
router.get('/:id', ToyController.getToyById);

// Protected routes (require authentication)
router.post('/', auth, ToyController.createToy);
router.put('/:id', auth, ToyController.updateToy);
router.delete('/:id', auth, ToyController.deleteToy);

module.exports = router;