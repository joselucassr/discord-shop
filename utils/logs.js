const Discord = require('discord.js');

const logPoints = async (client, msg, args) => {
  let destination = client.channels.cache.get('797251638687563776');

  if (destination) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Log: Pontos modificados`)
      .setDescription(
        `● Pontos de <@${args.memberId}> modificados por <@${msg.author.id}> \n● Operação: **${args.op}** \n● Quantidade: **${args.amount}** \n● Pontos Atuais: **${args.currentPoints}**`,
      )
      .setTimestamp(Date.now())
      .setColor('#5bc0e3');

    destination.send(embed);
  }
};

const logResetPoints = async (client, msg, args) => {
  let destination = client.channels.cache.get('797251638687563776');

  if (destination) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Log: Pontos reiniciados`)
      .setDescription(
        `Pontos reiniciados de **${args.amount}** participantes por: <@${msg.author.id}> \n**Pontos antes do reinício:** \n${args.memberListMsg}`,
      )
      .setTimestamp(Date.now())
      .setColor('#5bc0e3');

    destination.send(embed);
  }
};

module.exports = {
  logPoints,
  logResetPoints,
};
