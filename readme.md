# Resalliance

## video démo:
*https://youtu.be/YkDsI6oYFAg*

## synthèse des fonctionnalités:

* Gestion des sessions utilisateurs (mdp requis): inscription/co/déconnexion de membres visiteur/inscrit/administrateur
* Possibilité de visiter la page des membres amis :
  * Informations personnelles visibles : pseudo, nom, prénom, photo, description, genre, date de 
naissance, adresse postale, adresse email, numéro de téléphone, liste de hobbies
  *  Zone publique : voir, les publications des autres membres, publier sur le mur, répondre à des 
commentaires
* Système de notification par email
* Système de recherche d’un membre enregistré (par nom/prénom/pseudo)
* Gestion des liens entre utilisateurs : inviter un membre à rejoindre sa liste d'amis, recommander un ami à 
un autre ami, retirer un ami de sa liste.
*  Accès à un espace chat en live, ainsi qu'une messagerie privée 
*  Accès visiteur aux statistiques du site
* Accès administrateur pour éditer ou supprimer des profils utilisateurs, voir les dates et heures de connexion, 
et les commentaires publiés (reçus et envoyés)

## Spécifications techniques:

### Technologies utilisées:
*  **FRONT-END** (css3 et html5): framework **angular** (dans dossier "client") et framework **bootstrap** utilisé pour 
que l'appli soit responsive et s'adapte à la taille de l'écran de l'utilisateur (mobile/tablette/ordinateur). 
* **BACK-END** : la plateforme de développement a recours a **NodeJS** accompagné du framework **ExpressJS**
(fichier "index.js" du dossier "serveur")

* Méthode asynchrone (sans rafraichissement de page) : gestion des échanges en temps réel : techno 
WebSockets : "**socket IO**"
*  Le serveur utilise un SGBD utilisant **mongoDB** version4 (voir détails dans annexe base de données intitulée 
“reseausocial”)


### Hébergement:

* HEROKU
   * url du front: *"https://resalliance-back.herokuapp.com"*
   * url du back : *"https://resalliance-back.herokuapp.com"*
* MONGODBATLAS
