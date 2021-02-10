/*
*  COMMAND: LEAVE
*  Usage: !leave
*  Function: The bot leaves from its current channel
*/

const { TeamMember, MessageManager } = require("discord.js");

module.exports = {
    name: 'leave',
    commands: ['leave'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('leave called yeet');
        const vcons = message.client.voice.connections;
        const curr_vcon = vcons.find(vcon => vcon.voice.guild.id === message.guild.id);
        if (curr_vcon) {
            curr_vcon.channel.leave();
        } else {
            message.channel.send('not in a voice channel');
        }
    }
}