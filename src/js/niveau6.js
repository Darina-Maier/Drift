


/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;

export default class niveau6 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau6" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {
    this.load.audio("musiqueNiveau6", "src/assets/sons/niveau6.ogg");

    this.load.image("bg6", "src/assets/tuilesn6/2_game_background.png");
    this.load.image("t6", "src/assets/tuilesn6/alien-planet-tileset.png");
    
    // chargement de la carte
    this.load.tilemapTiledJSON("carte6", "src/assets/map_n6.json"); 

    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
        frameWidth: 130,
        frameHeight: 90
    });
    this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
        frameWidth: 130,
        frameHeight: 90
    });
  }

  create() {
   // stoppe les anciennes musiques
    this.sound.stopAll();

    // musique niveau 2
    this.musiqueNiveau6 = this.sound.add("musiqueNiveau6", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau6.play();
    
    const carten6 = this.add.tilemap( "carte6" );

    // chargement du jeu de tuiles
    const ts_bg6   = carten6.addTilesetImage("niveau6", "bg6");
    const ts_t6   = carten6.addTilesetImage("alien-planet-tileset", "t6");
    const tilesets = [ts_bg6, ts_t6];

    const calque_background6  = carten6.createLayer("calque_background_niveau6",  tilesets);
    const calque_plateformes6 = carten6.createLayer("calque_platform_n6", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes6.setCollisionByProperty({ estSolide: true });
    calque_plateformes6.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(100, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes6);
    this.cameras.main.setBounds(0, 0, 3072, 768); 
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    //animations
    this.anims.create({
        key: 'anim_droite',
        frames: this.anims.generateFrameNumbers('astronaut', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'anim_gauche',
        frames: this.anims.generateFrameNumbers('astronautinverse', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'immobiledroit',
        frames: [ { key: 'astronaut', frame: 21 } ],
        frameRate: 1
    });
    this.anims.create({
        key: 'immobilegauche',
        frames: [ { key: 'astronautinverse', frame: 21 } ],
        frameRate: 1
    });
    this.anims.create({
        key: 'sautdroit',
        frames: this.anims.generateFrameNumbers('astronaut', { start: 30, end: 35 }),
        frameRate: 10
    })

    this.toucheGravite = this.input.keyboard.addKey('G');
  }

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160); 
      this.player.direction='droite'
      this.player.anims.play('anim_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160); 
      this.player.direction='gauche'
      this.player.anims.play('anim_gauche', true);
    } else{
      this.player.setVelocityX(0); // ← action séparée
    if (this.player.direction == 'droite') {
        this.player.anims.play('immobiledroit', true);
    } else {
        this.player.anims.play('immobilegauche', true);
      }
    }
    if (this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-400);
    }
    // /CHANGEMENT DE SCÈNE
    
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
    if (this.musiqueNiveau4) {
        this.musiqueNiveau4.stop();
    }
    this.scene.start('pageprincipale');

}
// appuie sur G pour changer la gravité 
if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
    if (this.gravityInverted == true) {
            this.player.body.gravity.y = -600;  // gravité vers le bas
this.gravityInverted = false;
//    this.physics.world.gravity.y = -200; // gravité vers le haut
    this.player.setFlipY(true); // retourne le sprite du joueur
      } else {
      this.gravityInverted = true;
      this.player.body.gravity.y = 0;  // gravité vers le bas
      this.player.setFlipY(false); // remet le sprite du joueur à l'endroit
}
  }
    }
  }

