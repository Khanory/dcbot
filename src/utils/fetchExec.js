const { PermissionsBitField } = require('discord.js');

// Audit‑log’tan eylemi yapan kişiyi çek
module.exports = async (guild, type, targetId = null) => {
    if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return null;
    await new Promise(r => setTimeout(r, 500));          // log’un oluşması için
    const logs = await guild.fetchAuditLogs({ type, limit: 5 });
    return logs.entries.find(e =>
        targetId ? e.target?.id === targetId
            : e.createdTimestamp > Date.now() - 5_000
    )?.executor || null;
};
