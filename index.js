const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, ['ping', 'echo'], (message) => {
        message.channel.send('pong!')
    })
})

client.login(config.token)
