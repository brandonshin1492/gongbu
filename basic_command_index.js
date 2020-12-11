/*
* This is the old index.js file I used to test basic commands; see command.js to look at basic command handling
*/

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready!');

    command(client, 'ping', (message) => {
        message.channel.send('pong!');
    })

    command(client, 'servers', (message) => {
        const numGuilds = client.guilds.cache.size;
        console.log(`gongbu is in ${numGuilds} server(s):`);
        client.guilds.cache.forEach((guild) => {
            console.log(`• ${guild.name}`);
        })
    })

    command(client, ['cc', 'clearchannel'], (message) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (message.channel.name === 'bot-test') {
                // Ask for user confirmation before clearing recent messages from a channel
                let replyMessage = message.reply(`are you sure you want to clear recent messages from #${message.channel.name}? this action cannot be undone! (respond with .y)`);
                let replyFilter = msg => msg.author.id === message.author.id && msg.content.toLowerCase() === '.y';
                message.channel.awaitMessages(replyFilter, {max: 1, time: 10000}).then(collected => {
                    if (!replyMessage.deleted) replyMessage.then(rmsg => rmsg.delete());
                    if (collected.first()) { // Here, collected.first() refers to the author's response (should be .y)
                        message.channel.messages.fetch().then(results => {
                            message.channel.bulkDelete(results);
                            message.reply(`cleared ${results.size} messages from this channel`)
                            .then(msg => {
                                msg.delete({ timeout: 5000 })
                            })
                            .catch(console.error);
                        })
                        if (!collected.first().deleted) collected.first().delete();
                    }
                })
            } else {
                message.reply('sorry, i can only clear messages from #bot-test')
                    .then(msg => {
                        msg.delete({ timeout: 5000 })
                    })
                    .catch(console.error);
                message.delete()
                    .catch(console.error);
            }
        }
    })
})

client.login(config.token)
