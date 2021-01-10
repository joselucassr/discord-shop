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

const { run, sortCall } = require('./commands/manageGiveaway');

const { pointEdit } = require('./commands/manageMember');

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

// Later work
// client.on('guildMemberUpdate', (oldMember, newMember) => {
//   console.log('Called');
//   // const guild = newMember.guild;

//   console.log(oldMember.user);
//   console.log(newMember.user);

//   // continue with code
// });

client.on('message', async (msg) => {
  // To get users answers
  if (msg.channel.type === 'dm') {
    await getAnswers(msg, client);
  }

  if (msg.channel.id === '796771494583074857') {
    if (
      msg.content.toLowerCase().startsWith('ok') &&
      msg.member.roles.cache.find((r) => r.id === '790239603436159006') &&
      msg.author.bot === false
    ) {
      msg.channel
        .send(`OK: <@${msg.author.id}>`)
        .then((m) => m && m.delete({ timeout: 300000 }))
        .catch(() => {
          return 0;
        });
    }
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
      let roleCheck = checkRole(msg);
      if (roleCheck === 'noPerm') return;

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
      let roleCheck = checkRole(msg);
      if (roleCheck === 'noPerm') return;

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
      let roleCheck = checkRole(msg);
      if (roleCheck === 'noPerm') return;

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
    case 'join':
    case 'join_event': {
      const checkReturn = await joinEvent(msg.author);

      if (checkReturn === 'noEvent') {
        return msg.channel.send(`Não existe um evento em andamento`);
      }

      if (checkReturn === 'alreadyIn') {
        return msg.channel.send(`Você já faz parte deste evento`);
      }

      await msg.channel.send(`<@${msg.author.id}> entrou!`);
      break;
    }

    case 'ask':
      {
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

        if (!msg.content.match(/"([^"]+)"/)) {
          return await msg.channel.send(
            `Por favor digite a mensagem que será enviada.`,
          );
        }

        let askContent = msg.content.match(/"([^"]+)"/)[1].trim();

        if (!askContent) {
          return await msg.channel.send(`Por favor não deixe em branco!`);
        }

        const checkReturn = await askMembers(client.users, askContent, msg);

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
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

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
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

        const checkReturn = await getMembers();

        msg.channel.send(
          `Participantes do evento: **${checkReturn.name}** (*${
            checkReturn.isActive ? 'Ativo' : 'Finalizado'
          }*) \n${checkReturn.list}`,
        );
      }
      break;

    case 'sortcall':
      {
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

        const checkReturn = await sortCall(msg, client);

        if (checkReturn === 'noMembers')
          return msg.channel.send(`Chamada vazia.`);

        if (checkReturn === 'joinChannel')
          return msg.channel.send(`Entre em uma chamada.`);

        msg.channel.send(`Sorteio da call: <@${checkReturn.memberId}>`);
      }
      break;

    case 'stats':
      console.log('entrei');
      {
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

        console.log('pessei pelo role check');

        if (!msg.content.match(/"([^"]+)"/)) {
          return await msg.channel.send(
            `Por favor digite a mensagem que será colocada no status no formato "mensagem" "type"`,
          );
        }

        console.log('pessei pelo content match');

        let statusContent = msg.content.match(/"([^"]+)"/)[1].trim();

        if (!statusContent) {
          return await msg.channel.send(`Por favor não deixe em branco!`);
        }

        console.log(`${statusContent}`);

        let statusTContent = msg.content.match(/"([^"]+)"/)[2].trim();

        if (!statusTContent) {
          return await msg.channel.send(`Por favor não deixe em branco!`);
        }
        console.log('terminei');

        client.user.setPresence({
          status: 'online',
          activity: {
            name: `${statusContent}`,
            type: `${statusTContent}`,
          },
        });
      }
      break;

    case 'pontuar':
      {
        let roleCheck = checkRole(msg);
        if (roleCheck === 'noPerm') return;

        pointEdit(msg);
      }
      break;

    // case 'sorteio':
    //   run(client, msg);
    //   break;
    default:
      await msg.channel.send('Comando não encontrado');
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
