# Travail de session
## Description
UQAM

Cours : INF6150

Groupe : 10

Un organisme communautaire Le Petit Peuple souhaiterait que soit réalisé un système de suivi des heures bénévoles. Le projet permettra au client de comptabiliser les heures bénévoles effectuées dans l’organisme pour contrôler la performance de ses membres ou de ses projets et informer ses partenaires/donateurs sur les performances de l’organisme.

## Auteurs

- Boutaous, Oussema (BOUO01029500)
- Limane, Mouad (LIMM15019000)
- Maître, Pierre-Luc (MAIP20118804)
- Patel, Miteshbai (PATM10119006)
- Richer Stébenne, Sébastien (RICS21109001)


## Mise en place du projet (Linux)

### Installation de Python3.8

Afin de pouvoir faire fonctionner le projet, nous devons tout d'abord mettre en place un environnement virtuel. La version **Python3.8** a été choisi pour la réalisation de l'application. 

Vérifier avec la commande `python3.8 --version` pour savoir si **Python3.8** est déjà installer sur votre machine. Si vous obtenez un message simulaire « *python3.8: command not found* », il faudrat alors suivre les étapes dans le guide [d'installation de Python 3.8](https://linuxize.com/post/how-to-install-python-3-8-on-ubuntu-18-04/).

**_!!! ATTENTION !!!_**

On veut seulement installer **Python3.8** sur la machine. Certains guide montre comment modifier l'environnement de Linux pour passer de **Python2.X** à **Python3.8**. Ne faite pas ça! Ubuntu principalement utilise des vieilles fonctionnalité disponible seulement dans la version 2. Nous allons utiliser un environnement virtuel pour forcer notre application à utiliser **Python3.8** 


### Environnement virtuel

Une fois **Python3.8** sur la machine, nous devons créer notre environnement virtuel à la racine du répertoire **GIT** avec la commande `python3.8 -m venv env`.

Par la suite, on active notre environnement avec `source env/bin/activate`


### Installer NPM et RAML
L'application fournit un API **REST** documenté avec **RAML**. Comme le document est généré automatiquement à chaque appel du **Makefile**, il est important d'avoir les outils installés sur le poste. Cependant, l'installation de **RAML** se fait uniquement par le gestionnaire de paquet **NPM**

Commande pour l'installation :

- NPM : `sudo apt install npm`

- RAML : `sudo npm i -g raml2html`


### Installer les dépences Flask et Angular

**_!!! Votre environnement virtuel doit être activé !!!_**

Vous devez vous assurer d'avoir la dernière version de **pip** d'installer dans votre environnement virtuel. Simplement lancer la commande suivante `pip install --upgrade pip`

De plus, **NPM** doit être aussi installer pour pouvoir gérer les dépendances d'Angular. Voir la section **Installer NPM et RAML**.

Lancer la commande du **Makefile** `make install-requirements`.


### Démarrage de l'application
Pour démarrer l'application, simplement utiliser le **Makefile** fourni avec la commande `make` ou `make run-debug` pour être en mode débogage. L'application devrait être disponible à l'URL suivant : [http://localhost:5000/](http://localhost:5000/)


## Makefile

Vous pouvez utiliser le Makefile du projet.
- `make` : Permets de démarrer le serveur en mode "normal".
- `make run-debug` : Permets de démarrer le serveur en mode débogage.
- `make raml` : Lance la création du doc.html avec raml2html
- `make install-requirements` : Installe les exigences du projet.
- `make pep8` : Permets de lancer la commande pep8 sur le dossier courrant.
- `make ng-build` : Génère les fichiers front-end de Angular
- `make ng-transfert-all-files` : Déplace les fichiers Angular dans les dossiers spécifique à Flask.

