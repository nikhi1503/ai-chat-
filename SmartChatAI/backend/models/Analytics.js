const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    totalConversations: {
      type: Number,
      default: 0,
    },
    intentsFrequency: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    dailyUsage: [
      {
        date: Date,
        messageCount: Number,
        uniqueUsers: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
