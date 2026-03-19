/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutonFeu;
var groupeBullets;

export default class niveau6 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau6" // ici on précise le nom de la classe en tant qu'identifiant
    });
  }

  preload() {
    this.load.audio("musiqueNiveau6", "src/assets/sons/niveau6.ogg");
    this.load.image("bg6", "src/assets/tuilesn6/2_game_background.png");
    this.load.image("t6", "src/assets/tuilesn6/alien-planet-tileset.png");
    // chargement piece6
    this.load.image('piece6', 'src/assets/piece.png');

    // chargement de la carte
    this.load.tilemapTiledJSON("carte6", "src/assets/map_n6.json");

    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
      frameWidth: 130,
      frameHeight: 90
    });
    this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
      frameWidth: 130,
      frameHeight: 90
    });

    // chargement meteorite
    this.load.spritesheet('meteorites', 'src/assets/tuilesn6/meteorite.png', {
      frameWidth: 250,
      frameHeight: 250
    });
    // chargement tir
    this.load.image("bullet", "src/assets/tuilesn6/balle.png");

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
    // stoppe les anciennes musiques
    this.sound.stopAll();

    // lance la musique du niveau 6
    this.musiqueNiveau6 = this.sound.add("musiqueNiveau6", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau6.play();

    const carten6 = this.add.tilemap("carte6");

    // chargement du jeu de tuiles
    const ts_bg6 = carten6.addTilesetImage("niveau6", "bg6");
    const ts_t6 = carten6.addTilesetImage("alien-planet-tileset", "t6");
    const tilesets = [ts_bg6, ts_t6];

    const calque_background6 = carten6.createLayer("calque_background_niveau6", tilesets);
    const calque_plateformes6 = carten6.createLayer("calque_platform_n6", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes6.setCollisionByProperty({ estSolide: true });
    calque_plateformes6.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(100, 0, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes6);
    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    // animations
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
    });

    // création du groupe des météorites
    this.groupeMeteorites = this.physics.add.group();

    this.time.addEvent({
      delay: 2000,
      callback: this.creerMeteorite,
      callbackScope: this,
      loop: true
    });

    // affectation de la touche A au tir
    boutonFeu = this.input.keyboard.addKey('A');

    // création du groupe des balles
    groupeBullets = this.physics.add.group();

    this.clavier = this.input.keyboard.createCursorKeys();

    this.physics.world.on("worldbounds", function(body) {
      var objet = body.gameObject;
      if (groupeBullets.contains(objet)) {
        objet.destroy();
      }
    });

    this.anims.create({
      key: 'tir_droite',
      frames: this.anims.generateFrameNumbers('astronaut', { start: 34, end: 35 }),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: 'tir_gauche',
      frames: this.anims.generateFrameNumbers('astronautinverse', { start: 31, end: 30 }),
      frameRate: 10,
      repeat: 0
    });

    this.isTir = false;
    // collision entre les balles et les météorites
    this.physics.add.overlap(groupeBullets, this.groupeMeteorites, this.hitMeteorite, null, this);
    this.vies = 3;
    // contact joueur meteorite
    this.physics.add.overlap(this.player, this.groupeMeteorites, this.toucheMeteorite, null, this);

    this.toucheGravite = this.input.keyboard.addKey('G');

    // animation du téléporteur avec les 9 images
    this.anims.create({
      key: 'anim_teleporter',
      frames: [
        { key: 'tp01' }, { key: 'tp02' }, { key: 'tp03' },
        { key: 'tp04' }, { key: 'tp05' }, { key: 'tp06' },
        { key: 'tp07' }, { key: 'tp08' }, { key: 'tp09' }
      ],
      frameRate: 10, // vitesse de rotation
      repeat: -1     // boucle infinie
    });

    // création tp fin du niveau
    this.teleporter = this.physics.add.sprite(3020, 500, 'tp01');
    this.teleporter.body.allowGravity = false;
    this.teleporter.setImmovable(true);

    // animation en boucle
    this.teleporter.anims.play('anim_teleporter');
    this.teleporter.setScale(0.3);
    this.teleporter.setSize(50, 200);
    this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

    // création pièces
    this.groupe_pieces = this.physics.add.staticGroup();
    // Récupère le calque objet
    const calque_objets = carten6.getObjectLayer('piece_a_ramasse_n6');

    if (!calque_objets) {
      console.error("Calque pièces introuvable !");
    } else {
      calque_objets.objects.forEach(point => {
        if (point.name == 'piece') {
          var nouvelle_piece = this.groupe_pieces.create(point.x, point.y, 'piece6');
          nouvelle_piece.setScale(0.5);
        }
      });
    }

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);

    // COMPTEUR DE PIÈCES (fixe à l'écran, ne bouge pas avec la caméra)
    this.totalPieces = this.groupe_pieces.getChildren().length;
    this.textePieces = this.add.text(16, 16, '', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Orbitron',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10);

    // flag niveau complet
    this.niveauComplete = false;
  }

  update() {
    // MISE À JOUR DU COMPTEUR DE PIÈCES
    const piecesRestantes = this.groupe_pieces.countActive();
    const piecesRamassees = this.totalPieces - piecesRestantes;
    this.textePieces.setText('🪙 Pièces : ' + piecesRamassees + ' / ' + this.totalPieces);

    // touche triche : T = ramasse toutes les pièces sans valider le niveau
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('T'))) {
      this.groupe_pieces.getChildren().forEach(piece => {
        piece.disableBody(true, true);
      });
      // vérifie si toutes les pièces sont ramassées
      if (this.groupe_pieces.countActive() === 0) {
        this.niveauComplete = true;
      }
    }

    if (!this.isTir) {
      if (this.clavier.right.isDown) {
        this.player.setVelocityX(160);
        this.player.direction = 'droite';
        this.player.anims.play('anim_droite', true);
      } else if (this.clavier.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.direction = 'gauche';
        this.player.anims.play('anim_gauche', true);
      } else {
        this.player.setVelocityX(0);
        if (this.player.direction == 'droite') {
          this.player.anims.play('immobiledroit', true);
        } else {
          this.player.anims.play('immobilegauche', true);
        }
      }
    }

    if (this.clavier.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-400);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.musiqueNiveau6) this.musiqueNiveau6.stop();
      this.scene.start('pageprincipale');
    }

    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      this.isTir = true;

      if (this.player.direction == 'droite') {
        this.player.anims.play('tir_droite');
      } else {
        this.player.anims.play('tir_gauche');
      }

      this.tirer(this.player);

      this.time.delayedCall(300, () => {
        this.isTir = false;
      });
    }

    // appuie sur G pour changer la gravité
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted == true) {
        this.player.body.gravity.y = -600;  // gravité vers le bas
        this.gravityInverted = false;
        // this.physics.world.gravity.y = -200; // gravité vers le haut
        this.player.setFlipY(true); // retourne le sprite du joueur
      } else {
        this.gravityInverted = true;
        this.player.body.gravity.y = 0;  // gravité vers le bas
        this.player.setFlipY(false); // remet le sprite du joueur à l'endroit
      }
    }
  }

  creerMeteorite() {
    let frameAleatoire = Phaser.Math.Between(0, 3);
    let xAleatoire = Phaser.Math.Between(this.player.x - 300, this.player.x + 300);
    xAleatoire = Phaser.Math.Clamp(xAleatoire, 50, 3000);
    let meteorite = this.groupeMeteorites.create(xAleatoire, this.player.y - 400, 'meteorites', frameAleatoire);

    meteorite.body.allowGravity = false;
    meteorite.setVelocityY(20);
    meteorite.setVelocityX(Phaser.Math.Between(-30, 30));
    meteorite.setBounce(0);
    meteorite.setScale(0.3);
    meteorite.setSize(100, 100);
  }

  tirer(player) {
    let coefDir;

    if (player.direction == 'gauche') {
      coefDir = -1;
    } else {
      coefDir = 1;
    }

    // création de la balle à côté du joueur
    let bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');

    bullet.setScale(0.5);
    bullet.setSize(50, 50);
    bullet.body.allowGravity = false;
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;

    // vitesse de la balle
    bullet.setVelocity(700 * coefDir, 0);
  }

  hitMeteorite(bullet, meteorite) {
    // destruction de la balle
    bullet.destroy();

    // destruction de la météorite
    meteorite.destroy();
  }

  toucheMeteorite(player, meteorite) {
    // destruction de la météorite
    meteorite.destroy();

    // le joueur perd une vie
    this.vies--;

    // effet visuel rouge
    player.setTint(0xff0000);

    // petit recul
    player.setVelocityY(-200);

    // enlève la teinte rouge après un court instant
    this.time.delayedCall(200, () => {
      player.clearTint();
    });

    // affiche le nombre de vies restant dans la console
    console.log("Vies restantes :", this.vies);

    // si le joueur n'a plus de vie
    if (this.vies <= 0) {
      this.scene.restart();
    }
  }

  finNiveau(player, teleporter) {
    // optionnel : désactiver le joueur pour éviter multi déclenchement
    player.setVelocity(0);
    player.disableBody(true, true);

    // on ne valide que si toutes les pièces ont été ramassées
    if (this.niveauComplete) {
      let niveauxFinis = this.game.registry.get('niveauxFinis');
      if (!niveauxFinis.includes('niveau6')) {
        niveauxFinis.push('niveau6');
        this.game.registry.set('niveauxFinis', niveauxFinis);
      }
    }

    // retour tp menu principal
    if (this.musiqueNiveau6) this.musiqueNiveau6.stop();
    this.scene.start('pageprincipale');
  }

  ramasserPiece(player, piece) {
    piece.disableBody(true, true);

    // si toutes les pièces sont ramassées → niveau complet
    if (this.groupe_pieces.countActive() === 0) {
      this.niveauComplete = true;
    }
  }
}