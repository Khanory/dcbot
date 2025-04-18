const Canvas          = require('@napi-rs/canvas');
const { ids }         = require('../config');

module.exports = {
    name:'ship',
    async run(msg){
        if (msg.channel.id !== ids.shipChannel)
            return msg.reply(`<#${ids.shipChannel}> kanalında kullan.`);

        const author = msg.author;
        let userB   = msg.mentions.users.first();

        if (!userB){
            const members = await msg.guild.members.fetch();
            const pool = members
                .filter(m => !m.user.bot && m.id !== author.id)
                .map(m => m.user);
            userB = pool[Math.floor(Math.random() * pool.length)];
        }

        let pct = Math.floor(Math.random()*101);
        if ((author.id===ids.shipA && userB.id===ids.shipB) ||
            (userB.id===ids.shipA && author.id===ids.shipB)) pct = 100;

        const comment = pct<10 ? 'Denemeyin bile!'
            : pct<30 ? 'Ehh işte.'
                : pct<50 ? 'Fena değil.'
                    : pct<70 ? 'Olabilir gibi.'
                        : pct<90 ? 'Aşk kokusu alıyorum.'
                            : 'Gerçek Aşk <3';

        /* Görsel */
        const w=420,h=160,canvas=Canvas.createCanvas(w,h),ctx=canvas.getContext('2d');
        ctx.fillStyle='#2f3136';ctx.fillRect(0,0,w,h);

        const avA = await Canvas.loadImage(author.displayAvatarURL({extension:'png',size:128}));
        const avB = await Canvas.loadImage(userB.displayAvatarURL({extension:'png',size:128}));

        ctx.save();ctx.beginPath();ctx.arc(64,80,64,0,Math.PI*2);ctx.clip();ctx.drawImage(avA,0,16,128,128);ctx.restore();
        ctx.save();ctx.beginPath();ctx.arc(w-64,80,64,0,Math.PI*2);ctx.clip();ctx.drawImage(avB,w-128,16,128,128);ctx.restore();

        const barW=40,barH=128,x=(w-barW)/2;
        ctx.fillStyle='#40444b';ctx.fillRect(x,16,barW,barH);
        ctx.fillStyle='#ff4d6d';const filled=Math.round(barH*(pct/100));
        ctx.fillRect(x,16+barH-filled,barW,filled);
        ctx.font='20px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';
        ctx.fillText(`${pct}%`,w/2,h-10);

        msg.channel.send({
            content:`**${author.username} ❤ ${userB.username}**\n${comment}`,
            files:[{attachment:canvas.toBuffer('image/png'),name:'ship.png'}]
        });
    }
};
