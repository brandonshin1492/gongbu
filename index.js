/*
* Yeet
*/

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json')

const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: 1
}

client.login(config.token)

client.on('ready', () => {
    console.log(`logged in as ${client.user.username}#${client.user.discriminator}`)
})

client.on('message', async message => {
    // Ignore any messages that aren't from a guild
    if (!message.guild) return;
})