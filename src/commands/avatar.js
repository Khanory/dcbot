const { EmbedBuilder } = require('discord.js');
module.exports = {
    name:'avatar',
    aliases:['av'],
    run(msg){
        const u = msg.mentions.users.first() || msg.author;
        msg.reply({embeds:[ new EmbedBuilder()
                .setColor('Random')
                .setImage(u.displayAvatarURL({dynamic:true,size:1024}))
            ]});
    }
};
