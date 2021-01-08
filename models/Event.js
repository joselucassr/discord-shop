const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  event_name: {
    type: String,
  },
  members_ids: [
    {
      type: String,
    },
  ],
  event_is_active: {
    type: Boolean,
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
