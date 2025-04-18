/* dbbot/index.js */
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');

const db = new sqlite3.Database(path.join(__dirname, 'stats.sqlite'));
db.run(`CREATE TABLE IF NOT EXISTS stats(userId TEXT PRIMARY KEY, messages INTEGER DEFAULT 0)`);

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates      // eklendi
    ]
});

client.on('ready', () => console.log('📊 DB bot aktif'));

client.on('messageCreate', async msg => {
    if (msg.author.bot || !msg.guild) return;

    /* mesaj sayaç */
    db.run(`INSERT INTO stats(userId,messages) VALUES(?,1)
            ON CONFLICT(userId) DO UPDATE SET messages=messages+1`, [msg.author.id]);

    /* komutlar */
    if (!msg.content.startsWith('.')) return;
    const [cmd, ...args] = msg.content.slice(1).trim().split(/\s+/);

    if (cmd === 'dbstats') {
        const target = msg.mentions.users.first() || msg.author;
        db.get(`SELECT messages FROM stats WHERE userId=?`, [target.id], (e,row)=>{
            const count = row?.messages || 0;
            msg.reply({ embeds:[ new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`${target.tag} mesaj sayısı`)
                    .setDescription(`**${count}** mesaj`)
                ]});
        });
    }

    /* yeni: .joindb */
    if (cmd === 'joindb') {
        if (msg.author.id !== process.env.JOIN_OWNER_ID) return;
        const vc = msg.member.voice.channel;
        if (!vc) return msg.reply('Önce bir ses kanalına gir.');
        joinVoiceChannel({
            channelId: vc.id,
            guildId:   msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
        msg.react('✅');
    }
});

client.login(process.env.DB_BOT_TOKEN);
