# Travail de session

## Description

UQAM

Cours : INF6150

Groupe : 10

Un organisme communautaire Le Petit Peuple souhaiterait que soit réalisé un système de suivi des heures bénévoles. Le projet permettrait au client de comptabiliser les heures bénévoles effectuées dans l’organisme pour contrôler la performance de ses membres ou de ses projets et informer ses partenaires/donateurs sur les performances de l’organisme.

## Auteurs

- Boutaous, Oussema

- Limane, Mouad

- Maître, Pierre-Luc

- Patel, Miteshbai

- Richer Stébenne, Sébastien

- Arcole, Alexandre-Thibault

## Prérequis

S'assurer de posséder les prérequis suivants:
| Nom| vérification |
|--|--|
| docker | `docker -v`
| docker compose | `docker-compose -v`

## Installation locale et démarrage

### Mettre en place les variables d'environnement

Invariants: assurez vous de toujours définir les variables d'environnement suivantes avec les bonnes valeurs avant d'installer ou démarrer l'application.

- EMAIL_USERNAME=emailbidon@gmail.com
- EMAIL_PASSWORD=passwordbidon
- SECRET_KEY=grosseCleSecreteAChangerQuiDoitAvoirDesCaracteresSpeciaux

**\*Notes**: Les valeurs doivent être différentes de cet exemple

#### Configuration en local

Si vous souhaitez utiliser un fichier pour déclarer vos variables d'environnement, veuillez le créer à la racine du projet et obligatoirement l'intituler `.env.compose` afin que le fichier soit ignoré par git.
L'utilisation de fichier de configuration comportant des informations de sécurité est souvent déconseillé en production.

### Utilisation des commandes d'installation et de démarrage

**\*Important**: Assurez vous d'avoir définis les variables d'environnement comme demandé à l'étape _Mettre en place les variables d'environnement_.

#### En développement:

- Dans un terminal, placez vous d'abord à la racine du projet.
- Si vous utilisez un fichier le configuration pour les variables d'environnement, taper la commande `docker compose --env-file ./.env.compose -f docker-compose.dev.yml up`. Sinon tapez la commande sans `--env-file ./.env.compose`.
  - Lors de la première utilisation de cette commande, l'application sera installé puis executé. Les autres fois, la commande executera l'application.
- Une fois l'application démarrée, il vous sera possible d'attacher un debugger au frontend et/ou au backend. Une préconfiguration des dégugger existe pour vs code dans `.vscode/launch.json`.

## Utilisation

### Utilisation locale (souvent pour le développement)

**\*Note**: L'étape _Installation locale et démarrage_ doit être complétée

**Accès :**

- Frontend: http://localhost:4200
  interface graphique utilisée par les utilisateurs
- Backend: http://localhost:5000
  Peut être utilisée pour voir si le backend fonctionne en affichant une page html le cas échéant.

  **\*Note**: Lors de l'accès au frontend, les informations pour vous connectés sont dans la section _Authentification aux frontends_

### Utilisation du démo en ligne

Ne nécéssite aucune étape préalable (pas d'installation)

- [Frontend déployée sur heroku](https://pcube-frontend.herokuapp.com/)
- [Backend déployée sur heroku](https://pcube-backend.herokuapp.com/)

**\*Note**: Lors de l'accès au frontend, les informations pour vous connectés sont dans la section _Authentification aux frontends_

### Authentification aux frontends:

L'interface graphique vous demandera un nom d'utilisateur et un mot de passe.
Voici des comptes disponnibles après l'intallation:
| Compte |email |password |
|--------------|------|-----------------------------|
|admin |A |a |
|PM | P | p|
|Membre | M | m|
**\*Notes** Changez rapidement ces informations (sauf sur le démo heroku)

## Notes

### La persistance des données

Le système utilise une base de donnée mysql et les données sont souvent réinitialisées lors des builds.
L'utilisation d'un autre système de base de données est prévue dans le roadmap mais il est possible qu'elle implique de changer l'hébergeur du démo.

### L'authentification:

L'utilisation de variables d'environnement pour un compte administrateur initial sera privillégié dans le roadmap plutôt que d'utiliser un préset de données pour le spécifier.

### Le démo en ligne

- Le backend du démo en ligne utilise la stack container d'heroku.
- [Buildpack utilisé pour le frontend heroku](https://github.com/ueisd/PCUBE-front-buildpack)
- Le choix d'heroku permet un déploiement automatique mais la séparation en deux services permet déviter d'utiliser docker compose qui nécéssiterait d'installer un `addons` payant.
- Les bases de données sont fréquement rechargées avec les données initiales d'installation.

## License

Le projet est sous licence MIT X11.

Consulter le fichier [LICENSE.md](LICENSE.md) pour les détails de la licence.
