// Models import
const Server = require('../models/Server');
const Event = require('../models/Event');
const Member = require('../models/Member');

// Functions import
const { simpleEmbed } = require('../utils/embed');

const startServer = async (msg) => {
  try {
    msg.delete();
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
      return simpleEmbed(
        msg,
        'Sem permissão:',
        'Você não tem permissão para executar este comando.',
      );
    }

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
const updateServer = async (msg, newGuild) => {
  if (newGuild) {
    let guild = newGuild;

    let server = await Server.findOne({ server_discord_id: guild.id });

    if (!server) return 0;

    server.server_name = guild.name;
    await server.save();

    return 0;
  }

  msg.delete();
  // Check if theres is a server
  let server = await Server.findOne({ server_discord_id: msg.guild.id });

  if (!server)
    return simpleEmbed(
      msg,
      'Não foi possível atualizar:',
      'O servidor precisa ser iniciado.',
    );

  if (
    !msg.member.hasPermission('ADMINISTRATOR') &&
    !msg.member.roles.cache.find((r) => r.id === server.server_event_role)
  ) {
    return simpleEmbed(
      msg,
      'Sem permissão:',
      'Você não tem permissão para executar este comando.',
    );
  }

  let updating = msg.content.split(/ +/)[1];
  let arg_1 = msg.content.split(/ +/)[2];

  switch (updating) {
    case 'event_tag': {
      server.server_event_role = arg_1;
      await server.save();

      return simpleEmbed(
        msg,
        'Configuração atualizada:',
        `Tag da equipe de eventos atualizada para <@&${arg_1}>`,
      );
    }

    case 'log_channel': {
      server.server_log_channel = arg_1;
      await server.save();

      return simpleEmbed(
        msg,
        'Configuração atualizada:',
        `Canal de logs atualizado para <#${arg_1}>`,
      );
    }

    default:
      return simpleEmbed(
        msg,
        'Argumento inválido:',
        'Digite o que deseja atualizar.',
      );
  }
};

module.exports = {
  startServer,
  updateServer,
};
