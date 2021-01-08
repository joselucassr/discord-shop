const { Client, Message } = require("discord.js")

const Discord = require ('discord.js')
let started_time_duration = ""
let time_duration = ""
exports.run = async (Client, Message, args) => {
    async function giveaway() {
        let time_lenght = ""
        if(!Message.member.hasPermission('ADMINISTARTOR')) return Message.channel.send('você não pode iniciar sorteios.');
        if (Message.content.spilt(' ')[1]) return Message.channel.send('Por favor siga o formato: ``e!sorteio (tempo) (id) (premio)``.');
        const prize = Message.content.spilt(' ').slice(3).join(' ')
        let channel = Message.content.spilt(' ')[2]
        const started_time_duration_start = Message.content.spilt(' ')[1]
        if (started_time_duration_start.toLowerCase().includes("h")){
            started_time_duration = started_time_duration_start.spilt("h")[0]
            time_duration = started_time_duration * 3600000
            if (time_duration == 3600000){time_lenght = "hour"}
            if (time_duration > 7200000){time_lenght = "hours"}
        }
        if (started_time_duration_start.toLowerCase().includes('m')){
            started_time_duration = started_time_duration_start.spilt('m')[0]
            time_duration = started_time_duration_start * 60000
            if (time_duration < 3600000){time_lenght = "minutes"}
            if (time_duration == 60000){time_lenght = "minute"}
        }
        if (isNaN(started_time_duration)) return MessageChannel.send('a duração do sorteio precisa ser um numero.')
        if (started_time_duration < 1) return MessageChannel.send('a duração do sorteio deve ser em horas ou minutas **(m or h)**.')
        if (!Message.guild.channels.cache.find(channels => channels.id === `${channel}`)) return Message.channel.send('Por favor insira um id de canal valido')
        if (prize === '') return Message.channel.send('você precisa inserir um prêmio')
        const embed = new Discord.MessageEmbed()
        .setTitle(`${prize}`)
        .setDescription(`Reaja com 🎉 para entrar no sorteio **${started_time_duration}** ${time_lenght}\n\nCriado por: ${Message.author}`)
        .setFooter('acaba em:')
        .setTimestamp(Date.now() + time_duration)
        .setColor('#5bc0e3')
        
        let msg = await Client.channels.cache.get(`${channel}`).send(':tada: **SORTEIO** :tada:', embed)
            await msg.react('🎉')  // check if it works
                setTimeout(() => {
                    msg.reaction.cache.get('🎉').users.remove(Client.user.id)
                    setTimeout(() => {
        let winner = msg.reactions.cache.get('🎉').users.cache.random();
        if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
            const winner_embed = new Discord.MessageEmbed()
            .setTitle(`${prize}`)
            .setDescription(`não entrou no sorteio 🙁\n\Criado por: ${Message.author}`)
            .setFooter('acabou em:')
            .setTimestamp()
            .setColor('#5bc0e3')
            msg.edit(':tada: **O sorteio acabou ** :tada:', winner_embed)
        }
        if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
            const winner_embed = new Discord.MessageEmbed()

            .setTitle(`${prize}`)
            .setDescription(`O ganhador é:\n${winner}\n\Criado por: ${Message.author}`)
            .setFooter('acabou em:')
            .setTimestamp()
            .setColor('#5bc0e3')
            msg.edit(':tada: **O sorteio acabou ** :tada:', winner_embed)
            
        } 
        }, 1000,)
        }, time_duration);
        }
        giveaway();
}