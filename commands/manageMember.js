// Models import
const Event = require('../models/Event');
const Member = require('../models/Member');

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

  // Checks if user has a saved profile or if joined the event
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
      `${i + 1} - <@${memberList[i].memberId}> : ${memberList[i].points}\n`;
  }

  msg.delete();
  return msg.channel.send(`**Lista de pontos:**\n${memberListMsg}`);
};

const pointsEdit = async (msg) => {
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
  return msg.channel.send(
    `Pontos de <@${memberId}> modificados (${op} ${amount}): ${member.member_temp_fields[0]}`,
  );
};

module.exports = {
  pointsEdit,
  singlePointsCheck,
  allPointsCheck,
};
