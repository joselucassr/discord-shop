const Member = require('../models/Member');

const pointEdit = (msg) => {
  let memberId = '';
  let op = msg.content.split(/ +/)[2];
  let amount = msg.content.split(/ +/)[3];

  if (!op || !amount) return msg.channel.send(`Por favor siga o formato: "e!pontuar (id) (+/-/=) (quantidade)".`);

  if (msg.mentions) {
    memberId = msg.mentions.users.first().id
  } else {
    memberId = msg.content.split(/ +/)[1];
  }

  let member = await Member.findOne({ member_discord_id: memberId })

  if (!member) return msg.channel.send(`ID não encontrado, verifique se a pessoa entrou no evento.`)

  console.log(member)
  console.log(op)
  console.log(amount)
};

module.exports = {
  pointEdit,
};
