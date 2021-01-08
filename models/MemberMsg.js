const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
  msg_content: {
    type: String,
  },
  member_id: {
    type: String,
  },
  event_id: {
    type: String,
  },
  msg_created_at: {
    type: Date,
    default: Date.now,
  },
  msg_updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Msg = mongoose.model('msg', MsgSchema);
