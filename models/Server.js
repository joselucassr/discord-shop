const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  server_discord_id: {
    type: String,
    required: true,
  },
  server_name: {
    type: String,
    required: true,
  },
  server_event_channel: {
    type: String,
  },
  server_event_role: {
    type: String,
  },
  server_temp_fields: [],
  server_created_at: {
    type: Date,
    default: Date.now,
  },
  server_updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Server = mongoose.model('server', ServerSchema);
