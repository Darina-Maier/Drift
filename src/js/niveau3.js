
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

    this.load.spritesheet('ennemi', 'src/assets/ennemi.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('ami3', 'src/assets/ami3.png', {
      frameWidth: 100,  // 410 / 4 = ~102
      frameHeight: 156
    });

    this.load.image('piece3', 'src/assets/elemn3/en31.png');


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

    const carten3 = this.add.tilemap("carte");

    // chargement du jeu de tuiles
    const ts_bg = carten3.addTilesetImage("background_alien", "bg");
    const ts_t1 = carten3.addTilesetImage("platform", "t1");
    const tilesets = [ts_bg, ts_t1];

    const calque_background = carten3.createLayer("calque_alien1", tilesets);
    const calque_plateformes = carten3.createLayer("calque_plateform_alien", tilesets);

    // Collision sur les tuiles solides

    calque_plateformes.setCollisionByProperty({ estsolide: true });

    // création du joueur
    this.player = this.physics.add.sprite(230, 200, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    // Animation ennemi
    this.anims.create({
      key: 'ennemi_droite',
      frames: this.anims.generateFrameNumbers('ennemi', { start: 0, end: 8 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'ennemi_gauche',
      frames: this.anims.generateFrameNumbers('ennemi', { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1
    });

    // Animation ami3
    this.anims.create({
      key: 'ami3_marche',
      frames: this.anims.generateFrameNumbers('ami3', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Groupes pour ennemis et amis
    this.groupe_ennemis = this.physics.add.group();
    this.groupe_amis = this.physics.add.group();
    // création pièces
    this.groupe_pieces = this.physics.add.staticGroup();


    // Récupère le calque objet
    const calque_objets = carten3.getObjectLayer('calque_objet3');

    // Parcourt les objets du calque et crée les pièces
    calque_objets.objects.forEach(point => {
      if (point.name == 'piecearamasser3') {
        var nouvelle_piece = this.groupe_pieces.create(point.x, point.y, 'piece3');
        nouvelle_piece.setScale(0.5);
        this.groupe_pieces.add(nouvelle_piece);
      }
    });

    // Ennemis qui marchent
    calque_objets.objects.forEach(point => {
      if (point.name == 'ennemi3') {
        var ennemi = this.physics.add.sprite(point.x, point.y, 'ennemi');
        ennemi.body.allowGravity = false; // ← ne change pas avec la gravité
        ennemi.setDepth(100);
        ennemi.setCollideWorldBounds(true);
        ennemi.setBounceX(1);
        ennemi.setVelocityX(-40);
        ennemi.direction = 'gauche';
        ennemi.anims.play('ennemi_gauche', true);
        this.groupe_ennemis.add(ennemi);
      }
    });

    // Amis qui sautent
    calque_objets.objects.forEach(point => {
      if (point.name == 'ami3') {

        var ami = this.physics.add.sprite(point.x, point.y, 'ami3');
        ami.setScale(0.4);
        ami.setSize(70, 55);
        ami.setOffset(10, 50);
        ami.setCollideWorldBounds(true);
        ami.setBounceX(0);
        ami.setBounceY(0);
        ami.anims.play('ami3_marche', true);
        this.groupe_amis.add(ami);
      }
    });

    // Collisions
    this.physics.add.collider(this.groupe_ennemis, calque_plateformes);
    this.physics.add.collider(this.groupe_amis, calque_plateformes);
    this.physics.add.collider(this.groupe_pieces, calque_plateformes);

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, ramasserPiece, null, this);


    // Si joueur touche ennemi → restart
    this.physics.add.overlap(this.player, this.groupe_ennemis, () => {
      this.scene.restart();
    });
    // Si joueur touche ami → restart
    this.physics.add.overlap(this.player, this.groupe_amis, () => {
      this.scene.restart();
    });

    // Sauvegarder le calque pour update()
    this.calque_plateformes = calque_plateformes;

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
    // DÉPLACEMENTS joueur
    if (this.graviteDirection == 'bas' || this.graviteDirection == 'haut') {
      if (boutoncourir.isDown && this.clavier.right.isDown) {
        this.player.setVelocityX(300);
      } else if (boutoncourir.isDown && this.clavier.left.isDown) {
        this.player.setVelocityX(-300);
      } else if (this.clavier.right.isDown) {
        this.player.setVelocityX(160);
        this.player.direction = 'droite';
        this.player.anims.play('anim_droite', true);
        this.player.setOffset(36, 10);
      } else if (this.clavier.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.direction = 'gauche';
        this.player.anims.play('anim_gauche', true);
        this.player.setOffset(42, 10);
      } else {
        this.player.setVelocityX(0);
        if (this.player.direction == 'droite') {
          this.player.anims.play('immobiledroit', true);
        } else {
          this.player.anims.play('immobilegauche', true);
        }
      }
      if (this.graviteDirection == 'bas' && this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-400);
      } else if (this.graviteDirection == 'haut' && this.clavier.space.isDown && this.player.body.blocked.up) {
        this.player.setVelocityY(400);
      }
    } else {
      if (this.clavier.right.isDown) {
        this.player.setVelocityY(-160);
      } else if (this.clavier.left.isDown) {
        this.player.setVelocityY(160);
      } else {
        this.player.setVelocityY(0);
      }
      if (this.graviteDirection == 'gauche' && this.clavier.space.isDown && this.player.body.blocked.left) {
        this.player.setVelocityX(400);
      } else if (this.graviteDirection == 'droite' && this.clavier.space.isDown && this.player.body.blocked.right) {
        this.player.setVelocityX(-400);
      }
    }

    // TOUJOURS ACCESSIBLE
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.musiqueNiveau3) this.musiqueNiveau3.stop();
      this.scene.start('pageprincipale');
    }

    // GRAVITÉ TOURNANTE
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.graviteDirection == 'bas') {
        this.graviteDirection = 'gauche';
        this.physics.world.gravity.set(-300, 0);
        this.player.setAngle(-90);
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

    this.groupe_ennemis.children.iterate((un_ennemi) => {
      if (un_ennemi.direction == 'gauche') {
        var coords = un_ennemi.getBottomLeft();
        var tuileSuivante = this.calque_plateformes.getTileAtWorldXY(
          coords.x, coords.y + 10
        );
        if (tuileSuivante == null || un_ennemi.body.blocked.left) {
          un_ennemi.direction = 'droite';
          un_ennemi.setVelocityX(40);
          un_ennemi.anims.play('ennemi_droite', true);
        }
      } else if (un_ennemi.direction == 'droite') {
        var coords = un_ennemi.getBottomRight();
        var tuileSuivante = this.calque_plateformes.getTileAtWorldXY(
          coords.x, coords.y + 10
        );
        if (tuileSuivante == null || un_ennemi.body.blocked.right) {
          un_ennemi.direction = 'gauche';
          un_ennemi.setVelocityX(-40);
          un_ennemi.anims.play('ennemi_gauche', true);
        }
      }
    });


    // AMIS — sautent selon gravité
    this.groupe_amis.children.iterate((ami) => {
      this.orienterSprite(ami);
      if (this.graviteDirection == 'bas' && ami.body.blocked.down) {
        if (Phaser.Math.Between(0, 100) < 5) { ami.setVelocityY(-350); }
      } else if (this.graviteDirection == 'haut' && ami.body.blocked.up) {
        if (Phaser.Math.Between(0, 100) < 5) { ami.setVelocityY(350); }
      } else if (this.graviteDirection == 'gauche' && ami.body.blocked.left) {
        if (Phaser.Math.Between(0, 100) < 5) { ami.setVelocityX(350); }
      } else if (this.graviteDirection == 'droite' && ami.body.blocked.right) {
        if (Phaser.Math.Between(0, 100) < 5) { ami.setVelocityX(-350); }
      }
    });
  }



  orienterSprite(obj) {
    if (this.graviteDirection == 'bas') {
      obj.setAngle(0);
    } else if (this.graviteDirection == 'haut') {
      obj.setAngle(180);
    } else if (this.graviteDirection == 'gauche') {
      obj.setAngle(-90);
    } else if (this.graviteDirection == 'droite') {
      obj.setAngle(90);
    }
  }
}

function ramasserPiece(player, piece) {
  piece.disableBody(true, true);
  // Ici tu peux ajouter du code pour augmenter le score ou autre
}

