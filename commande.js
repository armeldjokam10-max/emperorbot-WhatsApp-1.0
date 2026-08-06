const jeux = () => `🎮 *CATEGORIE JEUX* 🎮
!ping - Tester la vitesse
!points - Voir tes points
!addpoint - Gagner 10 points
!morpion - Jouer au morpion
!bombe - Jeu de la bombe
!devine - Devine le nombre
!8ball - Pose une question`

const groupe = () => `👥 *GESTION DE GROUPE* 👥
!kick @membre - Expulser
!add 2376... - Ajouter
!promote @ - Rendre admin
!demote @ - Retirer admin
!antiliens on/off - Bloquer les liens
!welcome on/off - Message bienvenue
!groupinfo - Info du groupe
!tagall - Mentionner tous`

const admin = () => `⚙️ *COMMANDES ADMIN BOT* ⚙️
!ban @ - Bannir
!unban @ - Débannir
!broadcast msg - Message à tous
!setpp - Changer photo de profil
!vv - Activer anti vue unique
!clear - Vider les messages
!restart - Redémarrer le bot`

const info = () => `ℹ️ *INFOS EMPEROR BOT PRO* ℹ️
🤖 Nom: EMPEROR BOT PRO
👑 Créateur: Armel Djokam
⚡ Version: 2.0.0
📍 Prefix:!
🔥 Status: En ligne 24/24
📞 Contact Owner:!owner`

const download = () => `📥 *TELECHARGEMENT* 📥
!yt lien - Télécharger Youtube
!tiktok lien - Télécharger TikTok
!fb lien - Télécharger Facebook
!img recherche - Chercher image`

const ai = () => `🧠 *INTELLIGENCE ARTIFICIELLE* 🧠
!ai question - Poser une question
!gpt question - ChatGPT
!imagine prompt - Générer image IA`

module.exports = { jeux, groupe, admin, info, download, ai };