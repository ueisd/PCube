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

  
 

## Prérequis
 S'assurer de posséder les prérequis suivants:
| Nom| vérification | installation |
|--|--|--|
| Python >= 3.8 | `python --version` |  [installation sur ubuntu](https://linuxize.com/post/how-to-install-python-3-8-on-ubuntu-18-04/).
| npm | `npm -v` | `sudo apt install npm`
|sqlite3 | `sqltite3`| - linux `sudo apt-get install sqlite3`
| makefile | `make -v` | windows: `choco install make`
|pip| `python -m pip --version` |


## Installation
Placez le terminal dans le répertoire PCube contenant le répertoire  PCube-API.
Tapez la commande `make` pour installer l'application.

## Démmarage

Vous devez ensuite démarrer l'application.

Démarer le backend: `make app-run-dev`

Démarer la frontend: `make api-run-dev`

## Utilisation
**Accès:** utiliser l'adresse suivante: http://localhost:4200.

**Authentification:** Vous pourrez alors utiliser les codes suivants
| Compte       |email |password                     |
|--------------|------|-----------------------------|
|admin 		   |A 	|a |
|PM | P | p|
|Membre | M | m|
  


## Notes: 
l'application utilise un environnement vituel.


  

### Installer RAML
L'application fournit un API **REST** documenté avec **RAML**. Le document est généré automatiquement à chaque appel du **Makefile**. L'installation de **RAML** se fait uniquement par le gestionnaire de paquet **NPM**

Commande pour l'installation :
- RAML : `sudo npm i -g raml2html`

 
### Installer la base de données Sqlite3
La base de données **pcube.db** est dans l répertoire **PCube-API/db/database/**.

Vous pouvez ensuite faire les commandes suivantes dans ce répertoire 

1) Sur le terminal : `sqlite3 pcube.db`
2) Sur Sqlite3 : `.read pcube.sql`
3) Sur Sqlite3 : `.read data_generation.sql`
4) Sur Sqlite3 : `select * from user;` (Pour tester que le tout fonctionne)


Une fois l'installer complété, regarder votre terminal pour visualiser les codes d'erreurs. Il ce pourrait que la commande doit être lancer avec **sudo**. Regarder aussi pour un message du genre *found 1 low severity vulnerability*. Pas de panique, lancer la commande `npm audit fix`. Si rien ne se règle, on ne touche à rien. C'est "normal" la communauté travail pour régler ces problèmes.

### Demo
[Application déployée sur heroku](https://pcube-frontend.herokuapp.com/)
