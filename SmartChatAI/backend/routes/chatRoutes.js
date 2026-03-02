const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware); // All routes below require authentication

router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:id', chatController.getConversation);
router.post('/messages', chatController.sendMessage);
router.delete('/conversations/:id', chatController.deleteConversation);
router.put('/conversations/:id/archive', chatController.archiveConversation);

module.exports = router;
