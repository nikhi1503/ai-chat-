const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware); // All routes require auth and admin role

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/deactivate', adminController.deactivateUser);
router.get('/analytics', adminController.getAnalytics);
router.get('/users/:id/stats', adminController.getUserStats);

module.exports = router;
