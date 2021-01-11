const Discord = require('discord.js');

// Models import
const Event = require('../models/Event');
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
      'Comando incorreto:',
      `Por favor digite a mensagem que será colocada no status no formato **e!dmsg "msg"**`,
    );
  }

  let msgToDetect = msg.content.match(/"([^"]+)"/)[1].trim();

  if (!msgToDetect) {
    return simpleEmbed('Comando incorreto:', `Não deixe a mensagem em branco.`);
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
    'Mensagem configurada:',
    `A mensagem **"${msgToDetect}"** foi adicionada.`,
  );
};
const detectMsg = async () => {};

module.exports = {
  setDetectMsg,
  detectMsg,
};
