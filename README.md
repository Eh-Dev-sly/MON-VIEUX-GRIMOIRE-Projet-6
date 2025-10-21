# Mon Vieux Grimoire 📚
#### *Site de notation de livres développé dans le cadre du projet 6 d'OpenClassrooms.*

## Description
Mon Vieux Grimoire est une application web permettant aux utilisateurs de :

- Créer un compte et se connecter
- Ajouter des livres avec leur image
- Noter les livres (de 0 à 5 étoiles)
- Consulter les livres les mieux notés

## Installation du projet
### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-nom-utilisateur-github/mon-vieux-grimoire.git
cd mon-vieux-grimoire
```
### 2. Installer les dépendances  
`cd backend`<br>
`npm install`

### 3. Configuration des variables d’environnement
Créez un fichier .env dans le dossier backend à la racine du projet, puis ajoutez les variables suivantes :  

```bash
MONGO_URI=votre_url_de_connexion_mongodb
PORT=4000
TOKEN_SECRET=une_chaine_secrete_pour_le_jwt
```

  *Exemple de MONGO_URI si vous utilisez MongoDB Atlas :*
  ```bash
  `MONGO_URI=mongodb+srv://nom_utilisateur:mot_de_passe@cluster0.mongodb.net/monvieuxgrimoire`
  ```

### 4. Lancer le projet
#### a. Démarrer le serveur backend

*Depuis le dossier backend :*

`npm start`


*Le serveur s’exécute par défaut sur :*

http://localhost:4000

#### b. Lancer le frontend

*Depuis le dossier frontend :*

`cd frontend`<br>
`npm install`<br>
`npm start`


*Le frontend tourne généralement sur :*

http://localhost:3000


L’application sera alors accessible avec le backend connecté.
