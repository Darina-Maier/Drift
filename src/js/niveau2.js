//***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var timerText;
var timeRemaining;
var boutoncourir;
var calque_plateforme1;
var calque_plateforme2;
var calque_plateforme3;

export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {
    this.load.image("bg2", "src/assets/tuilesn2/4_game_background.png");
    this.load.image("tuilesJeu", "src/assets/tuilesn2/tuilesJeu.png");
    this.load.image("platform1", "src/assets/tuilesn2/DungeonTileSet.png");
    this.load.image("platform2", "src/assets/tuilesn1/platform3.png");
    this.load.audio("musiqueNiveau2", "src/assets/sons/niveau2.ogg");
    this.load.tilemapTiledJSON("carte2", "src/assets/niveau2.json");

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

    this.load.image('piece', 'src/assets/elemn2/en21.png');

  }

  create() {
    // stoppe les anciennes musiques
    this.sound.stopAll();

    // musique niveau 2
    this.musiqueNiveau2 = this.sound.add("musiqueNiveau2", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau2.play();


    const carteDuNiveau2 = this.add.tilemap("carte2");

    const ts_bg2 = carteDuNiveau2.addTilesetImage("background_niveau2", "bg2");
    const ts_tuiles = carteDuNiveau2.addTilesetImage("tuilesJeu", "tuilesJeu");
    const ts_dungeon = carteDuNiveau2.addTilesetImage("Dungeon Tile Set", "platform1");
    const ts_plat3 = carteDuNiveau2.addTilesetImage("platform3", "platform2");

    const tilesets = [ts_bg2, ts_tuiles, ts_dungeon, ts_plat3];

    const calque_background2 = carteDuNiveau2.createLayer("calque_background_n2", tilesets);
    calque_plateforme3 = carteDuNiveau2.createLayer("calque_platform3_n2", tilesets);
    const calque_death = carteDuNiveau2.createLayer("calque_death", tilesets);
    calque_plateforme1 = carteDuNiveau2.createLayer("calque_platform_n2", tilesets);
    calque_plateforme2 = carteDuNiveau2.createLayer("calque_platform2_n2", tilesets);

    // Collision sur les tuiles solides
    calque_plateforme1.setCollisionByProperty({ estSolide: true });
    calque_plateforme2.setCollisionByProperty({ estSolide: true });
    calque_plateforme3.setCollisionByProperty({ estSolide: true });
    calque_death.setCollisionByProperty({ estSolide: true });
    calque_plateforme1.setCollisionByProperty({ estsolide: true });
    calque_plateforme2.setCollisionByProperty({ estsolide: true });
    calque_plateforme3.setCollisionByProperty({ estsolide: true });
    calque_death.setCollisionByProperty({ estsolide: true });

    // création joueur
    this.player = this.physics.add.sprite(120, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';
    this.player.setDepth(100);

    // creatioN animations
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

    // création ennemis
    this.groupe_ennemis = this.physics.add.group();
    // création pièces
    this.groupe_pieces = this.physics.add.group();

    // Récupère le calque objet "objets"
    const calque_objets = carteDuNiveau2.getObjectLayer('objets');
    // Parcourt les objets du calque et crée les ennemis
    calque_objets.objects.forEach(point => {
      if (point.name == 'ennemi') {
        var nouvel_ennemi = this.physics.add.sprite(point.x, point.y, 'ennemi');
        this.groupe_ennemis.add(nouvel_ennemi);
      }
    });
    // Parcourt les objets du calque et crée les pièces
    calque_objets.objects.forEach(point => {
      if (point.name == 'piecearamasser') {
        var nouvelle_piece = this.physics.add.sprite(point.x, point.y, 'piece');
        nouvelle_piece.setScale(0.5); // réduit la taille
        this.groupe_pieces.add(nouvelle_piece);
      }
    });


    // Animation ennemis
    this.groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
      un_ennemi.setVelocityX(-40);
      un_ennemi.direction = 'gauche';
      un_ennemi.anims.play('ennemi_gauche', true);
    });

    // Collisions ennemis
    this.physics.add.collider(this.groupe_ennemis, calque_plateforme1);
    this.physics.add.collider(this.groupe_ennemis, calque_plateforme2);
    this.physics.add.collider(this.groupe_ennemis, calque_plateforme3);

    this.physics.add.collider(this.groupe_pieces, calque_plateforme1);
    this.physics.add.collider(this.groupe_pieces, calque_plateforme2);
    this.physics.add.collider(this.groupe_pieces, calque_plateforme3);
   

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, ramasserPiece, null, this);

    // Si joueur touche ennemi → restart
    this.physics.add.overlap(this.player, this.groupe_ennemis, () => {
      this.scene.restart();
    });



    //COLLIDERS

    this.physics.add.collider(this.player, calque_plateforme1);
    this.physics.add.collider(this.player, calque_plateforme2);
    this.physics.add.collider(this.player, calque_plateforme3);
    this.physics.add.collider(this.player, calque_death, () => {
      this.scene.restart();
    });

    this.clavier = this.input.keyboard.createCursorKeys();
    this.toucheGravite = this.input.keyboard.addKey('G');
    boutoncourir = this.input.keyboard.addKey('C');

    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768);


    // Timer de 90 secondes
    timeRemaining = 90;
    timerText = this.add.text(20, 20, "Temps: 1:30", {
      fontSize: "32px", fill: "#ffffff", fontStyle: "bold"
    });
    timerText.setScrollFactor(0);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
    this.physics.world.gravity.y = 500;
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
        if (this.musiqueNiveau2) {
          this.musiqueNiveau2.stop();
        }
        this.scene.start('pageprincipale');
    }


    // Gravité avec G
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted) {
        this.player.body.gravity.y = -600;
        this.gravityInverted = false;
        this.player.setFlipY(true);
      } else {
        this.gravityInverted = true;
        this.player.body.gravity.y = 0;
        this.player.setFlipY(false);
      }
    }


    this.groupe_ennemis.children.iterate((un_ennemi) => {
      if (un_ennemi.direction == 'gauche') {
        var coords = un_ennemi.getBottomLeft();
        var tuileSuivante =
          calque_plateforme1.getTileAtWorldXY(coords.x, coords.y + 10) ||
          calque_plateforme2.getTileAtWorldXY(coords.x, coords.y + 10) ||
          calque_plateforme3.getTileAtWorldXY(coords.x, coords.y + 10);
        if (tuileSuivante == null || un_ennemi.body.blocked.left) {
          un_ennemi.direction = 'droite';
          un_ennemi.setVelocityX(40);
          un_ennemi.anims.play('ennemi_droite', true);
        }
      } else if (un_ennemi.direction == 'droite') {
        var coords = un_ennemi.getBottomRight();

        var tuileSuivante =
          calque_plateforme1.getTileAtWorldXY(coords.x, coords.y + 10) ||
          calque_plateforme2.getTileAtWorldXY(coords.x, coords.y + 10) ||
          calque_plateforme3.getTileAtWorldXY(coords.x, coords.y + 10);
        if (tuileSuivante == null || un_ennemi.body.blocked.right) {
          un_ennemi.direction = 'gauche';
          un_ennemi.setVelocityX(-40);
          un_ennemi.anims.play('ennemi_gauche', true);
        }
      }
    });
  }

  updateTimer() {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    timerText.setText('Temps: ' + minutes + ':' + displaySeconds);

    // Rouge quand il reste 15 secondes
    if (timeRemaining <= 15) {
      timerText.setFill('#ff0000');
    }

    // Timer écoulé → reset position + repart de 90 secondes
    if (timeRemaining <= 0) {
      this.player.setPosition(100, 450);
      this.player.setVelocity(0, 0);
      timeRemaining = 90;
      timerText.setFill('#ffffff');
    }
  }

}

function ramasserPiece(player, piece) {
  piece.disableBody(true, true);
  // Ici tu peux ajouter du code pour augmenter le score ou autre
}

