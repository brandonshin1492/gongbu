/*
*  COMMAND: STUDY
*  Usage: !study <mode>
*  Function: Puts user into study mode
*/

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
    name: 'study',
    commands: ['study'],
    expectedArgs: '<mode> // available modes are `mute` and `boot`',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        if (args.length == 0) {
            // default command is deafen mode
            args.push('mute');
        }
        
        const userid = message.member.id;
        // query database for user status
        try {
            var db, results;
            pool.connect()
                .then(client => {
                    db = client;
                    const user_status_query = `SELECT status FROM user_study_status WHERE id = '${userid}'`;
                    db.query('SELECT * FROM user_study_status')
                        .then(result => {
                            results = (result) ? result.rows : null;
                        })
                        .catch(console.log('error querying from user_study_status'));
                })
                .catch(console.log('error connecting to db'));
        } catch (err) {
            console.error(err);
            return;
        }

        console.log(`results type: ${typeof(results)}`);
        console.log(results);

        if (args[0] == 'mute') {

        } else if (args[0] == 'boot') {

        } else {
            message.channel.send('...');
        }
    }
}