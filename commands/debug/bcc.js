/*
*  COMMAND: BOT CLEAR CHANNEL (BOT-TEST)
*  Usage: !bcc
*  Function: Clears the last four messages from #bot-test; if the "all" arg is included, delete the last 100
*/

module.exports = {
    name: 'bcc',
    commands: 'bcc',
    expectedArgs: 'all // omit "all" to delete only the last 4 messages',
    minArgs: 0,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    requiredRoles: ['bot test'],
    callback: (message, args) => {
        // FILL IN COMMAND CODE HERE
        if (message.channel.name !== 'bot-test') {
            message.reply('this command can only be run in #bot-test!');
            return;
        }
        if (args.length) {
            // clear entire channel
            if (args[0] !== 'all') {
                message.reply('the only valid arg for bcc is "all"');
                return;
            }

            let confirmMessage = message.reply('are you sure you want to clear all messages in #bot-test? type .yes if you are');

            // replyFilter filters out any incoming messages that ARENT from the author and that ARENT the confirmation phrase
            let replyFilter = msg => msg.author.id === message.author.id && msg.content.toLowerCase() === '.yes';

            // awaitMessages returns a promise, which holds a Collection of messages matching the filter we passed in
            message.channel.awaitMessages(replyFilter, {max: 1, time: 10000}).then(collected => {
                if (!confirmMessage.deleted) confirmMessage.then(msg => msg.delete());

                // if collected.first() evals to true, then a '.yes' message was sent by the author; proceed with deletion
                if (collected.first()) {
                    collected.first().delete();
                    message.channel.messages.fetch({limit: 100}).then(fetched => {
                        message.channel.bulkDelete(fetched);
                        message.reply(`deleted the last ${fetched.size} files from #bot-test`)
                            .then(msg => msg.delete({timeout: 5000}));
                        console.log(`all: deleted ${fetched.size} files from #bot-test`);
                    });
                }
            });
        } else {
            // delete initial .bcc message first
            if (!message.deleted) message.delete();

            // delete last 4 messages
            message.channel.messages.fetch({limit: 4}).then(fetched => {
                message.channel.bulkDelete(fetched);
                message.reply(`deleted the last ${fetched.size} files from #bot-test`)
                    .then(msg => msg.delete({timeout: 5000}));
                console.log(`deleted ${fetched.size} files from #bot-test`);
            });
        }
    }
}