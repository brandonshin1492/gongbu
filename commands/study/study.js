/*
*  COMMAND: STUDY
*  Usage: !study <mode>
*  Function: Puts user into study mode
*/

const { Pool } = require('pg');

module.exports = {
    name: 'study',
    commands: ['study', 'studying'],
    expectedArgs: '<action> // available actions are `lock` and `release',
    minArgs: 1,
    maxArgs: 1,
    permissions: [],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        // init userid for easier reference
        const userid = message.member.id;

        // query database for user status
            
        // create db connection
        // create connection to database
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
            rejectUnauthorized: false
            }
        });

        pool.connect();
        const debug_query = 'SELECT * FROM user_study_status';
        const user_status_query = `SELECT status FROM user_study_status WHERE id = '${userid}'`;
        pool.query(debug_query, (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
                console.log(typeof(row));
                console.log(JSON.stringify(row));
            }
            pool.end();
        });
        // db.query()
        //     .then(result => {
        //         results = (result) ? result.rows : null;
        //     })
        //     .catch(console.log('error querying from user_study_status'));
    }
}