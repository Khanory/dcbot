/* src/commands/join.js */
const { joinVoiceChannel } = require('@discordjs/voice');

const OWNER_ID = process.env.JOIN_OWNER_ID

module.exports = {
    name: 'join',
    run(msg, _args, _client) {
        if (msg.author.id !== OWNER_ID)
            return msg.reply('Bu komutu sadece sahibim kullanabilir.');

        const vc = msg.member.voice.channel;
        if (!vc) return msg.reply('Önce bir ses kanalına katıl.');

        joinVoiceChannel({
            channelId: vc.id,
            guildId:   msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: true
        });
        msg.react('✅');
    }
};
