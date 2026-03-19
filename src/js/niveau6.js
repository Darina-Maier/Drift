/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;

export default class niveau6 extends Phaser.Scene {

  constructor() {
    super({
      key: "niveau6"
    });
  }

  preload() {
    this.load.audio("musiqueNiveau6", "src/assets/sons/niveau6.ogg");
    this.load.image("bg6", "src/assets/tuilesn6/2_game_background.png");
    this.load.image("t6", "src/assets/tuilesn6/alien-planet-tileset.png");

    // carte
    this.load.tilemapTiledJSON("carte6", "src/assets/map_n6.json");

    // joueur
    this.load.spritesheet("astronaut", "src/assets/astronaut.png", {
      frameWidth: 130,
      frameHeight: 90
    });

    this.load.spritesheet("astronautinverse", "src/assets/astronautinverse.png", {
      frameWidth: 130,
      frameHeight: 90
    });

    // ennemi
    this.load.spritesheet("fishrobot", "src/assets/fishrobot.png", {
      frameWidth: 41,
      frameHeight: 61
    });

    // pièce
    this.load.image("piece", "src/assets/piece.png");

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
  }

  create() {
    this.estMort = false;
    this.gravityInverted = false;
    this.vies = 3;
    this.invulnerable = false;
    this.score = 0;

    this.sound.stopAll();

    this.musiqueNiveau6 = this.sound.add("musiqueNiveau6", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau6.play();

    // création de la map
    const carten6 = this.make.tilemap({ key: "carte6" });

    const ts_bg6 = carten6.addTilesetImage("niveau6", "bg6");
    const ts_t6 = carten6.addTilesetImage("alien-planet-tileset", "t6");
    const tilesets = [ts_bg6, ts_t6];

    const calque_background6 = carten6.createLayer("calque_background_niveau6", tilesets, 0, 0);
    const calque_plateformes6 = carten6.createLayer("calque_platform_n6", tilesets, 0, 0);

    calque_plateformes6.setCollisionByProperty({ estsolide: true });
    calque_plateformes6.setCollisionByProperty({ estSolide: true });

    // joueur
    this.player = this.physics.add.sprite(100, 450, "astronaut");
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = "droite";

    this.spawnX = 100;
    this.spawnY = 450;

    this.clavier = this.input.keyboard.createCursorKeys();
    this.toucheGravite = this.input.keyboard.addKey("G");

    this.physics.add.collider(this.player, calque_plateformes6);

    // caméra
    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768);

    // texte vies
    this.texteVies = this.add.text(20, 20, "Vies : 3", {
      fontSize: "24px",
      fill: "#ffffff"
    });
    this.texteVies.setScrollFactor(0);

    // texte score
    this.texteScore = this.add.text(20, 50, "Pièces : 0", {
      fontSize: "24px",
      fill: "#ffff00"
    });
    this.texteScore.setScrollFactor(0);

    /***********************************************************************/
    /** PIECES
    /***********************************************************************/
    this.groupe_pieces = this.physics.add.group();

    const calque_objets = carten6.getObjectLayer("piece_a_ramasse_n6");

    if (calque_objets) {
      calque_objets.objects.forEach((point) => {
        if (point.name === "piece") {
          let nouvelle_piece = this.physics.add.sprite(point.x, point.y, "piece");
          nouvelle_piece.setScale(0.5);
          nouvelle_piece.setImmovable(false);
          this.groupe_pieces.add(nouvelle_piece);
        }
      });
    }

    // les pièces collisionnent avec les plateformes
    this.physics.add.collider(this.groupe_pieces, calque_plateformes6);

    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);

