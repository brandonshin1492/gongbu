/*
*  COMMAND: JOIN
*  Usage: !join
*  Function: Adds bot to the author's current channel
*/

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
    }
}