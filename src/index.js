const { Client, GatewayIntentBits, Partials } = require('discord.js');
const cfg = require('./config');

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ],
    partials:[Partials.Channel, Partials.Message, Partials.GuildMember]
});

/* === handler’ları yükle === */
['ready','messageCreate','voiceState','guildEvents'].forEach(ev =>
    require(`./handlers/${ev}`)(client)
);

/* === kontrollü kapatma === */
['SIGINT','SIGTERM'].forEach(sig => process.once(sig, async () => {
    try { if (client.isReady()) await client.destroy(); }
    finally { process.exit(0); }
}));

client.login(cfg.token);
