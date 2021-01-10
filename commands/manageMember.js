const Member = require('../models/Member');

const pointEdit = async (msg) => {
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

  if (!member) {
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

      await member.save();
      break;
    case '-':
      member.member_temp_fields[0] = currentPoints - amount;

      await member.save();
      break;
    case '=':
      member.member_temp_fields[0] = amount;

      await member.save();
      break;
    default:
      return msg.channel.send(`Você só pode usar (+ / - / =) como operadores.`);
  }

  return msg.channel.send(
    `Pontos de <@${memberId}>: ${member.member_temp_fields[0]}`,
  );
};

module.exports = {
  pointEdit,
};
