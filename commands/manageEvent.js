// Models import
const Event = require('../models/Event');

const createEvent = async (name) => {
  try {
    // Check for active events
    const activeEvents = await Event.find({ event_is_active: true });

    if (activeEvents.length > 0) return 'isActive';

    const eventFields = {
      event_name: name,
    };

    const event = new Event(eventFields);
    await event.save();
  } catch (err) {
    console.error(err.message);
  }
};

const checkEvent = async () => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (activeEvent) {
      const eventName = activeEvent.event_name;
      const memberCount = activeEvent.members_ids.length;

      return { eventName, memberCount };
    } else {
      return 'noEvent';
    }
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = {
  createEvent,
  checkEvent,
};