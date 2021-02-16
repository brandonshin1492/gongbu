/*
*  COMMAND: STUDY
*  Usage: !study <mode>
*  Function: Puts user into study mode
*/

const { Pool } = require('pg');

// length of snowflake (used by ids) is set to 18
const SF_LEN = 18;

module.exports = {
    name: 'study',
    commands: ['study', 'studying'],
    expectedArgs: '<action> // available actions are `lock` and `release`. make sure both you and the bot are in a voice channel',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        // default arg is lock
        if (args.length == 0) {
            args.push('lock');
        }

        if (args[0] !== 'lock' && args[0] !== 'release') {
            message.channel.send('invalid args, need to pass `lock` or `release`');
            return;
        }

        // init userid and guildid for easier reference
        const member = message.member;
        const userid = message.member.id;
        const guildid = message.guild.id;

        // bot must be in a voice channel before calling this command
        const vcons = message.client.voice.connections;
        const curr_vcon = vcons.find(vcon => vcon.voice.guild.id === message.guild.id);
        if (!curr_vcon) {
            message.channel.send('add me to a voice channel first, then try again!');
            return;
        }

        // user must also be in a voice channel
        if (!message.member.voice.channel) {
            message.channel.send('join a voice channel first, then try again!');
        }

        // create connection to database
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
            rejectUnauthorized: false
            }
        });

        pool.connect();

        // check if table for server exists; if not, create one
        // EDIT: can use CREATE TABLE IF NOT EXISTS <name> <cols>
        const table_name = `study_${guildid}`
        const table_create_query = `CREATE TABLE IF NOT EXISTS study_status.${table_name} (uid char(${SF_LEN}), status varchar(10), prev_channel char(${SF_LEN}))`
        pool.query(table_create_query, (err, res) => {
            if (err) console.log('table creation error'); throw err;
        });

        // create query that will (1) insert user if they don't have a row, and (2) update their study status
        // EDIT: can use INSERT ___ ON CONFLICT DO UPDATE
        var insertion_query;
        if (args[0] == 'lock') {
            // verify the user isn't currently studying
            pool.query(`SELECT status FROM study_status.${table_name} WHERE uid = '${userid}`, (err, res) => {
                if (err) {console.log('error querying user study status, for .study lock'); return;}
                if (res.status !== 'free') {
                    message.channel.send('you arent studying right now');
                    return;
                }
            })

            // update the table with the user's new status and prev voice channel
            pool.query(`INSERT INTO study_status.${table_name} VALUES ('${userid}', 'studying', '${member.voice.channel}') ON CONFLICT DO UPDATE`, (err, res) => {
                if (err) { console.log('lock status error'); throw err; }
            });

            // move the user into the "study zone", AKA the channel that the bot is currently in (`curr_vcon`), and deafen them
            member.voice.setChannel(curr_vcon.channel);
            member.voice.setDeaf(true, 'deafened for studying');

        } else if (args[0] == 'release') {
            // verify the user is currently studying/has a record in the table; if so, move back to prev channel
            pool.query(`SELECT status, prev_channel FROM study_status.${table_name} WHERE uid = '${userid}'`, (err, res) => {
                if (err) { message.channel.send('you arent currently studying'); return; }
                else if (!res) { console.log('could not find that user; aborting'); return; }
                else if (res.status !== 'studying') { message.channel.send('you arent currently studying'); return; }
                else {
                    // undeafen the user, and move them back to their previous channel
                    member.voice.setDeaf(false, 'done studying');
                    member.voice.setChannel(res.prev_channel);
                }
            });

            // update the table to reflect the users new status
            pool.query(`INSERT INTO study_status.${table_name} VALUES ('${userid}', 'free', null) ON CONFLICT DO UPDATE`, (err, res) => {
                if (err) { console.log('release status error'); throw err; }
            });
        } else {
            console.log("HOW DID THIS EVEN HAPPEN??? args values need to be checked more rigorously");
            throw err;
        }
        
        pool.end();
    }
}