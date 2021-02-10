/*
*  COMMAND: JOIN
*  Usage: !join
*  Function: Adds bot to the author's current channel
*/

const { TeamMember, MessageManager } = require("discord.js");

module.exports = {
    name: 'join',
    commands: ['join', 'study'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('join called yeet');
        if (message.member.voice.channel) {
            const vconn = message.member.voice.channel.join()
                .then(connection => console.log(`connected to channel ${connection.channel.name}!`))
                .catch(console.error);
        } else {
            message.channel.send('you arent in a voice channel...');
        }
    }
}