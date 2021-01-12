const { MessageEmbed, Message } = require('discord.js');

const say = (Message, { Text }) => {
  var embed = new MessageEmbed()
    .setTitle(``)
    .setColor('#888888')
    .setDescription(Text)
    .setTimestamp()
    .setFooter(
      `${Message.member.displayName}, me pediru para dizer isto!!`,
      Message.author.displayAvatarURL()
    );
  return Message.say(embed);
};

module.exports = { say };
