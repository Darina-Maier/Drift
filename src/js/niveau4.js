


/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutoncourir; 

export default class niveau4 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau4" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {

    this.load.image("bg4", "src/assets/tuilesn4/background_n4.png");
    this.load.image("t4", "src/assets/tuilesn4/Tileset_n4.png");
    
    // chargement de la carte
    this.load.tilemapTiledJSON("carte4", "src/assets/map_n4.json"); 

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
    
    const carten4 = this.add.tilemap( "carte4" );

    // chargement du jeu de tuiles
    const ts_bg4   = carten4.addTilesetImage("background_n4", "bg4");
    const ts_t4   = carten4.addTilesetImage("Tileset_n4", "t4");
    const tilesets = [ts_bg4, ts_t4];

    const calque_background4  = carten4.createLayer("calque_background_n4",  tilesets);
    const calque_plateformes4 = carten4.createLayer("calque_plateformes_n4", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes4.setCollisionByProperty({ estSolide: true });
    calque_plateformes4.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(100, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes4);
    this.cameras.main.setBounds(0, 0, 3072, 768); 
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    //animations
    this.toucheGravite = this.input.keyboard.addKey('G');
    boutoncourir = this.input.keyboard.addKey('C');
  }

  update() {
   if (boutoncourir.isDown) {
      if (this.player.direction == 'droite') {
      //  this.player.setOffset(76, 0);

        this.player.setVelocityX(300); // plus rapide en courant
        this.player.anims.play('courirdroite', true);
      } else {
      //    this.player.setOffset(36, 10);
        this.player.setVelocityX(-300); // plus rapide en courant
        this.player.anims.play('courirgauche', true); //gauche plus tard
      }
    } else {
      if (this.clavier.right.isDown) {
        this.player.setVelocityX(160);
        this.player.direction = 'droite'
        this.player.anims.play('anim_droite', true);
        this.player.setOffset(36, 10);

      } else if (this.clavier.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.direction = 'gauche'
        this.player.anims.play('anim_gauche', true);
        this.player.setOffset(42, 10);
      } else {
        this.player.setVelocityX(0); // ← action séparée
        if (this.player.direction == 'droite') {
          this.player.anims.play('immobiledroit', true);
        } else {
          this.player.anims.play('immobilegauche', true);
        }
      }
    }
      if (this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-300);
      }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
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

