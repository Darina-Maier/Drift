
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


    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
      frameWidth: 130,
      frameHeight: 90
    });
    this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
      frameWidth: 130,
      frameHeight: 90
    });
    
    this.load.spritesheet('ennemi3', 'src/assets/ami3.png', {
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
    this.player = this.physics.add.sprite(220, 200, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';


    // Animation ennemi3
    this.anims.create({
      key: 'ennemi3_marche',
      frames: this.anims.generateFrameNumbers('ennemi3', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Groupes pour ennemis et amis
    this.groupe_ennemis = this.physics.add.group();
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

        var ennemi = this.physics.add.sprite(point.x, point.y, 'ennemi3');
        ennemi.setScale(0.4);
        ennemi.setSize(70, 55);
        ennemi.setOffset(10, 50);
        ennemi.setCollideWorldBounds(true);
        ennemi.setBounceX(0);
        ennemi.setBounceY(0);
        ennemi.anims.play('ennemi3_marche', true);
        this.groupe_ennemis.add(ennemi);
      }
    });

    // Collisions
    this.physics.add.collider(this.groupe_ennemis, calque_plateformes);
    this.physics.add.collider(this.groupe_pieces, calque_plateformes);

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, ramasserPiece, null, this);


   
    // Si joueur touche ennemi → restart
    this.physics.add.overlap(this.player, this.groupe_ennemis, () => {
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
this.teleporter = this.physics.add.sprite(3010, 320, 'tp01');
this.teleporter.body.allowGravity = false;
this.teleporter.setImmovable(true);

// animation en boucle 
this.teleporter.anims.play('anim_teleporter');
this.teleporter.setScale(0.3);
this.teleporter.setSize(90,200);
this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

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

   
    // ENNEMIS — sautent selon gravité
    this.groupe_ennemis.children.iterate((ennemi) => {
    this.orienterSprite(ennemi);

    if (this.graviteDirection == 'bas' || this.graviteDirection == 'haut') {
        // Gravité verticale → gravité normale + saut haut
        ennemi.body.gravity.set(0, 0); // suit la gravité mondiale
        if (this.graviteDirection == 'bas' && ennemi.body.blocked.down) {
            if (Phaser.Math.Between(0, 100) < 5) { ennemi.setVelocityY(-350); }
        } else if (this.graviteDirection == 'haut' && ennemi.body.blocked.up) {
            if (Phaser.Math.Between(0, 100) < 5) { ennemi.setVelocityY(350); }
        }
    } else {
        // Gravité horizontale → flotte très lentement
        ennemi.body.gravity.set(0, 0);
        ennemi.body.velocity.x = Phaser.Math.Linear(ennemi.body.velocity.x, 0, 0.05); // ralentit doucement
        ennemi.body.velocity.y = Phaser.Math.Linear(ennemi.body.velocity.y, 0, 0.05); // flotte

        // Légère dérive aléatoire très lente
        if (Phaser.Math.Between(0, 200) < 1) {
            ennemi.setVelocityX(Phaser.Math.Between(-30, 30));
            ennemi.setVelocityY(Phaser.Math.Between(-30, 30));
        }
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

  finNiveau(player, teleporter) {
    // Empêcher les appels multiples
    if (this.finNiveauAppele) return;
    this.finNiveauAppele = true;

    // optionnel : désactiver le joueur pour éviter multi déclenchement
    player.setVelocity(0);
    player.disableBody(true, true);

    // Arrêter la musique du niveau 3
    if (this.musiqueNiveau3) {
      this.musiqueNiveau3.stop();
    }

    // Fondu progressif (fade out)
    this.cameras.main.fadeOut(1500, 0, 0, 0);

    // Attendre la fin du fondu puis changer de niveau
    this.time.delayedCall(1500, () => {
      this.scene.start('pageprincipale');
    });
  }

}

function ramasserPiece(player, piece) {
  piece.disableBody(true, true);
  // Ici tu peux ajouter du code pour augmenter le score ou autre
}

