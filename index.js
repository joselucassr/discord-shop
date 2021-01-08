'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import modules
const Discord = require('discord.js');
const config = require('config');

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

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (message.content.substring(0, prefix.length) !== prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLocaleLowerCase();

  switch (comando) {
    case 'ping':
      const m = await message.channel.send('ping?');
      m.edit(
        `pong!! A latência é de ${
          m.createdTimestamp - message.createdTimestamp
        }ms.`,
      );
      break;
    default:
      await message.channel.send('Comando não encontrado');
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
