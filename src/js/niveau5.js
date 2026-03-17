
/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutoncourir; 

export default class niveau5 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau5" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {

    this.load.image("bg5", "src/assets/tuilesn5/background_n5.png");
    this.load.image("t5", "src/assets/tuilesn5/Tileset_n5.png");
    
    // chargement de la carte
    this.load.tilemapTiledJSON("carte5", "src/assets/map_n5.json"); 

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
    
    const carten5 = this.add.tilemap( "carte5" );

    // chargement du jeu de tuiles
    const ts_bg5   = carten5.addTilesetImage("background_n5", "bg5");
    const ts_t5   = carten5.addTilesetImage("plateforme_n5", "t5");
    const tilesets = [ts_bg5, ts_t5];

    const calque_background5  = carten5.createLayer("calque_background_n5",  tilesets);
    const calque_plateformes5 = carten5.createLayer("calque_plateformes_n5", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes5.setCollisionByProperty({ estSolide: true });
    calque_plateformes5.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(270, 10, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes5);
    this.cameras.main.setBounds(0, 0, 3072, 768); 
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

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

      if (this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-300);
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
        this.scene.start('pageprincipale');
}
    }
  }

