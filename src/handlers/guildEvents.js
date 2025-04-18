const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const cfg       = require('../config');
const fetchExec = require('../utils/fetchExec');

module.exports = client => {

    /* === Ban / Unban === */
    client.on('guildBanAdd', async ban => {
        const ch = ban.guild.channels.cache.get(cfg.ids.banLog);
        if (!ch) return;
        const exec = await fetchExec(ban.guild, AuditLogEvent.MemberBanAdd, ban.user.id);
        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.error)
                .setAuthor({ name:'Yasaklandı',
                    iconURL:exec?.displayAvatarURL({dynamic:true}) || ban.user.displayAvatarURL() })
                .addFields(
                    { name:'Hedef',   value:ban.user.tag },
                    { name:'Yetkili', value:exec ? exec.tag : 'Bilinmiyor'}
                )
            ]});
    });

    client.on('guildBanRemove', async ban => {
        const ch = ban.guild.channels.cache.get(cfg.ids.banLog);
        if (!ch) return;
        const exec = await fetchExec(ban.guild, AuditLogEvent.MemberBanRemove, ban.user.id);
        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.success)
                .setAuthor({ name:'Yasak Kaldırıldı',
                    iconURL:exec?.displayAvatarURL({dynamic:true}) || ban.user.displayAvatarURL() })
                .addFields(
                    { name:'Kullanıcı', value:ban.user.tag },
                    { name:'Yetkili',   value:exec ? exec.tag : 'Bilinmiyor'}
                )
            ]});
    });

    /* === Rol ekleme / çıkarma === */
    client.on('guildMemberUpdate', async (oldM, newM) => {
        const ch = newM.guild.channels.cache.get(cfg.ids.roleLog);
        if (!ch) return;

        const added   = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id));
        const removed = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id));
        const exec = await fetchExec(newM.guild, AuditLogEvent.MemberRoleUpdate, newM.id) || { tag:'Bilinmiyor' };

        if (added.size)
            ch.send({ embeds:[ new EmbedBuilder()
                    .setColor(cfg.colors.success)
                    .setDescription(`${exec.tag} → ${newM.user} eklendi: ${added.map(r=>r.name).join(', ')}`) ]});
        if (removed.size)
            ch.send({ embeds:[ new EmbedBuilder()
                    .setColor(cfg.colors.error)
                    .setDescription(`${exec.tag} → ${newM.user} çıkarıldı: ${removed.map(r=>r.name).join(', ')}`) ]});
    });

    /* === Katılma / Ayrılma === */
    const inviteCache = new Map();
    client.on('ready', async () => {
        for (const [gid,g] of client.guilds.cache) {
            const inv = await g.invites.fetch().catch(()=>null);
            if (inv) inviteCache.set(gid, new Map(inv.map(i=>[i.code,i.uses])));
        }
    });

    client.on('inviteCreate', i => {
        const m = inviteCache.get(i.guild.id); if (m) m.set(i.code, i.uses);
    });
    client.on('inviteDelete', i => {
        const m = inviteCache.get(i.guild.id); if (m) m.delete(i.code);
    });

    client.on('guildMemberAdd', async m => {
        const ch = m.guild.channels.cache.get(cfg.ids.joinLeaveLog);
        if (!ch) return;

        if (cfg.ids.autoRole) m.roles.add(cfg.ids.autoRole).catch(()=>{});

        /* hangi davet kullanıldı? */
        const invs = await m.guild.invites.fetch().catch(()=>null);
        const prev = inviteCache.get(m.guild.id) || new Map();
        const used = invs?.find(i => prev.get(i.code) < i.uses);
        inviteCache.set(m.guild.id, new Map(invs?.map(i=>[i.code,i.uses])));
        const tag = used?.inviter?.tag || 'Bilinmiyor';

        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.success)
                .setThumbnail(m.user.displayAvatarURL({dynamic:true}))
                .setDescription(`${m.user.tag} katıldı`)
                .addFields(
                    { name:'Davet',      value:tag },
                    { name:'Üye Sayısı', value:`${m.guild.memberCount}` }
                )
            ]});
    });

    client.on('guildMemberRemove', m => {
        const ch = m.guild.channels.cache.get(cfg.ids.joinLeaveLog);
        if (!ch) return;
        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.error)
                .setThumbnail(m.user.displayAvatarURL({dynamic:true}))
                .setDescription(`${m.user.tag} ayrıldı`)
                .addFields({ name:'Üye Sayısı', value:`${m.guild.memberCount}` })
            ]});
    });

    /* === Mesaj sil / düzenle === */
    client.on('messageDelete', async m => {
        if (m.partial) try { await m.fetch(); } catch { return; }
        if (!m.guild || m.author?.bot || m.author?.id === cfg.ids.ignoredUser) return;

        const ch = m.guild.channels.cache.get(cfg.ids.msgLog);
        if (!ch) return;

        const exec = await fetchExec(m.guild, AuditLogEvent.MessageDelete, m.author.id);
        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.error)
                .setAuthor({ name: exec ? 'Silindi (Yetkili)' : 'Mesaj Silindi',
                    iconURL: exec?.displayAvatarURL({dynamic:true}) || m.author.displayAvatarURL({dynamic:true}) })
                .setDescription(m.content || '*Boş*')
            ]});
    });

    client.on('messageUpdate', async (o,n) => {
        if (n.partial) try { await n.fetch(); } catch { return; }
        if (!n.guild || n.author?.bot || n.author?.id === cfg.ids.ignoredUser) return;
        if (o.content === n.content) return;
        const ch = n.guild.channels.cache.get(cfg.ids.msgLog);
        if (!ch) return;
        ch.send({ embeds:[ new EmbedBuilder()
                .setColor(cfg.colors.warning)
                .setAuthor({name:'Mesaj Düzenlendi', iconURL:n.author.displayAvatarURL({dynamic:true})})
                .addFields(
                    {name:'Eski', value:o.content || '*Boş*'},
                    {name:'Yeni', value:n.content || '*Boş*'}
                )
            ]});
    });
};
