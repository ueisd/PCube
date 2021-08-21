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

Placez le terminal dans le répertoire racine
Taper la commande `docker-compose up` pour la première fois installera le backend suivi du forntend.
L'application démarera ensuite dans le même ordre et il vous sera possible d'attacher un debugger au frontend et/ou au backend

## Informations d'utilisation

**Accès:** utiliser l'adresse suivante: http://localhost:4200. pour accéder au frontend.
http://localhost:5000 peut être utilisée pour voir si le backend fonctionne en affichant une page html
contenant un titre nommé accueil.

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

### Demo

[Frontend déployée sur heroku](https://pcube-frontend.herokuapp.com/)

[Backend déployée sur heroku](https://pcube-backend.herokuapp.com/)

[Buildpack utilisé pour le backend heroku](https://github.com/ueisd/PCUBE-front-buildpack)

## License

Le projet est sous licence MIT X11.

Consulter le fichier [LICENSE.md](LICENSE.md) pour les détails de la licence.
