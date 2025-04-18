module.exports = {
    name:'yardım',
    aliases:['help'],
    run(msg){
        msg.reply(
            `**Genel**
• ping
• avatar [@kullanıcı]
• ship [@kullanıcı]
• panel  – Rol menüsü

**Moderasyon**
• mod mute @üye 5m
• mod vmute @üye 10m
• mod timeout @üye 1h
• mod ban @üye [sebep]
• mod vip @üye
• mod sil 30         (30 mesaj)

(Prefix: .)`);
    }
};
