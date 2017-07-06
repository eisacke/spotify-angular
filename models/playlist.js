const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  spotifyId: { type: String },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  upvotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

const playlistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  suggestions: [ suggestionSchema ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);
