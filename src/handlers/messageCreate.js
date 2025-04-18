const cfg  = require('../config');
const fs   = require('node:fs');
const path = require('node:path');

const commands = new Map();
fs.readdirSync(path.join(__dirname, '..', 'commands'))
    .filter(f=>f.endsWith('.js'))
    .forEach(f=>{
        const cmd = require(`../commands/${f}`);
        commands.set(cmd.name, cmd);
        (cmd.aliases||[]).forEach(a=>commands.set(a, cmd));
    });

module.exports = client => {
    client.on('messageCreate', async msg => {
        if (msg.author.bot || !msg.content.startsWith(cfg.prefix)) return;
        const [cmdName, ...args] = msg.content.slice(cfg.prefix.length).trim().split(/\s+/);
        const cmd = commands.get(cmdName.toLowerCase());
        if (cmd) cmd.run(msg, args, client);    // komuta client da geç
    });
};
