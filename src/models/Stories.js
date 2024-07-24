const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true }, // Reference to the User model
  viewers: [{ type: String }], // List of usernames who have viewed the story
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL index for 24 hours
});

export default mongoose.models.Story || mongoose.model('Story', storySchema);
