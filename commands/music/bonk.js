/*
*  COMMAND: BONK
*  Usage: !bonk
*  Function: Plays a bonk sound effect
*/

const { TeamMember, MessageManager } = require("discord.js");
var path = require('path');

module.exports = {
    name: 'bonk',
    commands: ['bonk'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('bonk called yeet');
        const vcons = message.client.voice.connections;
        const vcon = vcons.find(vcon => vcon.voice.guild.id === message.guild.id);
        if (vcon) {
            const sound_dir = path.join(__dirname, '/../../sounds/');
            const spath = path.join(sound_dir, 'bonk.mp3');
            const player = vcon.play(spath);
            player.on('finish', () => {
                player.destroy();
            });
        }
    }
}