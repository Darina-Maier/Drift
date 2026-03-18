
// SCENE NIVEAU 4


export default class niveau4 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau4" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }

  preload() {
    // Images des tilesets
    this.load.image("bg4", "src/assets/tuilesn4/background_n4.png");
    this.load.image("t4", "src/assets/tuilesn4/Tileset_n4.png");
    this.load.image("death4", "src/assets/tuilesn4/tileset_death.png");

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

    // Carte Tiled
    this.load.tilemapTiledJSON("carte4", "src/assets/map_n4.json");

    // Sprites du joueur
    this.load.spritesheet("astronaut", "src/assets/astronaut.png", {
      frameWidth: 130,
      frameHeight: 90
    });

    this.load.spritesheet("astronautinverse", "src/assets/astronautinverse.png", {
      frameWidth: 130,
      frameHeight: 90
    });
  }

  create() {
    
    // CARTE ET LAYERS
    
    const carten4 = this.add.tilemap("carte4");

    const ts_bg4 = carten4.addTilesetImage("background_n4", "bg4");
    const ts_t4 = carten4.addTilesetImage("Tileset_n4", "t4");
    const ts_death4 = carten4.addTilesetImage("tile_death_n4", "death4");

    const tilesets = [ts_bg4, ts_t4, ts_death4];

    this.calque_background4 = carten4.createLayer("calque_background_n4", tilesets);
    this.calque_plateformes4 = carten4.createLayer("calque_plateformes_n4", tilesets);
    this.calque_death4 = carten4.createLayer("calque_death_n4", tilesets);

    
    // COLLISIONS DES TUILES
    
    this.calque_plateformes4.setCollisionByProperty({ estsolide: true });
    this.calque_death4.setCollisionByProperty({ estsolide: true });

    
    // JOUEUR
    
    this.player = this.physics.add.sprite(2900, 450, "astronaut");

    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(600);

    this.player.direction = "droite";
    this.gravityInverted = false;

    
    // COLLISIONS PHYSIQUES
    
    this.physics.add.collider(this.player, this.calque_plateformes4);

    // "mort" player
    
    this.physics.add.collider(this.player, this.calque_death4, () => {
      this.scene.restart(); // redémarre la scène actuelle
    });
    
    // /CAMÉRA ET MONDE
    
    this.cameras.main.setBounds(0, 0, carten4.widthInPixels, carten4.heightInPixels);
    this.physics.world.setBounds(0, 0, carten4.widthInPixels, carten4.heightInPixels);
    this.cameras.main.startFollow(this.player);

    
    //CLAVIER
    
    this.clavier = this.input.keyboard.createCursorKeys();
    this.toucheGravite = this.input.keyboard.addKey("G");
    this.boutoncourir = this.input.keyboard.addKey("C");


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
this.teleporter = this.physics.add.sprite(3020, 380, 'tp01');
this.teleporter.body.allowGravity = false;
this.teleporter.setImmovable(true);

// animation en boucle 
this.teleporter.anims.play('anim_teleporter');
this.teleporter.setScale(0.3);
this.teleporter.setSize(150,200);
this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);



  }

  update() {
    
    // DÉPLACEMENTS HORIZONTAUX
    
    const vitesseMarche = 160;
    const vitesseCourse = 300;

    if (this.boutoncourir.isDown) {
      if (this.player.direction === "droite") {
        this.player.setVelocityX(vitesseCourse);
        this.player.anims.play("courirdroite", true);
      } else {
        this.player.setVelocityX(-vitesseCourse);
        this.player.anims.play("courirgauche", true);
      }
    } else {
      if (this.clavier.right.isDown) {
        this.player.setVelocityX(vitesseMarche);
        this.player.direction = "droite";
        this.player.anims.play("anim_droite", true);
        this.player.setOffset(36, 10);
      } 
      else if (this.clavier.left.isDown) {
        this.player.setVelocityX(-vitesseMarche);
        this.player.direction = "gauche";
        this.player.anims.play("anim_gauche", true);
        this.player.setOffset(42, 10);
      } 
      else {
        this.player.setVelocityX(0);

        if (this.player.direction === "droite") {
          this.player.anims.play("immobiledroit", true);
        } else {
          this.player.anims.play("immobilegauche", true);
        }
      }
    }

    
    //SAUT
    
    if (!this.gravityInverted) {
      if (this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-300);
      }
    } else {
      if (this.clavier.space.isDown && this.player.body.blocked.up) {
        this.player.setVelocityY(300);
      }
    }

    
    // /CHANGEMENT DE SCÈNE
    
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      this.scene.start("pageprincipale");
    }

    
    // INVERSION DE GRAVITÉ
    
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted) {
        // Retour à la gravité normale
        this.gravityInverted = false;
        this.player.setGravityY(600);
        this.player.setFlipY(false);
      } else {
        // Gravité inversée
        this.gravityInverted = true;
        this.player.setGravityY(-600);
        this.player.setFlipY(true);
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