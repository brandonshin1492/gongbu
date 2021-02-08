/*
*  COMMAND: LOCK
*  Usage: !<TEMP> <ARG>
*  Function: <TEMP>
*/

var fs = require('fs');
const lineReader = require('line-reader');

module.exports = {
    name: 'lock',
    commands: ['lock'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('lock called');

        // check if user is already locked; if not, add to txt file
        var locked_flag = false;
        let curr_id = message.member.id;
        const filepath = 'locked_users.txt';
        // lineReader.eachLine(filepath, line => {
        //     if (curr_id === line) {
        //         var locked_flag = true;
        //         console.log('changed to ' + locked_flag);
        //         message.channel.send('you are already locked. go study');
        //         return false;
        //     }
        // });
        fs.appendFile(filepath, `${message.member.id}\n`, err => {
            if (err) {
                console.log('file append failed');
            } else {
                // done adding user to locked users file
                console.log(`added user ${message.member.id} to locked users`);
            }
        });

        // bot join functionality
        if (message.member.voice.channel) {
            // bot joins channel in place of locked user
            const vconn = message.member.voice.channel.join()
                .then(connection => console.log(`connected to channel ${connection.channel.name}!`))
                .catch(console.error);
            message.member.voice.setChannel(null);
            message.channel.send(`its time to study, ${message.member.user.username}`)
        }
    }
}