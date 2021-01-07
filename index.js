'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');
const config = require('./config.json');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  client.user.setPresence({ game: { name: 'bola na praia' } });
  console.log('I am ready to work!');
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLocaleLowerCase();

  if (comando === 'ping') {
    const m = await message.channel.send('ping?');
    m.edit(
      `pong!! A latência é de ${
        m.createdTimestamp - message.createdTimestamp
      }ms.`,
    );
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
