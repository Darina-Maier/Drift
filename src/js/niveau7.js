


/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;

export default class niveau7 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau7" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {
    this.load.audio("musiqueNiveau7", "src/assets/sons/niveau7.ogg");

    this.load.image("bg7", "src/assets/tuilesn7/background_n7.png");
    this.load.image("t7", "src/assets/tuilesn7/Tileset_n7.png");

    // chargement des 9 images du téléporteur
    this.load.image('tp01', 'src/assets/teleporter/tp01.png');
    this.load.image('tp02', 'src/assets/teleporter/tp02.png');
    this.load.image('tp03', 'src/assets/teleporter/tp03.png');
    this.load.image('tp04', 'src/assets/teleporter/tp04.png');
    this.load.image('tp05', 'src/assets/teleporter/tp05.png');
    this.load.image('tp06', 'src/assets/teleporter/tp06.png');
    this.load.image('tp07', 'src/assets/teleporter/tp07.png');
    this.load.image('tp08', 'src/assets/teleporter/tp08.png');
    this.load.image('tp09', 'src/assets/teleporter/tp09.png');
    
    // chargement de la carte
    this.load.tilemapTiledJSON("carte7", "src/assets/map_n7.json"); 

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
    this.musiqueNiveau7 = this.sound.add("musiqueNiveau7", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau7.play();
    
    const carten7 = this.add.tilemap( "carte7" );

    // chargement du jeu de tuiles
    const ts_bg7   = carten7.addTilesetImage("background_n7", "bg7");
    const ts_t7   = carten7.addTilesetImage("platformes_n7", "t7");
    const tilesets = [ts_bg7, ts_t7];

    const calque_background7  = carten7.createLayer("calque_background_n7",  tilesets);
    const calque_plateformes7 = carten7.createLayer("calque_platform_n7", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes7.setCollisionByProperty({ estSolide: true });
    calque_plateformes7.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(300, 300, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes7);
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

    // animation du téléporteur avec les 9 images
this.anims.create({
  key: 'anim_teleporter',
  frames: [
    { key: 'tp01' },
    { key: 'tp02' },
    { key: 'tp03' },
    { key: 'tp04' },
    { key: 'tp05' },
    { key: 'tp06' },
    { key: 'tp07' },
    { key: 'tp08' },
    { key: 'tp09' }
  ],
  frameRate: 10, // vitesse de rotation
  repeat: -1     // boucle infinie
});

// création tp fin du niveau
this.teleporter = this.physics.add.sprite(3020, 300, 'tp01');
this.teleporter.body.allowGravity = false;
this.teleporter.setImmovable(true);

// animation en boucle 
this.teleporter.anims.play('anim_teleporter');
this.teleporter.setScale(0.3);
this.teleporter.setSize(150,200);
this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

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

    finNiveau(player, teleporter) {

  // optionnel : désactiver le joueur pour éviter multi déclenchement
  player.setVelocity(0);
  player.disableBody(true, true);

  // retour tp menu principal
  this.scene.start('pageprincipale');
}
  }

