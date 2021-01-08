const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  participant_discord_id: {
    type: String,
  },
  participant_name: {
    type: String,
  },
  participant_created_at: {
    type: Date,
    default: Date.now,
  },
  participant_updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Participant = mongoose.model('participant', ParticipantSchema);
