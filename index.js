/*
* Yeet we go
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
const { Pool } = require('pg');

// config json file (local testing)
// const config = require('./config.json');
// prefix = config.prefix;
// token = config.token;

/* UNCOMMENT BEFORE DEPLOYING */
var prefix = process.env.BOT_PREFIX;
var token = process.env.BOT_TOKEN;


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
                console.log(`successfully registered command ${prefix}${options.name}`);
            }
        }
    }

    // read in all commands from command directory
    readCommands('commands');

    // reset study_status schema from database on each reload
    // create connection to database
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false
        }
    });

    pool.connect();

    pool.query('DROP SCHEMA study_status CASCADE; CREATE SCHEMA study_status', (err, res) => {
        if (err) throw err;
        console.log('successfully resetted the study_status schema');
        pool.end();
    });
});

client.login(token);
