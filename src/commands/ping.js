module.exports = {
    name:'ping',
    run:(msg)=>msg.reply(`🏓 ${msg.client.ws.ping} ms`)
};
