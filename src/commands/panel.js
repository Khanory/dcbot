const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name:'panel',
    async run(msg){
        if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
            return msg.reply('Rolleri yönetme iznin yok.');

        const gameMenu   = new StringSelectMenuBuilder()
            .setCustomId('select_game')
            .setPlaceholder('Oyun Rolleri')
            .addOptions(
                {label:'League of Legends', value:'1358763345481699394'},
                {label:'Valorant',          value:'1358763346270228500'},
                {label:'Rol İstemiyorum',   value:'remove_game'}
            );

        const row1 = new ActionRowBuilder().addComponents(gameMenu);
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_giveaway').setLabel('Çekiliş').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_event').setLabel('Etkinlik').setStyle(ButtonStyle.Secondary)
        );

        await msg.channel.send({
            embeds:[ new EmbedBuilder().setColor('Random').setTitle('Roller Menüsü').setDescription('Seçiminizi yapın') ],
            components:[row1,row2]
        });
    }
};
