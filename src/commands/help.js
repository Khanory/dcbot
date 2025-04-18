module.exports = {
    name: 'yardım',
    aliases: ['help'],
    run(msg) {
        msg.reply(
            `**Komutlar**
• ping
• avatar [@kullanıcı]
• ship [@kullanıcı]
• panel             (rol menüsü)
• mod mute/ban …    (moderasyon)
`)
    }
};
