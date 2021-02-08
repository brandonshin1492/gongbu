/*
*  COMMAND: unLOCK
*  Usage: !<TEMP> <ARG>
*  Function: <TEMP>
*/

var fs = require('fs');
const lineReader = require('line-reader');

module.exports = {
    name: 'unlock',
    commands: ['unlock'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        console.log('unlock called');
        const filepath = 'locked_users.txt';
        const curr_id = message.member.id;
        lineReader.eachLine(filepath, line => {
            if (line === curr_id) {
                // get voice channel gongbu is in, and have it leave
                const vcons = message.client.voice.connections;
                const curr_vcon = vcons.find(vcon => vcon.voice.guild.id === message.guild.id);
                if (curr_vcon) {
                    curr_vcon.channel.leave();
                }

                // remove locked user from the locked_users.txt file
                var data = fs.readFileSync(filepath, 'utf-8');
                var newData = data.replace(`${curr_id}\n`, '');
                fs.writeFileSync(filepath, newData, 'utf-8');
                console.log(`removed member id ${curr_id} from locked_users.txt`);
                message.channel.send('you are free');
            }
        });
    }
}