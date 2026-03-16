

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;


// définition de la classe "selection"
export default class pageprincipale extends Phaser.Scene {
  constructor() {
    super({ key: "pageprincipale" }); // mettre le meme nom que le nom de la classe
  }

  /***********************************************************************/
  /** FONCTION PRELOAD 
/***********************************************************************/

  preload() {
    // fond étoiles 
    this.load.image("nightskycolor", "src/assets/nightskycolor.png");
//PLANETES 
    this.load.image('planete1', 'src/assets/planet1.png'); // jaune/verte
    this.load.image('planete2', 'src/assets/planet2.png'); // bleue
    this.load.image('planete3', 'src/assets/planet4.png'); // marron/rouge
    this.load.image('planete4', 'src/assets/planet5.png'); // rose
    this.load.image('planete5', 'src/assets/planet7.png'); // verte
    this.load.image('planete6', 'src/assets/planet10.png'); // orange/rouge
    this.load.image('planete7', 'src/assets/planet15.png');
    this.load.image('planete8', 'src/assets/planet18.png');
    this.load.image('planete9', 'src/assets/planet19.png');
    this.load.image('plateforme1', 'src/assets/plateforme1.png', {
        frameWidth: 64,
        frameHeight: 32
    });

    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
        frameWidth: 130,
        frameHeight: 90
    });
  }

  /***********************************************************************/
  /** FONCTION CREATE 
/***********************************************************************/

  create() {
    this.add.image(1024, 384, 'nightskycolor'); // ← nightskycolor pas fond_espace

   var p1 = this.physics.add.staticSprite(224,  384, 'planete1');
    var p2 = this.physics.add.staticSprite(448,  384, 'planete2');

    this.add.image(672,  384, 'planete3');
    this.add.image(896,  384, 'planete4');
    this.add.image(1120, 384, 'planete5');
    this.add.image(1344, 384, 'planete6');
    this.add.image(1568, 384, 'planete7');
    this.add.image(1792, 384, 'planete8');
    this.physics.add.staticSprite(224,  384, 'plateforme1');

    p1.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p1.body.setOffset(56, 56); // décale la hitbox de 64 pixels vers la gauche et 64 pixels vers le haut pour la centrer sur le sprite
    
    
    
    player = this.physics.add.sprite(130, 10, 'astronaut'); 
    player.setSize(65, 45); // réduit la taille du sprite de moitié


    player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 2048, 768);
    this.cameras.main.setBounds(0, 0, 2048, 768);
    this.cameras.main.startFollow(player);

    clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, p1);
    player.setVelocityX(100); // vitesse horizontale constante vers la droite
  }

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {

}
}
/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/
