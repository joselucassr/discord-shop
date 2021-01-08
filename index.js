'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import modules
const Discord = require('discord.js');
const config = require('config');

// Import functions
const {
  createEvent,
  checkEvent,
  stopEvent,
  joinEvent,
  askMembers,
  getAnswers,
  stopAnswers,
  getMembers,
} = require('./commands/manageEvent');

const { checkRole } = require('./utils/checker');

// Define things
const prefix = config.get('prefix');

// Database
const connectDB = require('./config/db');
connectDB();

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'bola na praia',
      type: 'PLAYING',
    },
  });
  console.log('I am ready to work!');
});

client.on('message', async (msg) => {
  // To get users answers
  if (msg.channel.type === 'dm') {
    await getAnswers(msg, client);
  }

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const comando = args.shift().toLocaleLowerCase();

  switch (comando) {
    case 'ping':
      const m = await msg.channel.send('ping?');
      m.edit(
        `pong!! A latência é de ${
          m.createdTimestamp - msg.createdTimestamp
        }ms.`,
      );
      break;

    case 'create':
      checkRole();
      if (!msg.content.match(/"([^"]+)"/)) {
        return await msg.channel.send(
          `Por favor digite um nome para o evento entre áspas`,
        );
      }

      let eventName = msg.content.match(/"([^"]+)"/)[1].trim();

      if (!eventName) {
        return await msg.channel.send(`Por favor não deixe em branco`);
      }

      eventName = eventName.toLowerCase();
      const eventNameCap =
        eventName.charAt(0).toUpperCase() + eventName.slice(1);

      const createReturn = await createEvent(eventNameCap, client);

      if (createReturn === 'isActive') {
        return await msg.channel.send(`Já existe um evento em andamento`);
      }

      await msg.channel.send(`Evento "${eventNameCap}" criado`);
      break;

    case 'checar':
    case 'check': {
      checkRole();
      const checkReturn = await checkEvent();

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      await msg.channel.send(
        `Evento: "${checkReturn.eventName}" \nMembros: ${checkReturn.memberCount} \nRecebendo resposta: ${checkReturn.acceptMsg}`,
      );
      break;
    }
    case 'stop_event': {
      checkRole();
      const checkReturn = await stopEvent(client);

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      await msg.channel.send(
        `O evento "${checkReturn.eventName}" foi encerrado e contou com ${checkReturn.memberCount} membros`,
      );
      break;
    }
    case 'entrar':
    case 'join_event': {
      const checkReturn = await joinEvent(msg.author.id);

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      if (checkReturn === 'alreadyIn') {
        return msg.channel.send(`Você já faz parte deste evento`);
      }

      await msg.channel.send(`<@${msg.author.id}> entrou!`);
      break;
    }
    case 'copyto':
      msg.channel.send('coletando mensagens');
      let counter = 0;
      let filter = (m) => !m.author.bot;
      let collector = new Discord.MessageCollector(msg.channel, filter);
      let destination = client.channels.cache.get('796946980843945984');
      collector.on('collect', (msg, col) => {
        console.log(
          `mensagem coletada: ${msg.content} e o autor dela é: ${msg.author.tag}`,
        );

        if (destination) {
          let embed = new Discord.MessageEmbed()
            .setTitle('nova mensagem')
            .setDescription(msg.content)
            .setTimestamp()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setColor('#4affea');

          destination.send(embed);
        }

        counter++;
        if (counter === 2) {
          collector.stop();
        }
      });

      break;

    case 'ask':
      {
        checkRole();
        if (!msg.content.match(/"([^"]+)"/)) {
          return await msg.channel.send(
            `Por favor digite a mensagem que será enviada.`,
          );
        }

        let askContent = msg.content.match(/"([^"]+)"/)[1].trim();

        if (!askContent) {
          return await msg.channel.send(`Por favor não deixe em branco!`);
        }

        const checkReturn = await askMembers(client.users, askContent, client);

        if (checkReturn === 'noEvent') {
          return msg.channel.send(`Não existe um evento em andamento`);
        }

        if (checkReturn === 'allSent') {
          return msg.channel.send(
            `Mensagem enviada a todos, recebendo respostas`,
          );
        }
      }
      break;
    case 'stop_ask':
      {
        checkRole();
        const checkReturn = await stopAnswers();

        if (checkReturn === 'noEvent') {
          return msg.channel.send(`Não existe um evento em andamento`);
        }

        if (checkReturn === 'stopped') {
          return msg.channel.send(`Receber respostas: Desligado`);
        }
      }
      break;

    case 'get_members':
      {
        checkRole();

        const checkReturn = await getMembers();

        return msg.channel.send(
          `Participantes do evento: **${checkReturn.name}** (*${
            checkReturn.isActive ? 'Ativo' : 'Finalizado'
          }*) \n${checkReturn.list}`,
        );
      }
      break;
    default:
      await msg.channel.send('Comando não encontrado');
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
