const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadContentFromMessage, proto } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');
const http = require('http');
const { jeux, groupe, admin, info, download, ai } = require('./commandes');

// ===== CONFIG - CHANGE ICI =====
const PREFIX = '!';
const ADMIN = '237683581326@s.whatsapp.net'; // MET TON VRAI NUMERO AVEC 237
const NOM_BOT = '👑 EMPEROR BOT PRO 👑';
// =================================

// GARDE RENDER ACTIF 24/24
http.createServer((_, res) => res.end('Bot actif')).listen(3000);

// SYSTEME DE POINTS
let points = {};
if(fs.existsSync('./points.json')) points = JSON.parse(fs.readFileSync('./points.json'));
const savePoints = () => fs.writeFileSync('./points.json', JSON.stringify(points));

const startBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), auth: state });

    // CODE DE PAIRING
    if (!sock.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const numero = ADMIN.split('@')[0];
        const code = await sock.requestPairingCode(numero);
        console.log(chalk.green(`\n======== TON CODE ========\nCODE: ${code}\n==========================\n`));
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if(u.connection === 'open') console.log(chalk.blue(`✅ ${NOM_BOT} CONNECTE`));
        if(u.connection === 'close') startBot();
    });

    // ANTI-VUE UNIQUE
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if(msg?.message?.viewOnceMessage) {
            const type = Object.keys(msg.message.viewOnceMessage.message)[0];
            const media = await downloadContentFromMessage(msg.message.viewOnceMessage.message[type], type);
            let buffer = Buffer.from([]);
            for await(const chunk of media) buffer = Buffer.concat([buffer, chunk]);
            sock.sendMessage(msg.key.remoteJid, { [type]: buffer, caption: '👁️ ANTI-VV PAR EMPEROR 👁️' }, { quoted: msg });
        }
    });

    // GESTION COMMANDES
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!texte.startsWith(PREFIX)) return;
        const args = texte.slice(PREFIX.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        // POINTS
        if(!points[sender]) points[sender] = 0;

        // MENU AVEC BOUTONS
        if(cmd === 'menu') {
            await sock.sendMessage(from, {
                text: `┌─◉ *${NOM_BOT}*\n│\n│ ✨ *SALUT CHEF* ✨\n│ Tes points: ${points[sender]}\n│ Choisis une catégorie 👇\n└───────────◉`,
                footer: 'Clique un bouton',
                buttons: [
                    {buttonId: 'jeux', buttonText: {displayText: '🎮 JEUX'}, type: 1},
                    {buttonId: 'groupe', buttonText: {displayText: '👥 GROUPE'}, type: 1},
                    {buttonId: 'download', buttonText: {displayText: '📥 DL'}, type: 1},
                    {buttonId: 'ai', buttonText: {displayText: '🧠 IA'}, type: 1},
                    {buttonId: 'admin', buttonText: {displayText: '⚙️ ADMIN'}, type: 1},
                ],
                headerType: 1
            });
        }

        // BOUTONS
        if(msg.message.buttonsResponseMessage) {
            const id = msg.message.buttonsResponseMessage.selectedButtonId;
            if(id === 'jeux') return sock.sendMessage(from, {text: jeux()});
            if(id === 'groupe') return sock.sendMessage(from, {text: groupe()});
            if(id === 'download') return sock.sendMessage(from, {text: download()});
            if(id === 'ai') return sock.sendMessage(from, {text: ai()});
            if(id === 'admin') return sock.sendMessage(from, {text: admin()});
        }

        // COMMANDES RAPIDES
        if(cmd === 'ping') sock.sendMessage(from, { text: `🏓 *PONG!* 100ms\n🤖 ${NOM_BOT} en ligne` });
        if(cmd === 'owner') sock.sendMessage(from, { text: `👑 *CREATEUR*\nArmel Djokam\nwa.me/237683581326` });
        if(cmd === 'points') sock.sendMessage(from, { text: `💰 *TES POINTS*: ${points[sender]}` });
        if(cmd === 'addpoint') { points[sender] += 10; savePoints(); sock.sendMessage(from, { text: `+10 points! Total: ${points[sender]}` }) }
        if(cmd === 'info') sock.sendMessage(from, { text: info() });

        // AJOUTE TES 100 AUTRES COMMANDES ICI
    });
}
startBot();