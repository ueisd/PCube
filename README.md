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


## Mise en place du projet (Linux) (Possiblement avec Terminal Ubuntu sur W10) 

### Installation de Python3.8

Afin de pouvoir faire fonctionner le projet, nous devons tous d'abord mettre en place un environnement virtuel. La version **Python3.8** a été choisi pour la réalisation de l'application. 

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

### Installer la base de données Sqlite3

Commande pour l'installation :

- Sqlite3 : `sudo apt-get install sqlite3`

Vous devriez commencer par effacer la base de données courrante (**pcube.db**) si elle est existante. (En cas qu'il y a eu des changements aux scripts) 

La base de données est dans **PCube-API/db/database/pcube.db**.

Vous pouvez ensuite faire les commandes suivantes dans **/database**:

Sur le terminal : `sqlite3 pcube.db`
Sur Sqlite3 : `.read pcube.sql`
Sur Sqlite3 : `.read data_generation.sql`
Sur Sqlite3 : `select * from user;` (Pour tester que le tout fonctionne)


### Installer les dépences Flask et Angular

**_!!! Votre environnement virtuel doit être activé pour les dépendances Flask !!!_**

Vous devez vous assurer d'avoir la dernière version de **pip** d'installer dans votre environnement virtuel. Simplement lancer la commande suivante `pip install --upgrade pip`

Une fois votre environnement virtuel activé, rendez-vous dans le dossier du Backend. Un fichier **requirements.txt** sera disponible pour automatiser l'installation. Entrez la commande suivante : `pip install -r requirements.txt`

Pour Angular, **NPM** doit être installer pour pouvoir gérer les dépendances. Voir la section **Installer NPM et RAML**.

Rendez-vous dans le dossier du Frontend et lancez la commande suivante : `npm install`.

Une fois l'installer complété, regarder votre terminal pour visualiser les codes d'erreurs. Il ce pourrait que la commande doit être lancer avec **sudo**. Regarder aussi pour un message du genre *found 1 low severity vulnerability*. Pas de panique, lancer la commande `npm audit fix`. Si rien ne se règle, on ne touche à rien. C'est "normal" la communauté travail pour régler ces problèmes.


### Démarrage de l'application

#### Flask

**_!!! Votre environnement virtuel doit être activé !!!_**

Pour démarrer l'application, simplement utiliser le Makefile fourni avec la commande `make`.
(Le fichier risque d'évoluer au fil du projet, garder un oeil ouvert.)

#### Angular

Simplement lancer `npm start`. 

## Makefile

Vous pouvez utiliser le Makefile du projet.
- `make` : Permets de démarrer le serveur Flask

