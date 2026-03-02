const Conversation = require('../models/Conversation');
const Analytics = require('../models/Analytics');
const axios = require('axios');

exports.createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId: req.userId,
      title: title || 'New Conversation',
      messages: [],
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.userId,
      isArchived: false,
    }).sort({ createdAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!message || !conversationId) {
      return res.status(400).json({ error: 'Message and conversationId required' });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    conversation.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });

    // Call AI service
    let botResponse = 'I am an AI assistant. How can I help you?';
    let intent = 'general';

    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/predict`,
        { text: message },
        { timeout: 5000 }
      );
      botResponse = aiResponse.data.response;
      intent = aiResponse.data.intent;
    } catch (aiError) {
      console.log('AI Service error:', aiError.message);
      // Use default response if AI service is down
    }

    // Add bot message
    conversation.messages.push({
      sender: 'bot',
      text: botResponse,
      timestamp: new Date(),
      intent,
    });

    await conversation.save();

    // Update analytics
    await updateAnalytics(intent);

    res.status(200).json({
      message: botResponse,
      intent,
      conversation,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.status(200).json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isArchived: true },
      { new: true }
    );
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAnalytics = async (intent) => {
  try {
    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = await Analytics.create({});
    }

    analytics.totalMessages += 1;
    if (analytics.intentsFrequency.has(intent)) {
      analytics.intentsFrequency.set(intent, analytics.intentsFrequency.get(intent) + 1);
    } else {
      analytics.intentsFrequency.set(intent, 1);
    }

    await analytics.save();
  } catch (error) {
    console.log('Analytics update error:', error);
  }
};
