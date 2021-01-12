const { MessageEmbed } = require('discord.js');

const vote = (msg, { question, time }) => {
  var emojiList = ['👍', '👎', '🤷'];
  var embed = new MessageEmbed()
    .setTitle(':ballot_box: ' + question)
    .setDescription('')
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setColor(`#FF0000`)
    .setTimestamp();

  if (time) {
    embed.setFooter(`A votação começou e vai durar ${time} minuto(s)`);
  } else {
    embed.setFooter(`A votação começou e não tem hora de término`);
  }

  msg.delete(); // Remove the user's command message

  msg.channel
    .send({ embed }) // Use a 2d array?
    .then(async function (message) {
      var reactionArray = [];
      reactionArray[0] = await message.react(emojiList[0]);
      reactionArray[1] = await message.react(emojiList[1]);
      reactionArray[2] = await message.react(emojiList[2]);

      if (time) {
        setTimeout(() => {
          // Re-fetch the message and get reaction counts
          message.channel.messages
            .fetch(message.id)
            .then(async function (message) {
              var reactionCountsArray = [];
              for (var i = 0; i < reactionArray.length; i++) {
                reactionCountsArray[i] =
                  message.reactions.cache.get(emojiList[i]).count - 1;
              }

              // Find winner(s)
              var max = -Infinity,
                indexMax = [];
              for (let i = 0; i < reactionCountsArray.length; ++i)
                if (reactionCountsArray[i] > max)
                  (max = reactionCountsArray[i]), (indexMax = [i]);
                else if (reactionCountsArray[i] === max) indexMax.push(i);

              // Display winner(s)
              var winnersText = '';
              if (reactionCountsArray[indexMax[0]] == 0) {
                winnersText = ':x: nimguem votou!';
              } else {
                for (let i = 0; i < indexMax.length; i++) {
                  winnersText +=
                    emojiList[indexMax[i]] +
                    ' (' +
                    reactionCountsArray[indexMax[i]] +
                    ' vote(s))\n';
                }
              }
              embed.addField(':crown: **Ganhador:**', winnersText);
              embed.setFooter(
                `A votação foi encerrada! e Durou ${time} minuto(s)`
              );
              embed.setTimestamp();
              message.edit('', embed);
            });
        }, time * 60 * 1000);
      }
    })
    .catch(console.error);
};

module.exports = { vote };
