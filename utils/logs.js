const Discord = require('discord.js');

const Server = require('../models/Server');

const logPoints = async (client, msg, args) => {
  // Check if theres is a server
  let server = await Server.findOne({ server_discord_id: msg.guild.id });

  if (!server)
    return simpleEmbed(
      msg,
      'Não foi possível atualizar:',
      'O servidor precisa ser iniciado.',
    );

  let destination = client.channels.cache.get(server.server_log_channel);

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
  // Check if theres is a server
  let server = await Server.findOne({ server_discord_id: msg.guild.id });

  if (!server)
    return simpleEmbed(
      msg,
      'Não foi possível atualizar:',
      'O servidor precisa ser iniciado.',
    );

  let destination = client.channels.cache.get(server.server_log_channel);

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
