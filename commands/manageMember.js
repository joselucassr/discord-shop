const Discord = require('discord.js');

// Models import
const Event = require('../models/Event');
const Member = require('../models/Member');

// Function imports
const { logPoints } = require('../utils/logs');

const singlePointsCheck = async (msg) => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent)
    return msg.channel.send(`Não existe um evento em andamento.`);

  let memberId = '';

  // Get by mention or ID
  if (msg.mentions.users.first()) {
    memberId = msg.mentions.users.first().id;
  } else {
    memberId = msg.content.split(/ +/)[1];
  }

  const member = await Member.findOne({ member_discord_id: memberId });

  // Checks if user has a saved profile or if joined the event
  if (!member || !member.events_ids.includes(activeEvent._id)) {
    return msg.channel.send(
      `ID não encontrado, verifique se a pessoa entrou no evento.`,
    );
  }

  msg.delete();
  return msg.channel.send(
    `Pontos de <@${memberId}>: ${member.member_temp_fields[0]}`,
  );
};

const allPointsCheck = async (msg) => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent)
    return msg.channel.send(`Não existe um evento em andamento.`);

  // Checks if event is empty
  if (activeEvent.members_ids.length === 0) {
    return msg.channel.send(`Evento vazio.`);
  }

  let memberList = [];
  let memberListMsg = '';

  for (let i = 0; i < activeEvent.members_ids.length; i++) {
    const member = await Member.findOne({
      member_discord_id: activeEvent.members_ids[i],
    });

    let points = member.member_temp_fields[0];
    if (!points) points = '0';
    let memberId = member.member_discord_id;

    memberList.push({ memberId, points });
  }

  memberList.sort((a, b) => b.points - a.points);

  for (let i = 0; i < memberList.length; i++) {
    memberListMsg =
      memberListMsg +
      `${i + 1}º - <@${memberList[i].memberId}>: **${memberList[i].points}**\n`;
  }

  msg.delete();

  const embed = new Discord.MessageEmbed()
    .setTitle(`Top pontos do evento`)
    .setDescription(`${memberListMsg}`)
    .setFooter('Enviado em:')
    .setTimestamp(Date.now())
    .setColor('#5bc0e3');

  return msg.channel.send(``, embed);
};

const pointsEdit = async (msg, client) => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent)
    return msg.channel.send(`Não existe um evento em andamento.`);

  let memberId = '';
  let op = msg.content.split(/ +/)[2];
  let amount = msg.content.split(/ +/)[3];

  if (!op || !amount)
    return msg.channel.send(
      `Por favor siga o formato: "e!pontuar (id) (+ / - / =) (quantidade)".`,
    );

  // Get by mention or ID
  if (msg.mentions.users.first()) {
    memberId = msg.mentions.users.first().id;
  } else {
    memberId = msg.content.split(/ +/)[1];
  }

  const member = await Member.findOne({ member_discord_id: memberId });

  // Checks if user has a saved profile or if joined the event
  if (!member || !member.events_ids.includes(activeEvent._id)) {
    return msg.channel.send(
      `ID não encontrado, verifique se a pessoa entrou no evento.`,
    );
  }

  let currentPoints = member.member_temp_fields[0];

  if (!currentPoints) currentPoints = '0';
  currentPoints = parseInt(currentPoints);

  amount = parseInt(amount);

  switch (op) {
    case '+':
      member.member_temp_fields[0] = currentPoints + amount;
      break;
    case '-':
      member.member_temp_fields[0] = currentPoints - amount;
      break;
    case '=':
      member.member_temp_fields[0] = amount;
      break;
    default:
      msg.delete();
      return msg.channel.send(`Você só pode usar (+ / - / =) como operadores.`);
  }

  member.markModified('member_temp_fields');
  await member.save();

  msg.delete();
  logPoints(client, msg, {
    memberId,
    op,
    amount,
    currentPoints: member.member_temp_fields[0],
  });
  return msg.channel.send(
    `Pontos de <@${memberId}> modificados **(${op} ${amount})**: **${member.member_temp_fields[0]}**`,
  );
};

const resetPoints = async (msg) => {
  // Check for active events
  const activeEvent = await Event.findOne({ event_is_active: true });

  if (!activeEvent)
    return msg.channel.send(`Não existe um evento em andamento.`);

  // Checks if event is empty
  if (activeEvent.members_ids.length === 0) {
    return msg.channel.send(`Evento vazio.`);
  }

  for (let i = 0; i < activeEvent.members_ids.length; i++) {
    const member = await Member.findOne({
      member_discord_id: activeEvent.members_ids[i],
    });

    member.member_temp_fields[0] = '0';
    member.markModified('member_temp_fields');
    await member.save();
  }

  msg.delete();

  const embed = new Discord.MessageEmbed()
    .setTitle(`Pontos reiniciados`)
    .setDescription(
      `Pontos reiniciados de **${activeEvent.members_ids.length}** participantes`,
    )
    .setFooter('Enviado em:')
    .setTimestamp(Date.now())
    .setColor('#5bc0e3');

  return msg.channel.send(``, embed);
};

module.exports = {
  pointsEdit,
  singlePointsCheck,
  allPointsCheck,
  resetPoints,
};
