# Capteur fermeture porte/fenêtre

## Description

Ce projet à pour objectif d'aider a l'économie d'energie en coupant les radiateurs d'une
habitation lorsqu'une fenêtre ou une porte est ouverte.

## Information général

* PAN  ID : 31415
  * Commande AT : ATID 31415
  
 ## End Device
 
* Pin D0 : Commisionning Button
  * Command AT : ATD0 1
  
* CE : Coordinator Enblaed -> Disable

## Coordinateur

* CE : Coordinator Enblaed -> Enable

## Endpoints de l'API

### Heater

Un Heater est un objet représentant un élement qui chauffe ou refroidit une pièce, tel qu'un poêle à bois, un radiateur, une climatisation...

| Protocole | Url   | Description                          | Paramètres                                                                                           |
|-----------|-------|--------------------------------------|------------------------------------------------------------------------------------------------------|
| GET       | /heaters/     | Récupère tout les radiateurs         |                                                                                                      |
| POST      | /heaters/     | Créé un nouveau radiateur            | * name (string): Nom du chauffage (facultatif)<br>* adress64 (string): Adresse MAC du XBee              |
| GET       | /heaters/[id] | Récupère le radiateur avec l'ID [id] |                                                                                                      |
| PUT       | /heaters/[id] | Remplace le radiateur à l'ID [id]    | * name (string): Nom du chauffage (facultatif)<br>* adress64 (string): Adresse MAC du XBee              |
| DELETE    | /heaters/[id] | Supprime le radiateur avec l'ID [id] |                                                                                                      |
| PATCH     | /heaters/[id] | Modifie le radiateur à l'ID [id]     | * name (string): Nom du chauffage (facultatif)<br>* adress64 (string): Adresse MAC du XBee (facultatif) |

### Opening

Un Opening est un objet représentant une ouverture quelconque, que ce soit une porte, une fenêtre, une baie vitrée...

| Protocole | Url            | Description                         | Paramètres                                                                                                                                                                                                                                  |
|-----------|----------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET       | /openings/     | Récupère toutes les ouvertures      |                                                                                                                                                                                                                                             |
| POST      | /openings/     | Créé une nouvelle ouverture         | * name (string): Nom de l'ouverture (facultatif) <br>* adress64 (string): Adresse MAC du XBee associée à l'ouverture <br>* opened (boolean): Etat de l'ouverture, avec ```true``` un état ouvert et ```false``` un état fermé.              |                                                                        | 
| GET       | /openings/[id] | Récupère l'ouverture avec l'ID [id] |                                                                                                                                                                                                                                                                                                                                                                                                             |
| PUT       | /openings/[id] | Remplace l'ouverture à l'ID [id]    | * name (string): Nom de l'ouverture (facultatif) <br>* adress64 (string): Adresse MAC du XBee associée à l'ouverture <br>* opened (boolean): Etat de l'ouverture, avec ```true``` un état ouvert et  ```false``` un état fermé.             |
| DELETE    | /openings/[id] | Supprime l'ouverture avec l'ID [id] |                                                                                                                                                                                                                                             |
| PATCH     | /openings/[id] | Modifie l'ouverture à l'ID [id]     | * name (string): Nom de l'ouverture (facultatif) <br>* adress64 (string): Adresse MAC du XBee associée à l'ouverture(facultatif) <br>* opened (boolean): Etat de l'ouverture, avec ```true``` un état ouvert et  ```false``` un état fermé. (facultatif) |

### Link

Un link est un objet connectant un Heater à un Opening.

| Protocole | Url         | Description                     | Paramètres                                                                                                                         |
|-----------|-------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| GET       | /links/     | Récupère toutes les liens       |                                                                                                                                    |
| POST      | /links/     | Créé un nouveau lien            | * adressHeater: Adresse MAC du XBee du chauffage <br>* adressOpening: Adresse MAC du XBee de l'ouverture                           |
| GET       | /links/[id] | Récupère le lien avec l'ID [id] |                                                                                                                                    |
| PUT       | /links/[id] | Remplace le lien à l'ID [id]    | * adressHeater: Adresse MAC du XBee du chauffage <br>* adressOpening: Adresse MAC du XBee de l'ouverture                           |
| DELETE    | /links/[id] | Supprime le lien avec l'ID [id] |                                                                                                                                    |
| PATCH     | /links/[id] | Modifie le lien à l'ID [id]     | * adressHeater: Adresse MAC du XBee du chauffage (facultatif) <br>* adressOpening: Adresse MAC du XBee de l'ouverture (facultatif) |

## Environnement de développement

### Pré-requis

* Docker
* Docker-Compose
* nodejs
* npm/yarn
* [driver com/usb](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)

### Etapes d'installation

1) Cloner le dépot git en faisant :
```git clone https://github.com/aydenhex/api-platform-iot.git```

2) Lancer le déploiement de l'application
```
cd api-platform-iot
docker-compose up
```

3) Vérifier que les containers sont bien lancés :
```docker ps```

### Diagramme de classe

<img src="https://zupimages.net/up/20/03/037m.png"/>

#### Disclaimer !

Il est impossible pour le container docker possédant node.js d'accéder aux ports COM.

Pour résoudre ce probleme : 

 1) Installez  node.js sur votre machine (si ce n'est pas déjà fait).
    liens : https://nodejs.org/en/

 2) Ouvrez un terminal (Powershell ou CMD) en mode administateur.

 3) Accédez à votre dossier.

 4) lancez les commandes suivantes : 
    ```
    npm install
    npm start

    ```
 
## Bug Tips
#### postgres Docker image is not creating database with custom name


à partir de Windows family docker toolbox peut engendrer des problèmes avec le lancement de la base de données postgresql


Pour résoudre ce problème:

1) Supprimer le volume ou est stocké le container qui gère la base de donneée
```
docker volume rm <nom-du-volume>
```
2.supprimer tous les processus docker et redémarrer son docker

3.relancer vos container docker
```
docker-compose build
docker-compose up
```

#### Error: dupplicate mount point

Plusieurs  processus docker sont lancés sur la machines et engendre des conflits 

 Pour résoudre ce problème:
 1) Supprimer tous les processus Docker
 
 2) vérifier quel processus utilise le port 80
 ``
 netstat -ab
 ``
 3) Supprimer les processus qui engendre un conflit et redémarrer son docker
 
 
 

 ## Description des composants
 
 L'application peut-être découpées en 4 éléments :
 
 1. Le composant socket - NODEJS :
    * Gère les frames reçues et envoyées par le coordinateur
    * Déclanche le processus d'enregistrement d'une ouverture (En envoyant une requête au composant API)
    * Déclanche le process de changement d'une porte (En envoyant une requête au composant API)
    * [WIP] Relance et éteint les radiateurs
 
 2. Le composant api - PHP/Symfony :
    * Permet la création, modification, suppression d'une ouverture
    * Permet la création, modification, suppression d'un radiateur
    * Permet de gérer les liaisons entre un radiateur et des ouvertures

 
 3. Le composant admin - ReactJS :
    * Permet l'administration de notre plateforme
 
 4. Le composant client - ReactJS :
    * [WIP]
 
