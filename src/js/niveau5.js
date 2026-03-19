/***********************************************************************/
/** VARIABLES GLOBALES
/***********************************************************************/
var boutonFeu;
var groupeBullets;

export default class niveau5 extends Phaser.Scene {

  constructor() {
    super({ key: "niveau5" });
  }

  /*********************************************************************/
  /** PRELOAD
  /*********************************************************************/
  preload() {
    this.load.audio("musiqueNiveau5", "src/assets/sons/niveau5.ogg");
    this.load.image("bg5", "src/assets/tuilesn5/background_n5.png");
    this.load.image("t5", "src/assets/tuilesn5/Tileset_n5.png");
    // chargement piece5
    this.load.image('piece5', 'src/assets/tuilesn5/piece5.png');

    // chargement de la carte
    this.load.tilemapTiledJSON("carte5", "src/assets/map_n5.json");

    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
      frameWidth: 130,
      frameHeight: 90
    });
    this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
      frameWidth: 130,
      frameHeight: 90
    });

    // chargement meteorite
    this.load.spritesheet('meteorites', 'src/assets/tuilesn5/meteorite.png', {
      frameWidth: 250,
      frameHeight: 250
    });
    // chargement tir
    this.load.image("bullet", "src/assets/tuilesn5/balle.png");

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

  /*********************************************************************/
  /** CREATE
  /*********************************************************************/
  create() {
    // stoppe les anciennes musiques
    this.sound.stopAll();

    // lance la musique du niveau 5
    this.musiqueNiveau5 = this.sound.add("musiqueNiveau5", { loop: true, volume: 0.5 });
    this.musiqueNiveau5.play();

    const carten5 = this.add.tilemap("carte5");

    // chargement du jeu de tuiles
    const ts_bg5 = carten5.addTilesetImage("background_n5", "bg5");
    const ts_t5 = carten5.addTilesetImage("plateforme_n5", "t5");
    const tilesets = [ts_bg5, ts_t5];

    const calque_background5 = carten5.createLayer("calque_background_n5", tilesets);
    const calque_plateformes5 = carten5.createLayer("calque_plateformes_n5", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes5.setCollisionByProperty({ estSolide: true });
    calque_plateformes5.setCollisionByProperty({ estsolide: true });

    // Joueur
    this.player = this.physics.add.sprite(270, 0, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes5);
    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    // Animations joueur
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
    this.isTir = false;

    this.physics.world.on("worldbounds", function (body) {
      const objet = body.gameObject;
      if (groupeBullets.contains(objet)) {
        objet.destroy();
      }
    });

    // collision entre les balles et les météorites
    this.physics.add.overlap(groupeBullets, this.groupeMeteorites, this.hitMeteorite, null, this);
    // contact joueur meteorite
    this.physics.add.overlap(this.player, this.groupeMeteorites, this.toucheMeteorite, null, this);

    this.gravityInverted = false;
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
    this.teleporter = this.physics.add.sprite(3020, 620, 'tp01');
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
    const calque_objets = carten5.getObjectLayer('calque_objet5');

    if (!calque_objets) {
      console.error("Calque pièces introuvable !");
    } else {
      calque_objets.objects.forEach(point => {
        if (point.name === 'piecearamasser5') {
          const piece = this.groupe_pieces.create(point.x, point.y, 'piece5');
          piece.setScale(0.5);
        }
      });
    }

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);

    // affichage du nombre de pièces restantes
    this.totalPieces = this.groupe_pieces.getChildren().length;

    // Compteur de pièces (caché pendant le journal)
    this.textePieces = this.add.text(16, 16, '', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Orbitron',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(10).setVisible(false);

    // Flags
    this.niveauComplete = false;
    this.finNiveauAppele = false;
    this.vies = 3;

    // Journal de bord
    this.time.delayedCall(300, () => {
      this.afficherJournalDeBord({
        planete: 'MEYER',
        gravite: '0.6 g',
        note: "Pluie de météorites constante. Mon pistolet est mon meilleur ami ici. Attention à la gravité... elle peut s'inverser.",
        touches: ['← →', 'ESPACE', 'A  tirer', 'G  gravité']
      });
    });
  }

  /*********************************************************************/
  /** UPDATE
  /*********************************************************************/
  update() {
    const piecesRestantes = this.groupe_pieces.countActive();
    const piecesRamassees = this.totalPieces - piecesRestantes;
    this.textePieces.setText('🪙 Pièces : ' + piecesRamassees + ' / ' + this.totalPieces);

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
        if (this.player.direction === 'droite') {
          this.player.anims.play('immobiledroit', true);
        } else {
          this.player.anims.play('immobilegauche', true);
        }
      }
    }

    if (this.clavier.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-400);
    }

    // Retour au menu
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.musiqueNiveau5) this.musiqueNiveau5.stop();
      this.scene.start('pageprincipale');
    }

    // affectation de la touche A au tir
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      this.isTir = true;
      this.player.anims.play(this.player.direction === 'droite' ? 'tir_droite' : 'tir_gauche');
      this.tirer(this.player);
      this.time.delayedCall(300, () => { this.isTir = false; });
    }

    // appuie sur G pour changer la gravité
    if (Phaser.Input.Keyboard.JustDown(this.toucheGravite)) {
      if (this.gravityInverted) {
        this.player.body.gravity.y = -600;  // gravité vers le bas
        this.gravityInverted = false;
        this.player.setFlipY(true); // retourne le sprite du joueur
      } else {
        this.player.body.gravity.y = 0;  // gravité vers le haut
        this.gravityInverted = true;
        this.player.setFlipY(false); // remet le sprite du joueur à l'endroit
      }
    }
  }

  /*********************************************************************/
  /** MÉTÉORITES
  /*********************************************************************/
  creerMeteorite() {
    const frameAleatoire = Phaser.Math.Between(0, 3);
    let xAleatoire = Phaser.Math.Between(this.player.x - 300, this.player.x + 300);
    xAleatoire = Phaser.Math.Clamp(xAleatoire, 50, 3000);

    const meteorite = this.groupeMeteorites.create(xAleatoire, this.player.y - 400, 'meteorites', frameAleatoire);
    meteorite.body.allowGravity = false;
    meteorite.setVelocityY(20);
    meteorite.setVelocityX(Phaser.Math.Between(-30, 30));
    meteorite.setBounce(0);
    meteorite.setScale(0.3);
    meteorite.setSize(100, 100);
  }

  hitMeteorite(bullet, meteorite) {
    bullet.destroy();
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
    this.time.delayedCall(200, () => { player.clearTint(); });

    // affiche le nombre de vies restant dans la console
    console.log("Vies restantes :", this.vies);

    // si le joueur n'a plus de vie
    if (this.vies <= 0) {
      this.scene.restart();
    }
  }

  /*********************************************************************/
  /** TIR
  /*********************************************************************/
  tirer(player) {
    const coefDir = player.direction === 'gauche' ? -1 : 1;

    // création de la balle à côté du joueur
    const bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');

    bullet.setScale(0.5);
    bullet.setSize(50, 50);
    bullet.body.allowGravity = false;
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;

    // vitesse de la balle
    bullet.setVelocity(700 * coefDir, 0);
  }

  /*********************************************************************/
  /** PIÈCES
  /*********************************************************************/
  ramasserPiece(player, piece) {
    piece.disableBody(true, true);

    // si toutes les pièces sont ramassées → niveau complet
    if (this.groupe_pieces.countActive() === 0) {
      this.niveauComplete = true;
    }
  }

  /*********************************************************************/
  /** FIN DE NIVEAU
  /*********************************************************************/
  finNiveau(player, teleporter) {
    // Empêcher les appels multiples
    if (this.finNiveauAppele) return;
    this.finNiveauAppele = true;

    // optionnel : désactiver le joueur pour éviter multi déclenchement
    player.setVelocity(0);
    player.disableBody(true, true);

    // on ne valide que si toutes les pièces ont été ramassées
    if (this.niveauComplete) {
      let niveauxFinis = this.game.registry.get('niveauxFinis');
      if (!niveauxFinis.includes('niveau5')) {
        niveauxFinis.push('niveau5');
        this.game.registry.set('niveauxFinis', niveauxFinis);
      }
    }

    // Arrêter la musique du niveau 5
    if (this.musiqueNiveau5) this.musiqueNiveau5.stop();

    // Fondu progressif (fade out)
    this.cameras.main.fadeOut(1500, 0, 0, 0);

    // Attendre la fin du fondu puis changer de niveau
    this.time.delayedCall(1500, () => { this.scene.start('pageprincipale'); });
  }

  /*********************************************************************/
  /** JOURNAL DE BORD
  /*********************************************************************/
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
    const hauteur = 230;
    const pad = 18;


    // Fond vitré
    const fond = this.add.graphics();
    fond.fillStyle(0x0a1a2e, 0.85);
    fond.fillRoundedRect(x, y, largeur, hauteur, 12);
    fond.lineStyle(1, 0x55bbff, 0.5);
    fond.strokeRoundedRect(x, y, largeur, hauteur, 12);
    fond.setScrollFactor(0).setDepth(DEPTH);
    fond[TAG] = true;

    // Reflet haut
    const reflet = this.add.graphics();
    reflet.fillStyle(0xffffff, 0.12);
    reflet.fillRoundedRect(x + 4, y + 4, largeur - 8, 38, 8);
    reflet.setScrollFactor(0).setDepth(DEPTH);
    reflet[TAG] = true;

    const sLabel = { fontFamily: 'Orbitron', fontSize: '10px', color: '#66bbff', letterSpacing: 2 };
    const sTitre = { fontFamily: 'Orbitron', fontSize: '17px', color: '#ddf0ff' };
    const sVal = { fontFamily: 'Orbitron', fontSize: '13px', color: '#aaddff' };
    const sNote = {
      fontFamily: 'Orbitron', fontSize: '11px', color: '#b0d8f5',
      fontStyle: 'italic', wordWrap: { width: largeur - pad * 2 }
    };
    const sTouche = {
      fontFamily: 'Orbitron', fontSize: '11px', color: '#aaddff',
      backgroundColor: '#0d2a40', padding: { x: 5, y: 2 }
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
    sep1.lineStyle(1, 0x55bbff, 0.25);
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
    sep2.lineStyle(1, 0x55bbff, 0.25);
    sep2.lineBetween(x + pad, y + 155, x + largeur - pad, y + 155);
    sep2.setScrollFactor(0).setDepth(DEPTH);
    sep2[TAG] = true;

    // Contrôles
    txt(x + pad, y + 163, 'CONTRÔLES', sLabel);
    let ox = x + pad;
    config.touches.forEach(t => {
      const label = this.add.text(ox, y + 175, t, sTouche)
        .setScrollFactor(0).setDepth(DEPTH)
        .setData(TAG, true);
      ox += label.width + 6;
    });

    // Collecte tous les éléments du journal
    const elements = this.children.list.filter(c =>
      c[TAG] === true || c.getData?.(TAG) === true
    );

    // Disparition après 10s
    this.time.delayedCall(8000, () => {
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