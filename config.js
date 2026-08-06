require('dotenv').config();

module.exports = {
    OWNER: process.env.OWNER_NUMBER + '@s.whatsapp.net',
    PREFIX: process.env.PREFIX || '!',
    BOT_NAME: process.env.BOT_NAME || 'EMPEROR BOT PRO',
    SESSION_NAME: 'auth_info',
    DATABASE: './database.json',
    ANTI_VV: true,
    WELCOME: true
}