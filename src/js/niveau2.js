//***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutoncourir;
var calque_plateforme1;
var calque_plateforme2;
var calque_plateforme3;

export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" // ici on précise le nom de la classe en tant qu'identifiant
    });
  }

  preload() {
    this.load.image("bg2", "src/assets/tuilesn2/4_game_background.png");
    this.load.image("tuilesJeu", "src/assets/tuilesn2/tuilesJeu.png");
    this.load.image("platform1", "src/assets/tuilesn2/DungeonTileSet.png");
    this.load.image("platform2", "src/assets/tuilesn1/platform3.png");
    this.load.audio("musiqueNiveau2", "src/assets/sons/niveau2.ogg");
    this.load.tilemapTiledJSON("carte2", "src/assets/niveau2.json");

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

    // création animations ennemis
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
    this.groupe_pieces = this.physics.add.staticGroup(); // staticGroup pour countActive()

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
        var nouvelle_piece = this.groupe_pieces.create(point.x, point.y, 'piece');
        nouvelle_piece.setScale(0.5); // réduit la taille
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

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);

    // Si joueur touche ennemi → restart
    this.physics.add.overlap(this.player, this.groupe_ennemis, () => {
      this.scene.restart();
    });

    /// affichage du nombre de pièces restantes
    this.totalPieces = this.groupe_pieces.getChildren().length;
    this.textePieces = this.add.text(16, 16, '', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Orbitron',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10).setVisible(false);

    // Journal de bord
    this.time.delayedCall(300, () => {
      this.afficherJournalDeBord({
        planete: 'FRAGALE',
        gravite: '1.2 g',
        note: "Atmosphère dense et chaude. Mes jambes sont lourdes ici, la gravité m'écrase un peu. Et ces créatures... elles patrouillent sans relâche.",
        touches: ['← → : déplacer    C : courir    ESPACE : sauter  \nG : gravité']
      });
    });

    // flag niveau complet
    this.niveauComplete = false;

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
    this.gravityInverted = false;

    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768);

    this.physics.world.gravity.y = 500;

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
    this.teleporter = this.physics.add.sprite(3020, 400, 'tp01');
    this.teleporter.body.allowGravity = false;
    this.teleporter.setImmovable(true);

    // animation en boucle
    this.teleporter.anims.play('anim_teleporter');
    this.teleporter.setScale(0.3);
    this.teleporter.setSize(50, 200);
    this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

    // flag niveau complet
    this.niveauComplete = false;
  }

  update() {
    const piecesRestantes = this.groupe_pieces.countActive();
    const piecesRamassees = this.totalPieces - piecesRestantes;
    this.textePieces.setText('🪙 Pièces : ' + piecesRamassees + ' / ' + this.totalPieces);

    /// touche triche : T = ramasse toutes les pièces sans valider le niveau
    // if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('T'))) {
    //  this.groupe_pieces.getChildren().forEach(piece => {
    //    piece.disableBody(true, true);
    // });
    // vérifie si toutes les pièces sont ramassées
    // if (this.groupe_pieces.countActive() === 0) {
    //   this.niveauComplete = true;
    // }
    // }

    if (boutoncourir.isDown) {
      if (this.player.direction == 'droite') {
        // this.player.setOffset(76, 0);
        this.player.setVelocityX(300); // plus rapide en courant
        this.player.anims.play('courirdroite', true);
      } else {
        // this.player.setOffset(36, 10);
        this.player.setVelocityX(-300); // plus rapide en courant
        this.player.anims.play('courirgauche', true); // gauche plus tard
      }
    } else {
      if (this.clavier.right.isDown) {
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
        this.player.setVelocityX(0); // action séparée
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

  finNiveau(player, teleporter) {

    player.setVelocity(0);
    player.disableBody(true, true);


    if (this.niveauComplete) {
      let niveauxFinis = this.game.registry.get('niveauxFinis');
      if (!niveauxFinis.includes('niveau2')) {
        niveauxFinis.push('niveau2');
        this.game.registry.set('niveauxFinis', niveauxFinis);
      }
    }

    // retour tp menu principal
    if (this.musiqueNiveau2) this.musiqueNiveau2.stop();
    this.scene.start('pageprincipale');
  }

  ramasserPiece(player, piece) {
    piece.disableBody(true, true);

    // si toutes les pièces sont ramassées → niveau complet
    if (this.groupe_pieces.countActive() === 0) {
      this.niveauComplete = true;
    }
  }

  ecrireLetterByLetter(texteObj, message, vitesse = 40, onComplete = null) {
    if (!message) return;
    texteObj.setText('');
    let i = 0;

    if (this.timerEcriture) {
      this.timerEcriture.remove();
    }

    this.timerEcriture = this.time.addEvent({
      delay: vitesse,
      repeat: message.length - 1,
      callback: () => {
        texteObj.setText(texteObj.text + message[i]);
        i++;
        if (i >= message.length && onComplete) {
          onComplete();
        }
      }
    });
  }

  afficherJournalDeBord(config) {
    const DEPTH = 50;
    const TAG = '__journal__';
    const x = 16;
    const y = 16;
    const largeur = 320;
    const hauteur = 260;
    const pad = 18;


    // Fond vitré — ambiance orange
    const fond = this.add.graphics();
    fond.fillStyle(0x2e1500, 0.85);
    fond.fillRoundedRect(x, y, largeur, hauteur, 12);
    fond.lineStyle(1, 0xff9933, 0.6);
    fond.strokeRoundedRect(x, y, largeur, hauteur, 12);
    fond.setScrollFactor(0).setDepth(DEPTH);
    fond[TAG] = true;

    // Reflet haut
    const reflet = this.add.graphics();
    reflet.fillStyle(0xff7700, 0.10);
    reflet.fillRoundedRect(x + 4, y + 4, largeur - 8, 38, 8);
    reflet.setScrollFactor(0).setDepth(DEPTH);
    reflet[TAG] = true;

    const sLabel = { fontFamily: 'Orbitron', fontSize: '10px', color: '#ff9933', letterSpacing: 2 };
    const sTitre = { fontFamily: 'Orbitron', fontSize: '17px', color: '#ffe0aa' };
    const sVal = { fontFamily: 'Orbitron', fontSize: '13px', color: '#ffbb77' };
    const sNote = {
      fontFamily: 'Orbitron', fontSize: '12px', color: '#ffd0aa',
      fontStyle: 'italic', wordWrap: { width: largeur - pad * 2 }
    };
    const sTouche = {
      fontFamily: 'Orbitron', fontSize: '11px', color: '#ffbb77',
      backgroundColor: '#3a1e00', padding: { x: 5, y: 2 }
    };

    const txt = (tx, ty, msg, style) =>
      this.add.text(tx, ty, msg, style)
        .setScrollFactor(0).setDepth(DEPTH)
        .setData(TAG, true);

    // En-tête
    txt(x + pad, y + pad, '— JOURNAL DE BORD —', sLabel);

    // Planète + Gravité
    txt(x + pad, y + 40, 'PLANÈTE', sLabel);
    txt(x + pad, y + 51, config.planete, sTitre);
    txt(x + pad + 170, y + 40, 'GRAVITÉ', sLabel);
    txt(x + pad + 170, y + 51, config.gravite, sVal);

    // Séparateur 1
    const sep1 = this.add.graphics();
    sep1.lineStyle(1, 0xff9933, 0.3);
    sep1.lineBetween(x + pad, y + 73, x + largeur - pad, y + 73);
    sep1.setScrollFactor(0).setDepth(DEPTH);
    sep1[TAG] = true;

    // Note personnage (machine à écrire)
    const texteNote = this.add.text(x + pad, y + 80, '', sNote)
      .setScrollFactor(0).setDepth(DEPTH)
      .setData(TAG, true);
    this.ecrireLetterByLetter(texteNote, `"${config.note}"`, 30);

    // Séparateur 2
    const sep2 = this.add.graphics();
    sep2.lineStyle(1, 0xff9933, 0.3);
    sep2.lineBetween(x + pad, y + 165, x + largeur - pad, y + 165);
    sep2.setScrollFactor(0).setDepth(DEPTH);
    sep2[TAG] = true;

    // Contrôles
    // Contrôles
    txt(x + pad, y + 173, 'CONTRÔLES', sLabel);
    txt(x + pad, y + 187, config.touches[0], sTouche);

    // Collecte tous les éléments du journal
    const elements = this.children.list.filter(c =>
      c[TAG] === true || c.getData?.(TAG) === true
    );

    // Disparition après 10s
    this.time.delayedCall(10000, () => {
      this.tweens.add({
        targets: elements,
        alpha: 0,
        duration: 700,
        onComplete: () => {
          elements.forEach(c => c.destroy());
          this.textePieces.setVisible(true);
        }
      });
    });
  }
}