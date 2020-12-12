/*
*  COMMAND: ECHO
*  Usage: !echo <msg>
*  Function: repeats the user's message back to them
*/

module.exports = {
    name: 'echo',
    commands: ['echo', 'ech'],
    expectedArgs: '<msg>',
    minArgs: 1,
    maxArgs: null,
    permissions: ['SEND_MESSAGES'],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        message.channel.send(`${args.join(' ')}!`);
    }
}