const Discord = require('discord.js');

// Models import
const Event = require('../models/Event');
const Server = require('../models/Server');
const Member = require('../models/Member');

// Functions import
const { simpleEmbed } = require('../utils/embed');

const setDetectMsg = async (msg) => {
  msg.delete();
  // Check for active events
  let activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent)
    return msg.channel.send(`Não existe um evento em andamento.`);

  if (!msg.content.match(/"([^"]+)"/)) {
    return simpleEmbed(
      msg,
      'Comando incorreto:',
      `Por favor digite a mensagem que será colocada no status no formato **e!dmsg "msg"**`,
    );
  }

  let msgToDetect = msg.content.match(/"([^"]+)"/)[1].trim();

  if (!msgToDetect) {
    return simpleEmbed(
      msg,
      'Comando incorreto:',
      `Não deixe a mensagem em branco.`,
    );
  }

  msgToDetect = msgToDetect.toLowerCase();

  let detectFields = {
    type: 'detectMsg',
    value: msgToDetect,
    active: true,
  };

  activeEvent.event_temp_fields.push(detectFields);
  activeEvent.markModified('event_temp_fields');
  await activeEvent.save();

  return simpleEmbed(
    msg,
    'Mensagem configurada:',
    `A mensagem **"${msgToDetect}"** foi adicionada.`,
  );
};
const detectMsg = async (msg) => {
  // Check if theres is a server
  let server = await Server.findOne({ server_discord_id: msg.guild.id });
  if (!server) return 0;

  // Checks if its the correct channel
  if (msg.channel.id !== server.server_event_channel) return 0;

  // Check for active events
  let activeEvent = await Event.findOne({ event_is_active: true });
  if (!activeEvent) return 0;

  let field = activeEvent.event_temp_fields.find((e) => e.type === 'detectMsg');
  if (!field || !field.active) return 0;

  let guessMsg = msg.content.toLowerCase().includes(field.value);
  if (!guessMsg) return 0;

  let newFields = activeEvent.event_temp_fields.map((obj) => {
    if (obj.type === 'detectMsg')
      return {
        ...obj,
        active: false,
      };
    return obj;
  });

  activeEvent.event_temp_fields.push(newFields);
  activeEvent.markModified('event_temp_fields');
  await activeEvent.save();

  return simpleEmbed(
    msg,
    'Resposta encontrada:',
    `<@${msg.author.id}> adivinhou a mensagem: **"${field.value}"**`,
  );
};

module.exports = {
  setDetectMsg,
  detectMsg,
};
