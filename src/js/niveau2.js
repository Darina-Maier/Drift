/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var timerText;
var timeRemaining;
var boutoncourir;

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
  this.load.image("dungeon",   "src/assets/tuilesn2/DungeonTileSet.png");

  this.load.tilemapTiledJSON("carte2", "src/assets/niveau2.json");

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
  const carten2 = this.add.tilemap("carte2");

  // Ajouter les tilesets - on va essayer tous les noms possibles
  let ts_bg, ts_tuilesJeu, ts_dungeon;
  
  try {
    ts_bg = carten2.addTilesetImage("background_niveau2", "bg2");
  } catch(e) {
    console.log("Erreur background_niveau2", e);
  }
  
  try {
    ts_tuilesJeu = carten2.addTilesetImage("tuilesJeu", "tuilesJeu");
  } catch(e) {
    console.log("Erreur tuilesJeu", e);
  }
  
  try {
    ts_dungeon = carten2.addTilesetImage("Dungeon Tile Set", "dungeon");
  } catch(e) {
    console.log("Erreur Dungeon Tile Set", e);
  }

  // Créer les couches avec les tilesets disponibles
  const calque_background = carten2.createLayer("calque_background_n2", [ts_bg], 0, 0);

console.log("ts_bg:", ts_bg);
console.log("ts_tuilesJeu:", ts_tuilesJeu);
console.log("ts_dungeon:", ts_dungeon);
console.log("calque_background:", calque_background);
  const calque_plateformes1 = carten2.createLayer("calque_platform_n2", ts_tuilesJeu, 0, 0);
  const calque_plateformes2 = carten2.createLayer("calque_platform2_n2", ts_tuilesJeu, 0, 0);
  const calque_plateformes3 = carten2.createLayer("calque_platform3_n2", [ts_tuilesJeu, ts_dungeon], 0, 0);

  if (calque_plateformes1) calque_plateformes1.setCollisionByProperty({ estsolide: true });
  if (calque_plateformes2) calque_plateformes2.setCollisionByProperty({ estsolide: true });
  if (calque_plateformes3) calque_plateformes3.setCollisionByProperty({ estsolide: true });

  this.player = this.physics.add.sprite(100, 450, "astronaut");
  this.player.setSize(50, 70);
  this.player.setOffset(36, 10);
  this.player.setCollideWorldBounds(true);
  this.player.direction = "droite";

  this.clavier = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(this.player, calque_plateformes1);
  this.physics.add.collider(this.player, calque_plateformes2);
  this.physics.add.collider(this.player, calque_plateformes3);

  this.cameras.main.setBounds(0, 0, 3072, 768);
  this.cameras.main.startFollow(this.player);
  this.physics.world.setBounds(0, 0, 3072, 768);

  this.calque_plateformes1 = calque_plateformes1;
  this.calque_plateformes2 = calque_plateformes2;
  this.calque_plateformes3 = calque_plateformes3;

   boutoncourir = this.input.keyboard.addKey('C');


  timeRemaining = 90;
  timerText = this.add.text(20, 20, "Temps: 1:30", {
    fontSize: "32px",
    fill: "#ffffff",
    fontStyle: "bold"
  });
  timerText.setScrollFactor(0);

  this.time.addEvent({
    delay: 1000,
    callback: this.updateTimer,
    callbackScope: this,
    loop: true
  })
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
    
    // Vérifier si le joueur touche le sol (pas les plateformes)
    // Le sol est en bas de l'écran (Y > 680 approximativement)
    if (this.player.y > 680 && timeRemaining > 0) {
        // Réinitialiser le joueur au début du niveau
        this.player.setPosition(100, 450);
        this.player.setVelocity(0, 0);
    }
    }
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

