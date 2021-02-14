/*
*  COMMAND: STUDY
*  Usage: !study <mode>
*  Function: Puts user into study mode
*/

const temp = 'REDACTED';
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// const pool = new Pool({
//     user: 'oxuuzjyicuagaq',
//     password: '15fc95d7b38afd78306af89d0febeb381f2ce02a5def477de63ed1800f1228e6',
//     host: 'ec2-3-222-11-129.compute-1.amazonaws.com',
//     port: 5432,
//     database: 'd5jtedjbmnj0d9',
//     url: temp,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

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