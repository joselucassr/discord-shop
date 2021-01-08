'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import modules
const Discord = require('discord.js');
const config = require('config');

// Import commands
const {
  createEvent,
  checkEvent,
  stopEvent,
  joinEvent,
} = require('./commands/manageEvent');

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
  if (msg.author.bot) return;

  if (msg.content.substring(0, prefix.length) !== prefix) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
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

    case 'join':
      msg.author.send('teste');
      break;
    case 'create':
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

      const createReturn = await createEvent(eventNameCap);

      if (createReturn === 'isActive') {
        return await msg.channel.send(`Já existe um evento em andamento`);
      }

      await msg.channel.send(`Evento "${eventNameCap}" criado`);
      break;
    case 'check': {
      const checkReturn = await checkEvent();

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      await msg.channel.send(
        `Evento "${checkReturn.eventName}" em andamento com ${checkReturn.memberCount} membros`,
      );
      break;
    }
    case 'stop_event': {
      const checkReturn = await stopEvent();

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      await msg.channel.send(
        `O evento "${checkReturn.eventName}" foi encerrado e contou com ${checkReturn.memberCount} membros`,
      );
      break;
    }

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

      case "ask":{
        Client.users.get("292092550863388674").send("teste")
        }
        break;

    // client.channels.cache.get('796946980843945984').send(`coletei a mensagem ${msg.content}`);

    default:
      await msg.channel.send('Comando não encontrado');
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
