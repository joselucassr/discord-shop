// Models import
const Server = require('../models/Server');
const Event = require('../models/Event');
const Member = require('../models/Member');

// Functions import
const { simpleEmbed } = require('../utils/embed');

const startServer = async (msg) => {
  try {
    msg.delete();
    // if (!msg.member.hasPermission('ADMINISTRATOR')) {
    //   return simpleEmbed(
    //     msg,
    //     'Sem permissão:',
    //     'Você não tem permissão para executar este comando.',
    //   );
    // }

    // Check if has already start up
    let server = await Server.findOne({ server_discord_id: msg.guild.id });

    if (server)
      return simpleEmbed(
        msg,
        'Não foi possível iniciar:',
        'O servidor já foi iniciado.',
      );

    let serverFields = {
      server_name: msg.guild.name,
      server_discord_id: msg.guild.id,
    };

    server = new Server(serverFields);
    await server.save();

    return simpleEmbed(
      msg,
      'Servidor iniciado:',
      `● Nome: ${msg.guild.name} \n● ID: ${msg.guild.id}`,
    );
  } catch (err) {
    console.error(err.message);
  }
};
const updateServer = async (msg) => {};

module.exports = {
  startServer,
  updateServer,
};
