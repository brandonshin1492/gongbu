/*
*  COMMAND: SOUND
*  Usage: !sound <sound name>
*  Function: Plays a sound effect of choice
*/

const { TeamMember, MessageManager } = require("discord.js");
var path = require('path');
var fs = require('fs');

module.exports = {
    name: 'sound',
    commands: ['sound', 'play', 'se'],
    expectedArgs: '<sound effect>',
    minArgs: 1,
    maxArgs: 1,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('bonk called yeet');
        const vcons = message.client.voice.connections;
        const vcon = vcons.find(vcon => vcon.voice.guild.id === message.guild.id);
        if (vcon) {
            const sound_dir = path.join(__dirname, '/../../sounds/');
            const spath = path.join(sound_dir, `${args[0]}.mp3`);
            try {
                const player = vcon.play(spath);
                player.on('finish', () => {
                    player.destroy();
                });
            } catch(err) {
                message.channel.send(`couldnt find sound effect ${args[0]}`);
            }
        }
    }
}