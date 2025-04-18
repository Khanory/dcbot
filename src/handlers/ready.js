const { ActivityType } = require('discord.js');
const cfg = require('../config');

module.exports = client => {
    client.once('ready', () => {
        console.log(`🔗  Logged in as ${client.user.tag}`);
        client.user.setActivity(`${cfg.prefix}yardım`, { type: ActivityType.Listening });
    });
};
