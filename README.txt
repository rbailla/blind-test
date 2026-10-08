# Blind Test DJ Rems — VERSION INTERNET

Cette version permet aux équipes de répondre depuis :
- Wi‑Fi
- 4G
- 5G

Le PC de régie n'a PAS besoin d'être sur le même réseau que les téléphones.

## Déploiement recommandé : Render

Render propose des Web Services gratuits et accepte Node.js + WebSockets.
Documentation : https://render.com/docs/free
WebSockets : https://render.com/docs/websocket

### 1. Créer un compte Render
https://render.com/

### 2. Mettre ce dossier sur GitHub
Créer un nouveau dépôt GitHub et envoyer tous les fichiers du dossier.

### 3. Dans Render
New → Web Service → sélectionner le dépôt GitHub.

Paramètres :
- Runtime : Node
- Build Command : npm install
- Start Command : npm start
- Plan : Free

### 4. Variables d'environnement
Dans Environment Variables :
ADMIN_PIN = un code que tu choisis, par exemple 7392
ROOM_CODE = un code de salle, par exemple REMS26

### 5. Déployer
Render fournit une URL du type :
https://blindtest-dj-rems.onrender.com

La régie :
https://blindtest-dj-rems.onrender.com/admin.html

Les équipes :
https://blindtest-dj-rems.onrender.com/team.html

La régie affiche automatiquement le QR code et l'URL exacte à communiquer.

## ATTENTION — fiabilité
Le plan gratuit Render peut mettre un service en veille après 15 minutes sans trafic entrant. Il se réveille lorsqu'un navigateur se reconnecte, avec un démarrage pouvant prendre environ une minute. Pendant une prestation, garde la régie ouverte et teste le lien avant le début.

Les données de scores sont en mémoire : elles sont destinées à une session de blind test. Si le serveur redémarre, les scores de la session sont perdus.

Pour une vraie prestation importante, le plan payant ou une autre architecture persistante est préférable.

## Déroulement le soir
1. Ouvrir admin.html.
2. Entrer le PIN.
3. Afficher le QR code.
4. Les 10 équipes scannent le QR code avec leur téléphone.
5. Elles choisissent leur équipe et son nom.
6. Tu lances tes vidéos YouTube comme d'habitude.
7. Elles répondent depuis leur téléphone.
8. Tu fermes les réponses.
9. Tu corriges avec +1/+2/+3.
10. Question suivante.

Le système ne diffuse pas les vidéos : YouTube reste entièrement sous ton contrôle.
