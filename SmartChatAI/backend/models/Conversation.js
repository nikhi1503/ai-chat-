const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'bot'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        intent: {
          type: String,
          default: null,
        },
      },
    ],
    title: {
      type: String,
      default: 'New Conversation',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
