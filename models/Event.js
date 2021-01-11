const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
  },
  members_ids: [
    {
      type: String,
    },
  ],
  event_temp_fields: [],
  event_is_active: {
    type: Boolean,
    default: true,
  },
  event_accept_msg: {
    type: Boolean,
    default: false,
  },
  event_created_at: {
    type: Date,
    default: Date.now,
  },
  event_updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Event = mongoose.model('event', EventSchema);
