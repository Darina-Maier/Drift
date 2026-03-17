
export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("bg", "src/assets/tuilesn1/1/1_game_background.png");
    this.load.image("t1", "src/assets/tuilesn1/1/1.png");
    this.load.image("t2", "src/assets/tuilesn1/1/2.png");
    this.load.image("t3", "src/assets/tuilesn1/1/3.png");
    this.load.image("t4", "src/assets/tuilesn1/1/4.png");
    this.load.image("t5", "src/assets/tuilesn1/1/5.png");
    this.load.image("t6", "src/assets/tuilesn1/1/6.png");
    this.load.image("plat", "src/assets/tuilesn1/plateform1.png");

// chargement de la carte
  this.load.tilemapTiledJSON("carte", "src/assets/planeterouge.json");  
  }

  create() {
  const carteDuNiveau = this.add.tilemap("carte");

// chargement du jeu de tuiles
  const ts_bg   = carteDuNiveau.addTilesetImage("1_game_background", "bg");
    const ts_t1   = carteDuNiveau.addTilesetImage("1", "t1");
    const ts_t2   = carteDuNiveau.addTilesetImage("2", "t2");
    const ts_t3   = carteDuNiveau.addTilesetImage("3", "t3");
    const ts_t4   = carteDuNiveau.addTilesetImage("4", "t4");
    const ts_t5   = carteDuNiveau.addTilesetImage("5", "t5");
    const ts_t6   = carteDuNiveau.addTilesetImage("6", "t6");
    const ts_plat = carteDuNiveau.addTilesetImage("plateform1", "plat");
         
  const tilesets = [ts_bg, ts_t1, ts_t2, ts_t3, ts_t4, ts_t5, ts_t6, ts_plat];

    const calque_background  = carteDuNiveau.createLayer("calque_planète_rouge",  tilesets);
    const calque_plateformes = carteDuNiveau.createLayer("calque_platform_rouge", tilesets);

    // Collision sur les tuiles solides
    calque_plateformes.setCollisionByProperty({ estSolide: true });
        calque_plateformes.setCollisionByProperty({ estsolide: true });

    this.player = this.physics.add.sprite(100, 450, 'astronaut');
    this.player.setSize(50, 70);
    this.player.setOffset(36, 10);
    this.player.setCollideWorldBounds(true);
    this.player.direction = 'droite';

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, calque_plateformes);
    this.cameras.main.setBounds(0, 0, 3072, 768); 
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, 3072, 768); // ← même dimensions que la caméra
    
  }

  update() {
 if (this.clavier.right.isDown) {
      this.player.setVelocityX(160); 
      this.player.direction='droite'
      this.player.anims.play('anim_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160); 
      this.player.direction='gauche'
      this.player.anims.play('anim_gauche', true);
    } else{
      this.player.setVelocityX(0); // ← action séparée
    if (this.player.direction == 'droite') {
        this.player.anims.play('immobiledroit', true);
    } else {
        this.player.anims.play('immobilegauche', true);
      }
    }
    if (this.clavier.space.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-400);
    }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
        this.scene.start('pageprincipale');
}
  }
}
