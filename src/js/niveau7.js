


/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var plateforme1;
var plateforme2;
var tween1;
var tween2;
var tween_mouvement;
var levier;
var plateforme3;
var tween3;
var levier2;
var plateforme6;
var plateforme7;
var plateforme8;
var plateforme9;
var plateforme10;
var plateforme11;

var tween6;
var tween7;
var tween8;
var tween9;
var tween10;
var tween11;

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
    this.load.image("death7", "src/assets/tuilesn7/tileset_death_n7.png");

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

    //chargement piece7
    this.load.image('piece7', 'src/assets/tuilesn7/piece7.png');

    //plateforme mobile
    this.load.image('platforme_mobile', 'src/assets/tuilesn7/plateforme_mobile.png');
    this.load.image('platforme_mobile2', 'src/assets/tuilesn7/plateforme2_mobile.png');
    this.load.image("img_levier", "src/assets/tuilesn7/levier.png");


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

    const carten7 = this.add.tilemap("carte7");

    // chargement du jeu de tuiles
    const ts_bg7 = carten7.addTilesetImage("background_n7", "bg7")
    const ts_t7 = carten7.addTilesetImage("platformes_n7", "t7");
    const ts_death7 = carten7.addTilesetImage("tileset_death_n7", "death7");
    const tilesets = [ts_bg7, ts_t7, ts_death7];

    const calque_background7 = carten7.createLayer("calque_background_n7", tilesets);
    const calque_plateformes7 = carten7.createLayer("calque_platform_n7", tilesets);
    const calque_death7 = carten7.createLayer("calque_death_n7", ts_death7);

    // Collision sur les tuiles solides
    calque_plateformes7.setCollisionByProperty({ estSolide: true });
    calque_plateformes7.setCollisionByProperty({ estsolide: true });
    calque_death7.setCollisionByProperty({ estsolide: true });



    this.player = this.physics.add.sprite(300, 300, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';
    this.gravityInverted = false;

    this.clavier = this.input.keyboard.createCursorKeys();
    this.toucheLevier = this.input.keyboard.addKey('E');
    this.physics.add.collider(this.player, calque_plateformes7);
    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    // collision"mort" player
    this.physics.add.collider(this.player, calque_death7, () => {
      this.scene.restart(); // redémarre la scène actuelle
    });

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
      frames: [{ key: 'astronaut', frame: 21 }],
      frameRate: 1
    });
    this.anims.create({
      key: 'immobilegauche',
      frames: [{ key: 'astronautinverse', frame: 21 }],
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
    this.teleporter.setSize(150, 200);
    this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

    // plateforme mobile
    plateforme1 = this.physics.add.sprite(1200, 250, "platforme_mobile");
    plateforme2 = this.physics.add.sprite(1200, 450, "platforme_mobile");
    plateforme6 = this.physics.add.sprite(2350, 300, "platforme_mobile2");
    plateforme7 = this.physics.add.sprite(2550, 300, "platforme_mobile2");
    plateforme8 = this.physics.add.sprite(2250, 425, "platforme_mobile2");
    plateforme9 = this.physics.add.sprite(2450, 425, "platforme_mobile2");
    plateforme10 = this.physics.add.sprite(2650, 425, "platforme_mobile2");
    plateforme11 = this.physics.add.sprite(2750, 300, "platforme_mobile2");

    plateforme1.setScale(0.8);
    plateforme2.setScale(0.8);
    plateforme6.setScale(0.8);
    plateforme7.setScale(0.8);
    plateforme8.setScale(0.8);
    plateforme9.setScale(0.8);
    plateforme10.setScale(0.8);
    plateforme11.setScale(0.8);

    plateforme1.body.allowGravity = false;
    plateforme1.body.immovable = true;

    plateforme2.body.allowGravity = false;
    plateforme2.body.immovable = true;

    this.physics.add.collider(this.player, plateforme1);
    this.physics.add.collider(this.player, plateforme2);


    plateforme6.body.allowGravity = false;
    plateforme7.body.allowGravity = false;
    plateforme8.body.allowGravity = false;
    plateforme9.body.allowGravity = false;
    plateforme10.body.allowGravity = false;
    plateforme11.body.allowGravity = false;

    plateforme6.body.immovable = true;
    plateforme7.body.immovable = true;
    plateforme8.body.immovable = true;
    plateforme9.body.immovable = true;
    plateforme10.body.immovable = true;
    plateforme11.body.immovable = true;

    this.physics.add.collider(this.player, plateforme6);
    this.physics.add.collider(this.player, plateforme7);
    this.physics.add.collider(this.player, plateforme8);
    this.physics.add.collider(this.player, plateforme9);
    this.physics.add.collider(this.player, plateforme10);
    this.physics.add.collider(this.player, plateforme11);

    // tween de mouvement
    tween1 = this.tweens.add({
      targets: plateforme1,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "-=150", // monte
      hold: 1000,
      repeatDelay: 1000,
      repeat: -1
    });

    tween2 = this.tweens.add({
      targets: plateforme2,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "+=200", // descend (miroir)
      hold: 1000,
      repeatDelay: 1000,
      repeat: -1
    });

    plateforme3 = this.physics.add.sprite(1800, 320, "platforme_mobile");
    plateforme3.setScale(0.7);
    plateforme3.body.allowGravity = false;
    plateforme3.body.immovable = true;

    this.physics.add.collider(this.player, plateforme3);

    tween3 = this.tweens.add({
      targets: plateforme3,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      x: "+=150",   // déplacement horizontal
      hold: 1000,
      repeatDelay: 1000,
      repeat: -1
    });

    // haut gauche 
    tween6 = this.tweens.add({
      targets: plateforme6,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "+=120",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    // haut milieu
    tween7 = this.tweens.add({
      targets: plateforme7,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "+=200",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    //haut droite
    tween11 = this.tweens.add({
      targets: plateforme11,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "+=120",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    // bas gauche 
    tween8 = this.tweens.add({
      targets: plateforme8,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "-=120",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    // bas milieu 
    tween9 = this.tweens.add({
      targets: plateforme9,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "-=200",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    // bas droite 
    tween10 = this.tweens.add({
      targets: plateforme10,
      paused: true,
      ease: "Linear",
      duration: 2000,
      yoyo: true,
      y: "-=120",
      hold: 500,
      repeatDelay: 500,
      repeat: -1
    });

    // levier
    levier = this.physics.add.staticSprite(950, 358, "img_levier");
    levier.active = false;
    levier.flipX = false;
    levier.setScale(0.8);
    levier.setSize(100, 100);


    levier2 = this.physics.add.staticSprite(1600, 135, "img_levier");
    levier2.active = false;
    levier2.flipX = false;
    levier2.setScale(0.8);

    this.aideLevier = this.add.text(0, 0, "E", {
      fontSize: "24px",
      fill: "#ffffff",
      backgroundColor: "#000000"
    });

    this.aideLevier.setVisible(false);
    this.aideLevier.setDepth(10); // pour être au-dessus


    this.infoGravite = this.add.text(
      this.player.x,
      this.player.y - 50,
      "G : inverser gravité",
      {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 6, y: 3 }
      }
    ).setOrigin(0.5);

    this.infoGravite.setDepth(10);

    // création pièces
    this.groupe_pieces = this.physics.add.staticGroup();
    // Récupère le calque objet
    const calque_objets = carten7.getObjectLayer('calque_objet7');

    // Parcourt les objets du calque et crée les pièces
    calque_objets.objects.forEach(point => {
      if (point.name == 'piecearamasser7') {
        var nouvelle_piece = this.groupe_pieces.create(point.x, point.y, 'piece7');
        nouvelle_piece.setScale(1.5);
        this.groupe_pieces.add(nouvelle_piece);
      }
    });

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);
    
    //initialisation flag
    this.niveauComplete = false;




  }

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.direction = 'droite'
      this.player.anims.play('anim_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.direction = 'gauche'
      this.player.anims.play('anim_gauche', true);
    } else {
      this.player.setVelocityX(0); // ← action séparée
      if (this.player.direction == 'droite') {
        this.player.anims.play('immobiledroit', true);
      } else {
        this.player.anims.play('immobilegauche', true);
      }
    }
    if (this.clavier.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-250);
    }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.musiqueNiveau7) {
        this.musiqueNiveau7.stop();
      }
      this.scene.start('pageprincipale');
    }
    // appuie sur G pour changer la gravité
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted) {
        // retour à la gravité normale (utilise la gravité du monde)
        this.player.body.setGravityY(0);
        this.gravityInverted = false;
        this.player.setFlipY(false);
      } else {
        // inversion : gravité vers le haut
        this.player.body.setGravityY(-600);
        this.gravityInverted = true;
        this.player.setFlipY(true);
      }
    }

    // activation du levier : on est dessus et on appuie sur espace
    if (Phaser.Input.Keyboard.JustDown(this.toucheLevier)) {

      if (this.physics.overlap(this.player, levier)) {
        if (levier.active === true) {
          levier.active = false;
          levier.flipX = false;
          tween1.pause();
          tween2.pause();
        } else {
          levier.active = true;
          levier.flipX = true;
          tween1.resume();
          tween2.resume();
        }
      }

      else if (this.physics.overlap(this.player, levier2)) {
        if (levier2.active === true) {
          levier2.active = false;
          levier2.flipX = false;
          tween3.pause();
          tween6.pause();
          tween7.pause();
          tween8.pause();
          tween9.pause();
          tween10.pause();
          tween11.pause();
        } else {
          levier2.active = true;
          levier2.flipX = true;
          tween3.resume();
          tween6.resume();
          tween7.resume();
          tween8.resume();
          tween9.resume();
          tween10.resume();
          tween11.resume();
        }
      }
    }

    if (this.physics.overlap(this.player, levier)) {
      this.aideLevier.setVisible(true);

      // position au-dessus du levier
      this.aideLevier.setPosition(levier.x + 20, levier.y - 40);
    } else {
      this.aideLevier.setVisible(false);
    }

    // Touche de triche : T = terminer le niveau
if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('T'))) {
    this.niveauComplete = true;
    this.finNiveau(this.player, this.teleporter);
}
  }

  ramasserPiece(player, piece) {
    piece.disableBody(true, true);

    // Si toutes les pièces du niveau sont ramassées → niveau terminé
    if (this.groupe_pieces.countActive() === 0) {
        this.niveauComplete = true;
    }
}

finNiveau(player, teleporter) {
    player.setVelocity(0);
    player.disableBody(true, true);

    // On ne valide que si toutes les pièces ont été ramassées
    if (this.niveauComplete) {
        let niveauxFinis = this.game.registry.get('niveauxFinis');
        if (!niveauxFinis.includes('niveau7')) { // ← changer le nom selon le niveau
            niveauxFinis.push('niveau7');
            this.game.registry.set('niveauxFinis', niveauxFinis);
        }
    }

    if (this.musiqueNiveau7) this.musiqueNiveau7.stop();
    this.scene.start('pageprincipale');


}

}

