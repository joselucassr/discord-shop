const Discord = require('discord.js');

// Models import
const Event = require('../models/Event');
const Member = require('../models/Member');

const createEvent = async (name, client) => {
  try {
    // Check for active events
    const activeEvents = await Event.find({ event_is_active: true });

    if (activeEvents.length > 0) return 'isActive';

    const eventFields = {
      event_name: name,
    };

    const event = new Event(eventFields);
    await event.save();

    client.user.setPresence({
      status: 'online',
      activity: {
        name,
        type: 'PLAYING',
      },
    });
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
      let acceptMsg = activeEvent.event_accept_msg === true ? 'Sim' : 'Não';

      return { eventName, memberCount, acceptMsg };
    } else {
      return 'noEvent';
    }
  } catch (err) {
    console.error(err.message);
  }
};

const stopEvent = async (client) => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    activeEvent.event_is_active = false;
    activeEvent.event_updated_at = Date.now();
    await activeEvent.save();

    client.user.setPresence({
      status: 'online',
      activity: {
        name: 'bola na praia',
        type: 'PLAYING',
      },
    });

    return {
      eventName: activeEvent.event_name,
      memberCount: activeEvent.members_ids.length,
    };
  } catch (err) {
    console.error(err.message);
  }
};

const joinEvent = async (author) => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    if (activeEvent.members_ids.includes(author.id)) return 'alreadyIn';

    let member = await Member.findOne({ member_discord_id: author.id });

    activeEvent.members_ids.push(author.id);
    activeEvent.event_updated_at = Date.now();
    await activeEvent.save();

    if (member) {
      member.events_ids.push(activeEvent._id);
      member.member_updated_at = Date.now();
      await member.save();
    } else {
      let memberFields = {
        member_discord_id: author.id,
        member_name: author.username,
        events_ids: [activeEvent._id],
      };

      member = new Member(memberFields);
      await member;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const askMembers = async (users, askContent, msg) => {
  try {
    // Check for active events
    const activeEvent = await Event.findOne({ event_is_active: true });

    if (!activeEvent) return 'noEvent';

    const membersIds = activeEvent.members_ids;

    for (let i = 0; i < membersIds.length; i++) {
      const user = await users.fetch(membersIds[i], true);

      user
        .send(askContent)
        .then()
        .catch(() => {
          msg.channel.send(`Não foi possível enviar para: <@${user.id}>`);
        });
    }

    activeEvent.event_accept_msg = true;
    await activeEvent.save();
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
  if (!activeEvent.event_accept_msg) return 'null';

  // let destination = client.channels.cache.get('796946980843945984');
  // let destination = client.channels.cache.get('796946980843945984');
  let destination = client.channels.cache.get('797251638687563776');

  if (destination) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Resposta do evento: ${activeEvent.event_name}`)
      .setDescription(msg.content)
      .setImage(msg.attachments.first() && msg.attachments.first().url)
      .setTimestamp()
      .setAuthor(
        msg.content.startsWith('anônimo') ? 'Anônimo' : msg.author.tag,
        msg.author.displayAvatarURL,
      )
      .setColor('#4affea');

    destination.send(embed);

    await msg.author.send('Resposta enviada com sucesso');
  }
};

const stopAnswers = async () => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent) return 'noEvent';

  activeEvent.event_accept_msg = false;
  await activeEvent.save();

  return 'stopped';
};

const getMembers = async () => {
  // Check for active events
  const event = await Event.findOne().sort({ _id: -1 });

  let membersIn = event.members_ids;

  let list = ``;

  for (let i = 0; i < membersIn.length; i++) {
    list = list + `<@${membersIn[i]}> (${membersIn[i]})\n`;
  }

  return { list, isActive: event.event_is_active, name: event.event_name };
};

module.exports = {
  createEvent,
  checkEvent,
  stopEvent,
  joinEvent,
  askMembers,
  getAnswers,
  stopAnswers,
  getMembers,
};
