const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  suggestions: {
    spotifyId: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    upvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);
