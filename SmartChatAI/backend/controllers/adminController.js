const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Analytics = require('../models/Analytics');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete user conversations
    await Conversation.deleteMany({ userId: req.params.id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalConversations = await Conversation.countDocuments();
    let analytics = await Analytics.findOne();

    if (!analytics) {
      analytics = await Analytics.create({
        totalUsers,
        totalConversations,
      });
    }

    const analyticsData = {
      totalUsers,
      totalConversations,
      totalMessages: analytics.totalMessages,
      intentsFrequency: Object.fromEntries(analytics.intentsFrequency),
      topIntents: Array.from(analytics.intentsFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([intent, count]) => ({ intent, count })),
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const conversations = await Conversation.find({ userId });
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

    res.status(200).json({
      userId,
      totalConversations: conversations.length,
      totalMessages,
      conversationDates: conversations.map(conv => ({
        id: conv._id,
        title: conv.title,
        messageCount: conv.messages.length,
        createdAt: conv.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
