const { prefix } = require('../config.json');

// string for code blocks in discord messages
const cblock = '```';

// throws an error if any of the command's permissions are invalid
const validatePermissions = (permissions) => {
    // validPermissions is an array of all possible Discord permissions
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ];
    
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission ${permission}`);
        }
    }
}


module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'you do not have permission to run this command!',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions;

    // commands can be an array of aliases, or a single string; this converts single string commands to array
    if (typeof commands === 'string') {
        commands = [commands];
    }

    // permissions can be a single string or an array; do the same conversion to array as above
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }

        // validate all given permissions (this line errors)
        validatePermissions(permissions);
    }

    // wrap requiredRoles in an array, if not in one already
    if (requiredRoles.length) {
        if (typeof requiredRoles === 'string') {
            requiredRoles = [requiredRoles];
        }
    }

    client.on('message', (message) => {
        const { member, content, guild } = message;
        const author = member;

        // ignore commands from other bots
        if (author.bot) return;

        // ignore messages that aren't in guilds (e.g. DMs)
        if (!guild) return;

        for (const alias of commands) {
            let command = `${prefix}${alias.toLowerCase()}`
            if (content.toLowerCase().startsWith(command)) {
                // validate permissions of the author
                for (const permission of permissions) {
                    if (!author.hasPermission(permission)) {
                        message.reply(permissionError);
                        return;
                    }
                }

                // validate required roles in the guild and of the author
                for (const requiredRole of requiredRoles) {
                    // ensure the role exists in the guild first
                    const role = guild.roles.cache.find(role => role.name === requiredRole);
                    if (role === undefined) {
                        message.reply(`the role ${requiredRole} doesn't exist in this server! please add it and try again`);
                        return;
                    }

                    // ensure the author has that role
                    if (!author.roles.cache.has(role.id)) {
                        message.reply(`you don't have the required role of ${requiredRole}`);
                        return;
                    }
                }

                // split content into command and arguments (on any number of spaces); drop command from args array
                const args = content.split(/\s+/);
                args.shift(); // shift removes the first elem of an array and returns it

                // validate number of arguments
                if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
                    message.reply(`invalid syntax! your message should look like this: ${cblock}${command} ${expectedArgs}${cblock}`);
                    return;
                }

                // finally, handle that command's code
                callback(message, args);

                // author has run a valid command
                console.log(`User ${author.user.username} has run command ${command}`);
                return;
            }
        }
    })
}