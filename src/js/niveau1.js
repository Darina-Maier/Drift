var ast;
var en1;
var boutoncourir;

export default class niveau1 extends Phaser.Scene {

  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("bg", "src/assets/tuilesn1/1/1_game_background.png");
    this.load.image("plat1", "src/assets/tuilesn1/plateform1.png");
    this.load.image("plat2", "src/assets/tuilesn1/platform2.png");
    this.load.image("plat3", "src/assets/tuilesn1/platform3.png");

    this.load.image("e1", "src/assets/elemn1/en1.png");
    this.load.image("e2", "src/assets/elemn1/en2.png");
    this.load.image("e3", "src/assets/elemn1/en3.png");
    this.load.image("e4", "src/assets/elemn1/en4.png");
    this.load.image("e5", "src/assets/elemn1/en5.png");
    this.load.image("e6", "src/assets/elemn1/en6.png");

// chargement de la musique du niveau 1
    this.load.audio("musiqueNiveau1", "src/assets/sons/niveau1.ogg");
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


    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/planeterouge.json");
  }

  create() {
// stoppe la musique de l'accueil / intro / page principale
    if (this.game.musiqueMenu) {
      this.game.musiqueMenu.stop();
    }

    // lance la musique du niveau 1
    this.musiqueNiveau1 = this.sound.add("musiqueNiveau1", {
      loop: true,
      volume: 0.5
    });
    this.musiqueNiveau1.play();

    const carteDuNiveau = this.add.tilemap("carte");

    // chargement du jeu de tuiles
    const ts_bg = carteDuNiveau.addTilesetImage("1_game_background", "bg");

    const ts_plat1 = carteDuNiveau.addTilesetImage("plateform1", "plat1");
    const ts_plat2 = carteDuNiveau.addTilesetImage("platform2", "plat2");
    const ts_plat3 = carteDuNiveau.addTilesetImage("platform3", "plat3");

    const tilesets = [ts_bg, ts_plat1, ts_plat2, ts_plat3];

    const calque_background = carteDuNiveau.createLayer("calque_planète_rouge", tilesets);
    const calque_plateformes = carteDuNiveau.createLayer("calque_platform", tilesets);
    const calque_death = carteDuNiveau.createLayer("calque_platform_death", tilesets);


    // Collision sur les plateformes
    calque_plateformes.setCollisionByProperty({ estSolide: true });
    // Collision death — tue le joueur 
    calque_death.setCollisionByProperty({ estSolide: true });

    this.player = this.physics.add.sprite(120, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, 3072, 768);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra

    // bouton définit 
    this.toucheGravite = this.input.keyboard.addKey('G');
    boutoncourir = this.input.keyboard.addKey('C');

    //mise en place en1
    var groupe_en1 = this.physics.add.group();

    var en1Images = ["e1", "e2", "e3", "e4", "e5", "e6"]
    for (let i = 0; i < 6; i++) {
      var coordX = 150 + 600 * i;
      var coordY = 0;
      groupe_en1.create(coordX, coordY, en1Images[i]);
    };
    this.physics.add.collider(this.player, calque_plateformes);
    this.physics.add.collider(this.player, calque_death, () => {
      if (this.musiqueNiveau1) {
        this.musiqueNiveau1.stop();
      }
      this.scene.restart();
    });

    this.physics.add.collider(groupe_en1, calque_plateformes);
    this.physics.add.overlap(this.player, groupe_en1, ramasseren1, null, this);
    this.gravityInverted == false;

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
this.teleporter = this.physics.add.sprite(3020, 200, 'tp01');
this.teleporter.body.allowGravity = false;
this.teleporter.setImmovable(true);

// animation en boucle 
this.teleporter.anims.play('anim_teleporter');
this.teleporter.setScale(0.3);
this.teleporter.setSize(150,200);
this.physics.add.overlap(this.player, this.teleporter, this.finNiveau, null, this);

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

    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      this.scene.start('pageprincipale');
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
}

finNiveau(player, teleporter) {

  // optionnel : désactiver le joueur pour éviter multi déclenchement
  player.setVelocity(0);
  player.disableBody(true, true);

  // retour tp menu principal
  this.scene.start('pageprincipale');
}

}

//autres fonctions 
//fonction ramasser element
function ramasseren1(personnage, element) {
  element.disableBody(true, true);


}

