


/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var boutonFeu;
var groupeBullets;


export default class niveau5 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau5" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }


  preload() {
    this.load.audio("musiqueNiveau5", "src/assets/sons/niveau5.ogg");
    this.load.image("bg5", "src/assets/tuilesn5/background_n5.png");
    this.load.image("t5", "src/assets/tuilesn5/Tileset_n5.png");
    //chargement piece5
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

  create() {
    // stoppe les anciennes musiques
  this.sound.stopAll();

  // lance la musique du niveau 5
  this.musiqueNiveau5 = this.sound.add("musiqueNiveau5", {
    loop: true,
    volume: 0.5
});

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
this.physics.add.overlap(groupeBullets, this.groupeMeteorites, this.hitMeteorite, null, this);;
this.vies = 3;
// contact joueur meteorite
this.physics.add.overlap(this.player, this.groupeMeteorites, this.toucheMeteorite, null, this);

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
this.teleporter = this.physics.add.sprite(3020, 620, 'tp01');
this.teleporter.body.allowGravity = false;
this.teleporter.setImmovable(true);

// animation en boucle 
this.teleporter.anims.play('anim_teleporter');
this.teleporter.setScale(0.3);
this.teleporter.setSize(50,200);
this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

// création pièces
    this.groupe_pieces = this.physics.add.staticGroup();
    // Récupère le calque objet
    const calque_objets = carten5.getObjectLayer('calque_objet5');

    if (!calque_objets) {
    console.error("Calque pièces introuvable !");
} else {
    calque_objets.objects.forEach(point => {
        if (point.name == 'piecearamasser5') {
            var nouvelle_piece = this.groupe_pieces.create(point.x, point.y, 'piece5');
            nouvelle_piece.setScale(0.5);
        }
    });
}

    // PERMET DE RAMASSER LES PIECES
    this.physics.add.overlap(this.player, this.groupe_pieces, this.ramasserPiece, null, this);

  }

  update() {
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
//    this.physics.world.gravity.y = -200; // gravité vers le haut
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
  bullet.setSize(50,50);
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
  // Empêcher les appels multiples
  if (this.finNiveauAppele) return;
  this.finNiveauAppele = true;

  // optionnel : désactiver le joueur pour éviter multi déclenchement
  player.setVelocity(0);
  player.disableBody(true, true);

  // Arrêter la musique du niveau 5
  if (this.musiqueNiveau5) {
    this.musiqueNiveau5.stop();
  }

  // Fondu progressif (fade out)
  this.cameras.main.fadeOut(1500, 0, 0, 0);

  // Attendre la fin du fondu puis changer de niveau
  this.time.delayedCall(1500, () => {
    this.scene.start('pageprincipale');
  });
}

ramasserPiece(player, piece) {
    piece.disableBody(true, true);
    // Ici tu peux ajouter du code pour augmenter le score ou autre
  }

}

