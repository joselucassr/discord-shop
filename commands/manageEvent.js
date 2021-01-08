const Discord = require('discord.js');

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

    activeEvent.event_is_active = false;
    activeEvent.event_updated_at = Date.now();
    await activeEvent.save();

    return {
      eventName: activeEvent.event_name,
      memberCount: activeEvent.members_ids.length,
    };
  } catch (err) {
    console.error(err.message);
  }
};

const joinEvent = async (discord_id) => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    if (activeEvent.members_ids.includes(discord_id)) return 'alreadyIn';

    activeEvent.members_ids.push(discord_id);
    activeEvent.event_updated_at = Date.now();
    await activeEvent.save();
  } catch (err) {
    console.error(err.message);
  }
};

const askMembers = async (users, askContent, client) => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    const membersIds = activeEvent.members_ids;

    for (let i = 0; i < membersIds.length; i++) {
      const user = await users.fetch(membersIds[i], true);

      await user.send(askContent);
    }

    return 'allSent';
  } catch (err) {
    console.error(err.message);
  }
};

const getAnswers = async (msg, client) => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent) return 'noEvent';

  if (!activeEvent.members_ids.includes(msg.author.id)) return 'null';

  let destination = client.channels.cache.get('796946980843945984');

  if (destination) {
    let embed = new Discord.MessageEmbed()
      .setTitle('nova mensagem')
      .setDescription(msg.content)
      .setTimestamp()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
      .setColor('#4affea');

    await destination.send(embed);
  }
};

module.exports = {
  createEvent,
  checkEvent,
  stopEvent,
  joinEvent,
  askMembers,
  getAnswers,
};