    /***********************************************************************/
    /** ANIMATIONS JOUEUR
    /***********************************************************************/
    if (!this.anims.exists("anim_droite")) {
      this.anims.create({
        key: "anim_droite",
        frames: this.anims.generateFrameNumbers("astronaut", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!this.anims.exists("anim_gauche")) {
      this.anims.create({
        key: "anim_gauche",
        frames: this.anims.generateFrameNumbers("astronautinverse", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!this.anims.exists("immobiledroit")) {
      this.anims.create({
        key: "immobiledroit",
        frames: [{ key: "astronaut", frame: 21 }],
        frameRate: 1
      });
    }

    if (!this.anims.exists("immobilegauche")) {
      this.anims.create({
        key: "immobilegauche",
        frames: [{ key: "astronautinverse", frame: 21 }],
        frameRate: 1
      });
    }

    if (!this.anims.exists("sautdroit")) {
      this.anims.create({
        key: "sautdroit",
        frames: this.anims.generateFrameNumbers("astronaut", { start: 30, end: 35 }),
        frameRate: 10
      });
    }

    /***********************************************************************/
    /** ANIMATION ENNEMI
    /***********************************************************************/
    if (!this.anims.exists("anim_fishrobot")) {
      this.anims.create({
        key: "anim_fishrobot",
        frames: this.anims.generateFrameNumbers("fishrobot", { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
      });
    }

    /***********************************************************************/
    /** POISSONS
    /***********************************************************************/
    this.poissons = [];
    const nbPoissons = 6;

    for (let i = 0; i < nbPoissons; i++) {
      const posX = Phaser.Math.Between(200, 2800);
      const posY = Phaser.Math.Between(150, 600);

      const poisson = this.physics.add.sprite(posX, posY, "fishrobot");

      poisson.anims.play("anim_fishrobot", true);
      poisson.setCollideWorldBounds(true);
      poisson.body.allowGravity = false;
      poisson.setSize(30, 40);
      poisson.setOffset(5, 10);
      poisson.vivant = true;

      const distance = Phaser.Math.Between(200, 500);
      const duree = Phaser.Math.Between(3000, 5000);
      const targetX = Phaser.Math.Clamp(posX + distance, 100, 3000);

      this.tweens.add({
        targets: poisson,
        x: targetX,
        duration: duree,
        yoyo: true,
        repeat: -1
      });

      this.poissons.push(poisson);

      this.physics.add.overlap(this.player, poisson, this.toucherPoisson, null, this);
    }

    /***********************************************************************/
    /** TELEPORTEUR
    /***********************************************************************/
    // animation du téléporteur avec les 9 images
    if (!this.anims.exists('anim_teleporter')) {
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
        frameRate: 10,
        repeat: -1
      });
    }

    // création du téléporteur à la fin du niveau
    this.teleporter = this.physics.add.sprite(3020, 380, 'tp01');
    this.teleporter.body.allowGravity = false;
    this.teleporter.setImmovable(true);
    this.teleporter.anims.play('anim_teleporter');
    this.teleporter.setScale(0.3);
    this.teleporter.setSize(150, 200);

    this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);
  }

  ramasserPiece(player, piece) {
    piece.destroy();
    this.score++;
    this.texteScore.setText("Pièces : " + this.score);
  }

  finNiveau(player, teleporter) {
    // Arrête la musique et redémarre la scène principale
    if (this.musiqueNiveau6) {
      this.musiqueNiveau6.stop();
    }
    this.scene.start('pageprincipale');
  }

  toucherPoisson(player, poisson) {
    if (player.body.velocity.y > 0 && player.y < poisson.y) {
      if (poisson.vivant) {
        poisson.vivant = false;
        poisson.destroy();
        this.player.setVelocityY(-250);
      }
    } else {
      this.perdre();
    }
  }

  perdre() {
    if (this.invulnerable || this.estMort) return;

    this.invulnerable = true;
    this.vies--;

    this.texteVies.setText("Vies : " + this.vies);

    if (this.vies <= 0) {
      this.estMort = true;
      this.physics.pause();
      this.player.setTint(0xff0000);

      if (this.musiqueNiveau6) {
        this.musiqueNiveau6.stop();
      }

      this.time.delayedCall(1000, () => {
        this.scene.restart();
      });

      return;
    }

    this.player.setPosition(this.spawnX, this.spawnY);
    this.player.setVelocity(0, 0);

    this.time.delayedCall(1000, () => {
      this.invulnerable = false;
    });
  }

  update() {
    if (this.estMort) return;

    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.direction = "droite";
      this.player.anims.play("anim_droite", true);
    }
    else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.direction = "gauche";
      this.player.anims.play("anim_gauche", true);
    }
    else {
      this.player.setVelocityX(0);

      if (this.player.direction === "droite") {
        this.player.anims.play("immobiledroit", true);
      } else {
        this.player.anims.play("immobilegauche", true);
      }
    }

    if (this.clavier.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-400);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.musiqueNiveau6) {
        this.musiqueNiveau6.stop();
      }
      this.scene.start("pageprincipale");
    }

    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted === false) {
        this.gravityInverted = true;
        this.player.body.gravity.y = -1200;
        this.player.setFlipY(true);
      } else {
        this.gravityInverted = false;
        this.player.body.gravity.y = 0;
        this.player.setFlipY(false);
      }
    }
  }
}