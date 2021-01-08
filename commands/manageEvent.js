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

const stopEvent = async () => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    console.log(activeEvent);
    console.log(activeEvent._id);
    const savedEvent = await Event.findOneAndUpdate(
      { _id: activeEvent._id },
      { $set: { event_is_active: false } },
      { new: true },
    );

    console.log(savedEvent);

    return {
      eventName: activeEvent.event_name,
      memberCount: activeEvent.members_ids.length,
    };
  } catch (err) {}
};
module.exports = {
  createEvent,
  checkEvent,
  stopEvent,
};
