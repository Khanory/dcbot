/* src/commands/mod.js */
const parseDur = require('../utils/parseDur');
const cfg      = require('../config');

module.exports = {
    name : 'mod',
    usage: '.mod <mute | vmute | timeout | ban | vip | sil> …',
    async run(msg,[action,...args]){
        const mbr = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        /* === SIL === */
        if (action==='sil'){
            if (!msg.member.permissions.has('ManageMessages')) return;
            const n = parseInt(args[0]); if(!n||n<1||n>100) return msg.reply('1‑100 sayı?');
            await msg.channel.bulkDelete(n+1,true);
            return msg.reply(`✅ ${n} mesaj silindi.`).then(m=>setTimeout(()=>m.delete(),4e3));
        }
        if (!mbr) return msg.reply('Kullanıcı belirt.');
        /* === MUTE === */
        if (action==='mute'){
            if (!msg.member.permissions.has('ModerateMembers')) return;
            const ms = parseDur(args[1]||''); if(!ms) return msg.reply('Süre? (5m,1h…)');
            await mbr.roles.add(cfg.ids.muteRole);
            setTimeout(()=>mbr.roles.remove(cfg.ids.muteRole).catch(),ms);
            return msg.reply(`${mbr} ${args[1]} metin susturuldu.`);
        }
        /* === VMUTE === */
        if (action==='vmute'){
            if (!msg.member.permissions.has('ModerateMembers')) return;
            const ms = parseDur(args[1]||''); if(!ms) return msg.reply('Süre?');
            await mbr.roles.add(cfg.ids.vMuteRole);
            setTimeout(()=>mbr.roles.remove(cfg.ids.vMuteRole).catch(),ms);
            return msg.reply(`${mbr} ${args[1]} ses susturuldu.`);
        }
        /* === TIMEOUT === */
        if (action==='timeout'){
            if (!msg.member.permissions.has('ModerateMembers')) return;
            const ms = parseDur(args[1]||''); if(!ms) return msg.reply('Süre?');
            await mbr.timeout(ms, args.slice(2).join(' ') || 'Mod timeout');
            return msg.reply(`${mbr.user.tag} ${args[1]} uzaklaştırıldı.`);
        }
        /* === BAN === */
        if (action==='ban'){
            if (!msg.member.permissions.has('BanMembers')) return;
            await mbr.ban({reason: args.slice(1).join(' ') || 'Mod ban'});
            return msg.reply(`${mbr.user.tag} banlandı.`);
        }
        /* === VIP toggle === */
        if (action==='vip'){
            if (!msg.member.permissions.has('ManageRoles')) return;
            const r=cfg.ids.vipRole;
            if (mbr.roles.cache.has(r)){ await mbr.roles.remove(r); msg.reply('VIP alındı.'); }
            else { await mbr.roles.add(r); msg.reply('VIP verildi.'); }
            return;
        }
        /* === bilinmeyen === */
        msg.reply(this.usage);
    }
};
