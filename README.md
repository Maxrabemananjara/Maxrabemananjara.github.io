# Portfolio Mandrindra Rabemananjara

Portfolio personnel construit en site statique pour présenter un profil à l’intersection de la data, du contrôle de gestion, de la datavisualisation et du développement web.

Le site met en avant une sélection de projets concrets, des environnements professionnels, une stack technique orientée analyse et pilotage, ainsi qu’un parcours de formation structuré autour de la finance, de la donnée et des outils décisionnels.

## Lien

Site publié : [https://maxrabemananjara.github.io/](https://maxrabemananjara.github.io/)

## Objectif

Ce portfolio a pour objectif de présenter :

- un positionnement professionnel autour de la data, du contrôle de gestion et de la performance ;
- des projets construits sur des cas d’usage concrets ;
- des compétences en data engineering, analyse de données, datavisualisation et automatisation ;
- une capacité à transformer des données métier en supports clairs, exploitables et orientés décision.

## Sections du site

### Présentation

Vue d’introduction du profil, de l’approche métier et de la stack technique. Elle regroupe la présentation personnelle, les boutons d’action, les outils data et les outils métiers utilisés.

### Portfolio

Vue principale du site. Elle présente les projets sous forme de cartes, avec des actions distinctes pour consulter le détail, ouvrir un site ou accéder au dépôt associé quand il existe.

Projets actuellement intégrés :

- **Dashboard automatisé des trains supprimés** : chaîne data autour des trains SNCF supprimés, avec ingestion, structuration Bronze / Silver / Gold, contrôles qualité, dashboard public et publication web.
- **Analyse Mobilité Rhône** : analyse territoriale des mobilités du Rhône et de la Métropole de Lyon, avec préparation Python, restitution Power BI et lecture par temporalités et zones géographiques.

### Parcours

Vue consacrée aux organisations, aux réalisations et à la formation. Elle rassemble les structures qui ont fait confiance au profil, les accomplissements clés, la timeline de formation et les cartes écoles.

### Contact

Formulaire statique basé sur `mailto:`. Il prépare un message avec les champs saisis, sans ajouter de backend au site.

## Technologies utilisées

Le projet repose sur une base statique simple, sans framework ni étape de build obligatoire.

- HTML5
- CSS3
- JavaScript natif
- GitHub Pages
- Power BI intégré via iframe publiée
- Assets locaux : images, SVG, vidéo, PDF

Les technologies mises en avant dans le contenu du site incluent notamment Python, SQL, Power BI, Microsoft Fabric, Excel / VBA, R, Docker, GitHub, VS Code et plusieurs outils de datavisualisation ou de traitement de données.

## Fonctionnalités principales

- Navigation entre vues sans rechargement complet de page.
- Page Portfolio affichée par défaut.
- Thème clair par défaut avec bascule Light / Dark.
- Sauvegarde locale du thème sélectionné.
- Menu mobile déroulant avec fermeture au clic sur un lien ou hors du menu.
- Cartes projets avec actions dédiées.
- Pages projets détaillées accessibles depuis les cartes du portfolio.
- Carrousels pour les cartes projets, parcours et formation.
- Animations d’apparition au scroll.
- Intégration d’un rapport Power BI publié.
- Images et logos chargés depuis les assets locaux.
- Footer avec coordonnées, navigation et liens de contact.

## Arborescence

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── main.js
│   ├── images
│   │   ├── backgrounds
│   │   ├── heroes
│   │   └── original
│   ├── videos
│   │   └── original
│   └── documents
│       └── original
├── .nojekyll
├── .gitignore
└── README.md
```

## Rôle des fichiers principaux

- `index.html` : structure complète du site, contenus des vues et pages projets.
- `assets/css/style.css` : styles globaux, thèmes clair/sombre, responsive, composants visuels et pages projets.
- `assets/js/main.js` : navigation entre vues, changement de thème, menu mobile, carrousels, animations, ouverture des détails projets et intégration Power BI.
- `assets/images/` : logos, fonds, visuels de cartes, images projets et ressources graphiques.
- `assets/videos/` : vidéo de fond locale utilisée par le site.
- `assets/documents/` : documents téléchargeables, dont le CV au format PDF.
- `.nojekyll` : permet à GitHub Pages de servir les fichiers statiques sans traitement Jekyll.
- `.gitignore` : exclut les logs, captures temporaires et fichiers de travail locaux.

## Utilisation en local

Le site peut être ouvert directement dans un navigateur via `index.html`.

Pour un aperçu plus confortable, lancer un serveur local depuis le dossier du projet :

```powershell
python -m http.server 8000
```

Puis ouvrir :

```text
http://127.0.0.1:8000/
```

Avec VS Code, l’extension Live Server peut également être utilisée.

## Publication GitHub Pages

Le site est compatible avec GitHub Pages. La publication se fait depuis la branche principale du dépôt, avec `index.html` à la racine.

Étapes habituelles :

1. Vérifier le rendu localement.
2. Contrôler les fichiers modifiés.
3. Pousser les changements sur le dépôt GitHub.
4. Laisser GitHub Pages servir la nouvelle version.

## Qualité et organisation

Le projet privilégie une organisation simple et maintenable :

- séparation claire entre HTML, CSS, JavaScript et assets ;
- absence d’étape de build obligatoire ;
- composants visuels réutilisés entre sections ;
- navigation interne pilotée par JavaScript natif ;
- menu mobile isolé dans une règle responsive consolidée ;
- assets stockés localement pour limiter les dépendances externes ;
- contenu projet détaillé séparé de la vue portfolio principale.

## Pistes d’amélioration

- Compléter progressivement les projets avec de nouveaux cas documentés.
- Vérifier régulièrement les liens externes.
- Ajouter une page dédiée aux versions majeures du portfolio si le besoin apparaît.
- Prévoir une solution de formulaire côté service externe si un envoi direct devient nécessaire.
