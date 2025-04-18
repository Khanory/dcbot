const parseDur = require('../utils/parseDur');
const cfg      = require('../config');

module.exports = {
    name:'mod',
    async run(msg, [action, ...args]){
        if (!action) return msg.reply('Kullanım: `.mod mute/ban/vip …`');
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if (!member) return msg.reply('Kullanıcı belirt.');

        /* === mute === */
        if (action==='mute'){
            if (!msg.member.permissions.has('ModerateMembers')) return;
            const ms = parseDur(args[1]||''); if (!ms) return msg.reply('Süre?');
            await member.roles.add(cfg.ids.muteRole);
            setTimeout(()=>member.roles.remove(cfg.ids.muteRole).catch(), ms);
            return msg.reply(`${member} ${args[1]} metin susturuldu.`);
        }

        /* === ban === */
        if (action==='ban'){
            if (!msg.member.permissions.has('BanMembers')) return;
            const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
            await member.ban({reason});
            return msg.reply(`${member.user.tag} banlandı.`);
        }

        /* === vip toggle === */
        if (action==='vip'){
            if (!msg.member.permissions.has('ManageRoles')) return;
            const r = cfg.ids.vipRole;
            if (member.roles.cache.has(r)){
                await member.roles.remove(r);
                return msg.reply('VIP rolü alındı.');
            } else {
                await member.roles.add(r);
                return msg.reply('VIP rolü verildi.');
            }
        }
    }
};
