// const { Client, Message } = require('discord.js');

const Discord = require('discord.js');
let started_time_duration = '';
let time_duration = '';
exports.run = async (Client, Message, args) => {
  async function giveaway() {
    let time_length = '';
    if (!Message.member.hasPermission('ADMINISTRATOR'))
      return Message.channel.send('você não pode iniciar sorteios.');
    if (Message.content.split(' ')[1])
      return Message.channel.send(
        'Por favor siga o formato: ``e!sorteio (tempo) (id) (premio)``.',
      );
    const prize = Message.content.split(' ').slice(3).join(' ');
    let channel = Message.content.split(' ')[2];
    const started_time_duration_start = Message.content.split(' ')[1];
    if (started_time_duration_start.toLowerCase().includes('h')) {
      started_time_duration = parseInt(
        started_time_duration_start.split('h')[0],
      );
      time_duration = started_time_duration * 3600000;
      if (time_duration == 3600000) {
        time_length = 'hour';
      }
      if (time_duration > 7200000) {
        time_length = 'hours';
      }
    }
    if (started_time_duration_start.toLowerCase().includes('m')) {
      started_time_duration = parseInt(
        started_time_duration_start.split('m')[0],
      );
      time_duration = started_time_duration_start * 60000;
      if (time_duration < 3600000) {
        time_length = 'minutes';
      }
      if (time_duration == 60000) {
        time_length = 'minute';
      }
    }
    if (isNaN(started_time_duration))
      return MessageChannel.send('a duração do sorteio precisa ser um numero.');
    if (started_time_duration < 1)
      return MessageChannel.send(
        'a duração do sorteio deve ser em horas ou minutos **(m ou h)**.',
      );
    if (
      !Message.guild.channels.cache.find(
        (channels) => channels.id === `${channel}`,
      )
    )
      return Message.channel.send('Por favor insira um id de canal valido');
    if (prize === '')
      return Message.channel.send('você precisa inserir um prêmio');
    const embed = new Discord.MessageEmbed()
      .setTitle(`${prize}`)
      .setDescription(
        `Reaja com 🎉 para entrar no sorteio **${started_time_duration}** ${time_length}\n\nCriado por: ${Message.author}`,
      )
      .setFooter('acaba em:')
      .setTimestamp(Date.now() + parseInt(time_duration))
      .setColor('#5bc0e3');

    let msg = await Client.channels.cache
      .get(`${channel}`)
      .send(':tada: **SORTEIO** :tada:', embed);
    await msg.react('🎉'); // check if it works
    setTimeout(() => {
      msg.reaction.cache.get('🎉').users.remove(Client.user.id);
      setTimeout(() => {
        let guildMembers = msg.reactions.cache.get('🎉').users;
        let winner =
          guildMembers[
            Math.floor(Math.random() * Math.floor(guildMembers.length)).user.id
          ];

        if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
          const winner_embed = new Discord.MessageEmbed()

            .setTitle(`${prize}`)
            .setDescription(
              `O ganhador é:\n${winner.tag}\n\nCriado por: ${Message.author}`,
            )
            .setFooter('acabou em:')
            .setTimestamp()
            .setColor('#5bc0e3');
          msg.edit(':tada: **O sorteio acabou ** :tada:', winner_embed);
        }
      }, 1000);
    }, time_duration);
  }
  giveaway();
};
