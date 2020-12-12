/*
* Yeet
*/

// discord packages
const Discord = require('discord.js');
const client = new Discord.Client();

// music packages
const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: 1
};

// other node packages
const fs = require('fs');
const path = require('path');

// config json file
const config = require('./config.json');

client.login(config.token);

client.on('ready', async () => {
    console.log(`logged in as ${client.user.username}#${client.user.discriminator}`);

    // load command-base.js from commands/
    const baseFile = 'command-base.js'
        , templateFile = 'command-template.js';
    const commandBase = require(`./commands/${baseFile}`);

    // function to read all commands recursively from commands/
    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir)); // returns array of filenames (str)
        for (const file of files) {
            const filepath = path.join(__dirname, dir, file);
            const stat = fs.lstatSync(filepath);
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== baseFile && file !== templateFile) { // is an actual command
                // get the command options for that particular command using require
                const options = require(filepath);

                // run the command-base.js code to perform validation + message handling
                commandBase(client, options);
                console.log(`successfully registered command ${config.prefix}${options.name}`);
            }
        }
    }

    readCommands('commands');
});
