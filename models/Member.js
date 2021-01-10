const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  member_discord_id: {
    type: String,
  },
  member_name: {
    type: String,
  },
  member_temp_fields: [
    {
      type: String,
    },
  ],
  events_ids: [
    {
      type: String,
    },
  ],
  member_created_at: {
    type: Date,
    default: Date.now,
  },
  member_updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Member = mongoose.model('member', MemberSchema);
