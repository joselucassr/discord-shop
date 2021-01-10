const Discord = require('discord.js');

const logPoints = async (client, msg, args) => {
  let destination = client.channels.cache.get('797251638687563776');

  if (destination) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Log: pontos modificados`)
      .setDescription(
        `Pontos de <@${args.memberId}> modificados por <@${msg.author.id}> \nOperação: **${args.op}** \nQuantidade: **${args.amount}**) \nPontos Atuais: **${args.currentPoints}**`,
      )
      .setTimestamp(Date.now())
      .setColor('#5bc0e3');

    destination.send(embed);
  }
};

module.exports = {
  logPoints,
};
