const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');
const http = require('http');
const { jeux, groupe, admin, info } = require('./commandes');

// GARDE RENDER ACTIF
http.createServer((_, res) => res.end('Bot actif')).listen(3000);

const ADMIN = '237683581326@s.whatsapp.net' // MET TON NUMERO ICI
const PREFIX = '!'

const start = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), auth: state });

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = await sock.requestPairingCode('237683581326'); // MET TON NUMERO
            console.log(chalk.green(`\n======== CODE: ${code} ========\n`));
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if(u.connection === 'open') console.log(chalk.blue('✅ EMPEROR BOT ON'));
        if(u.connection === 'close') start();
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!texte.startsWith(PREFIX)) return;

        const args = texte.slice(PREFIX.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        // MENU BOUTONS
        if(cmd === 'menu') {
            await sock.sendMessage(from, {
                text: `┌─◉ *EMPEROR BOT PRO*\n│ Choisis une catégorie 👇\n└───────────◉`,
                buttons: [
                    {buttonId: 'jeux', buttonText: {displayText: '🎮 JEUX'}, type: 1},
                    {buttonId: 'groupe', buttonText: {displayText: '👥 GROUPE'}, type: 1},
                    {buttonId: 'admin', buttonText: {displayText: '⚙️ ADMIN'}, type: 1},
                    {buttonId: 'info', buttonText: {displayText: 'ℹ️ INFO'}, type: 1},
                ], headerType: 1
            });
        }

        // BOUTONS
        if(msg.message.buttonsResponseMessage) {
            const id = msg.message.buttonsResponseMessage.selectedButtonId;
            if(id === 'jeux') return sock.sendMessage(from, {text: jeux()});
            if(id === 'groupe') return sock.sendMessage(from, {text: groupe()});
            if(id === 'admin') return sock.sendMessage(from, {text: admin()});
            if(id === 'info') return sock.sendMessage(from, {text: info()});
        }

        // COMMANDES SIMPLES
        if(cmd === 'ping') sock.sendMessage(from, { text: `🏓 PONG!` });
        if(cmd === 'owner') sock.sendMessage(from, { text: `👑 Owner: Armel` });

    });
}
start();