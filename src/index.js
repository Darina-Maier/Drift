// chargement des librairies
import pageprincipale from "/src/js/pageprincipale.js";
import niveau1 from "/src/js/niveau1.js";
import niveau5 from "/src/js/niveau5.js"; 
import niveau4 from "/src/js/niveau4.js";
import niveau3 from "/src/js/niveau3.js";
import niveau2 from "/src/js/niveau2.js";
import intro from "/src/js/intro.js";
import acceuil from "/src/js/acceuil.js";

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 1024, // largeur en pixels
  height: 768, // hauteur en pixels
   scale : {
    mode : Phaser.Scale.FIT, // le jeu s'adapte à la taille de l'écran en gardant les proportions
    autoCenter : Phaser.Scale.CENTER_BOTH // le jeu est centré horizontalement et verticalement
  },
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [acceuil, niveau1, niveau5, pageprincipale, intro, niveau2, niveau4, niveau3]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("acceuil");
