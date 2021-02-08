/*
*  COMMAND: VCONN
*  Usage: !vconn
*  Function: Logs voice connection info to console
*/

module.exports = {
    name: 'vconn',
    commands: 'vconn',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // console.log(message.member.voice.channel);
        console.log(message.client.voice.connections);
    }
}