
/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutoncourir; 

export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {
    this.load.audio("musiqueNiveau3", "src/assets/sons/niveau3.ogg");
    this.load.image("bg", "src/assets/tuilesn3/background_n3.png");
    this.load.image("t1", "src/assets/tuilesn3/Tileset_n3.png");
    
    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/map_n3.json"); 

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

  // lance la musique du niveau 3
  this.musiqueNiveau3 = this.sound.add("musiqueNiveau3", {
    loop: true,
    volume: 0.5
});

this.musiqueNiveau3.play();
    
    const carten3 = this.add.tilemap( "carte" );

    // chargement du jeu de tuiles
    const ts_bg   = carten3.addTilesetImage("background_alien", "bg");
    const ts_t1   = carten3.addTilesetImage("platform", "t1");
    const tilesets = [ts_bg, ts_t1];

    const calque_background  = carten3.createLayer("calque_alien1",  tilesets);
    const calque_plateformes = carten3.createLayer("calque_plateform_alien", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes.setCollisionByProperty({ estSolide: true });
    calque_plateformes.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(100, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes);
    this.cameras.main.setBounds(0, 0, 3072, 768); 
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra
    
    //touches definies
    this.toucheGravite = this.input.keyboard.addKey('G');
    this.graviteDirection = 'bas'; // démarre vers le bas
    this.physics.world.gravity.set(0, 300); 
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
    if (this.musiqueNiveau3) {
        this.musiqueNiveau3.stop();
    }
        this.scene.start('pageprincipale');
}
// appuie sur G pour changer la gravité 
if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
    if (this.graviteDirection == 'bas') {
        this.graviteDirection = 'gauche';
        this.physics.world.gravity.set(-300, 0);
        this.player.setAngle(-90); // tourne le sprite
    } else if (this.graviteDirection == 'gauche') {
        this.graviteDirection = 'haut';
        this.physics.world.gravity.set(0, -300);
        this.player.setAngle(180);
    } else if (this.graviteDirection == 'haut') {
        this.graviteDirection = 'droite';
        this.physics.world.gravity.set(300, 0);
        this.player.setAngle(90);
    } else if (this.graviteDirection == 'droite') {
        this.graviteDirection = 'bas';
        this.physics.world.gravity.set(0, 300);
        this.player.setAngle(0);
    }
}
  }
}



