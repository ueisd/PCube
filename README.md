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

## Installation locale et utilisation

### 1 variables d'environnement

Invariants: assurez vous de toujours définir les variables d'environnement suivantes avec les bonnes valeurs. Les valeurs doivent être différentes de cet exemple:

- EMAIL_USERNAME=emailbidon@gmail.com
- EMAIL_PASSWORD=passwordbidon
- SECRET_KEY=grosseCleSecreteAChangerQuiDoitAvoirDesCaracteresSpeciaux

- **Configuration en local**
  Si vous souhaitez utiliser un fichier, veuillez le mettre à la racine et obligatoirement l'intituler `.env.compose` afin que le fichier soit ignoré par git.
  L'utilisation de fichier de configuration comportant des informations de sécurité est souvent déconseillé en production

### 2 Commande d'installation

**\*Important**: Assurez vous d'avoir définis les variables d'environnement comme demandé à l'étape précédente.

- **En développement**: Si vous utilisez un fichier le configuration pour les variables d'environnement, taper la commande `docker compose --env-file ./.env.compose -f docker-compose.dev.yml up client`. Sinon tapez la commande sans `--env-file ./.env.compose`. Lors de la première utilisation de cette commande l'application sera installé puis executé. Les autres fois, la commande executera l'application.
  Pour démarer le service api défini dans docker compose, vous devez également avoir définis et utilisé les variables d'environnement.

L'application démarera ensuite il vous sera possible d'attacher un debugger au frontend et/ou au backend.

## Informations d'utilisation locale

**Accès :**

- utiliser l'adresse suivante: http://localhost:4200. pour accéder au frontend.
- http://localhost:5000 peut être utilisée pour voir si le backend fonctionne en affichant une page html contenant un titre nommé accueil.

**Authentification:** Vous pourrez utiliser les codes suivants
| Compte |email |password |
|--------------|------|-----------------------------|
|admin |A |a |
|PM | P | p|
|Membre | M | m|

### note sur la persistance des données

Le système utilise une base de donnée mysql et les données sont souvent réinitialisées lors des builds.
L'utilisation d'un autre système de base de données est prévue dans le roadmap mais imliquera possiblement de changer l'hébergeur du démo

### note sur la sécurité

L'application ne manipule aucune donnée sensibles pour le moment mais le roadmap priorisera l'utilisation de variables d'evironnement afin de stocker les mots de passes et les clés.

### Demo en ligne

[Frontend déployée sur heroku](https://pcube-frontend.herokuapp.com/)

[Buildpack utilisé pour le frontend heroku](https://github.com/ueisd/PCUBE-front-buildpack)

[Backend déployée sur heroku](https://pcube-backend.herokuapp.com/)

Le backend du démo en ligne utilise la stack container d'heroku.
Le frontend en ligne devrait permettre de s'authentifier avec les mêmes identifiants que cités plus haut dans la section de documentation intitulée Authentification.

## License

Le projet est sous licence MIT X11.

Consulter le fichier [LICENSE.md](LICENSE.md) pour les détails de la licence.
