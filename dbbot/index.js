/*  Mesaj sayısını sqlite'a işler
    .dbstats   → kullanıcının mesaj sayısını gösterir               */

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path    = require('node:path');

const db = new sqlite3.Database(path.join(__dirname, 'stats.sqlite'));
db.run(`CREATE TABLE IF NOT EXISTS stats(userId TEXT PRIMARY KEY, messages INTEGER DEFAULT 0)`);

const client = new Client({ intents:[GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => console.log('📊 DB bot aktif'));

client.on('messageCreate', async msg => {
    if (msg.author.bot || !msg.guild) return;

    /* sayaç güncelle */
    db.run(`INSERT INTO stats(userId,messages) VALUES(?,1)
            ON CONFLICT(userId) DO UPDATE SET messages=messages+1`, [msg.author.id]);

    /* komut */
    if (!msg.content.startsWith('.')) return;
    const [cmd] = msg.content.slice(1).trim().split(/\s+/);
    if (cmd === 'dbstats'){
        const target = msg.mentions.users.first() || msg.author;
        db.get(`SELECT messages FROM stats WHERE userId=?`, [target.id], (e,row)=>{
            const count = row?.messages || 0;
            msg.reply({embeds:[ new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`${target.tag} mesaj sayısı`)
                    .setDescription(`**${count}** mesaj`)
                ]});
        });
    }
});

client.login(process.env.DB_BOT_TOKEN);
