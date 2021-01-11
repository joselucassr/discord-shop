// Models import
const Server = require('../models/Server');

// Functions import
const { simpleEmbed } = require('../utils/embed');

const checkRole = (msg) => {
  // Check if theres is a server
  let server = await Server.findOne({ server_discord_id: msg.guild.id });

  if (!server)
    return simpleEmbed(
      msg,
      'Não foi possível atualizar:',
      'O servidor precisa ser iniciado.',
    );

  if (
    msg.channel.type === 'dm' ||
    !msg.member.roles.cache.find((r) => r.id === server.server_event_role)
  )
    simpleEmbed(
      msg,
      'Sem permissão:',
      'Você não tem permissão para executar este comando.',
    );

    return 'noPerm'
};

module.exports = {
  checkRole,
};
