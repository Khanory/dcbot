require('dotenv').config();

module.exports = {
    prefix: process.env.PREFIX || '.',
    token : process.env.MAIN_BOT_TOKEN,
    ids: {
        shipChannel : process.env.SHIP_CHANNEL_ID,
        voiceLog    : process.env.VOICE_LOG,
        streamLog   : process.env.STREAM_LOG,
        banLog      : process.env.BAN_LOG,
        roleLog     : process.env.ROLE_LOG,
        joinLeaveLog: process.env.JOIN_LEAVE_LOG,
        msgLog      : process.env.MSG_LOG,

        muteRole : process.env.MUTE_ROLE_ID,
        vMuteRole: process.env.VMUTE_ROLE_ID,
        vipRole  : process.env.VIP_ROLE_ID,
        autoRole : process.env.AUTO_ROLE_ID,

        ignoredUser : process.env.IGNORED_ID,
        shipA       : process.env.SHIP_SPECIAL_A,
        shipB       : process.env.SHIP_SPECIAL_B
    },
    colors: {
        default : '#0099ff',
        success : '#00ff00',
        error   : '#ff0000',
        warning : '#ffa500',
        info    : '#00ffff'
    }
};
