const { EmbedBuilder } = require('discord.js');
const cfg   = require('../config');
const joinT = new Map();

module.exports = client => {
    client.on('voiceStateUpdate', (oldS, newS) => {
        const now = Date.now();
        const chLog = newS.guild.channels.cache.get(cfg.ids.voiceLog);
        if (!chLog) return;

        // kanala giriş
        if (!oldS.channelId && newS.channelId) {
            joinT.set(newS.id, now);
            chLog.send({ embeds: [ new EmbedBuilder()
                    .setColor(cfg.colors.success)
                    .setAuthor({ name:`${newS.member.user.tag} katıldı`,
                        iconURL:newS.member.displayAvatarURL({dynamic:true}) })
                    .addFields(
                        { name:'Kanal', value:newS.channel.name },
                        { name:'Zaman', value:`<t:${Math.floor(now/1000)}:F>` }
                    )
                ]});
        }
        // kanaldan çıkış
        else if (oldS.channelId && !newS.channelId) {
            const dur = Math.floor((now - (joinT.get(newS.id) || now))/1000);
            joinT.delete(newS.id);
            chLog.send({ embeds:[ new EmbedBuilder()
                    .setColor(cfg.colors.error)
                    .setAuthor({name:`${newS.member.user.tag} ayrıldı`,
                        iconURL:newS.member.displayAvatarURL({dynamic:true}) })
                    .addFields(
                        { name:'Kanal', value: oldS.channel.name },
                        { name:'Süre' , value:`${dur}s`}
                    )
                ]});
        }

        /* ====== Yayın Logu ====== */
        const streamLog = newS.guild.channels.cache.get(cfg.ids.streamLog);
        if (!streamLog) return;

        if (!oldS.streaming && newS.streaming) {
            streamLog.send({ embeds:[ new EmbedBuilder()
                    .setColor(cfg.colors.success)
                    .setAuthor({ name:`${newS.member.user.tag} yayına başladı`,
                        iconURL:newS.member.displayAvatarURL({dynamic:true}) })
                ]});
        } else if (oldS.streaming && !newS.streaming) {
            streamLog.send({ embeds:[ new EmbedBuilder()
                    .setColor(cfg.colors.error)
                    .setAuthor({ name:`${newS.member.user.tag} yayını durdurdu`,
                        iconURL:newS.member.displayAvatarURL({dynamic:true}) })
                ]});
        }
    });
};
