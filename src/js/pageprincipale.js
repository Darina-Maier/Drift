

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var p1;
var boutonentrer;

// définition de la classe "selection"
export default class pageprincipale extends Phaser.Scene {
  constructor() {
    super({ key: "pageprincipale" }); // mettre le meme nom que le nom de la classe
  }

  /***********************************************************************/
  /** FONCTION PRELOAD 
/***********************************************************************/

  preload() {
    // fond étoiles 
    this.load.image("nightskycolor", "src/assets/nightskycolor.png");
//PLANETES 
    this.load.image('planete1', 'src/assets/planet1.png'); 
    this.load.image('planete2', 'src/assets/planet2.png'); 
    this.load.image('planete3', 'src/assets/planet4.png'); 
    this.load.image('planete4', 'src/assets/planet5.png'); 
    this.load.image('planete5', 'src/assets/planet7.png'); 
    this.load.image('planete6', 'src/assets/planet10.png'); 
    this.load.image('planete7', 'src/assets/planet19.png');
    this.load.image('planete8', 'src/assets/planet15.png');
    this.load.image('background', 'src/assets/etoiles.png');
    this.load.image('background2', 'src/assets/etoilebleue.png');
    this.load.image('plateforme1', 'src/assets/plateforme1.png')

    this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
        frameWidth: 130,
        frameHeight: 90
    });
    this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
        frameWidth: 130,
        frameHeight: 90
    });
  }

  /***********************************************************************/
  /** FONCTION CREATE 
/***********************************************************************/

  create() {
// fond 
    this.cameras.main.setBackgroundColor('#000010');

//planetes
    p1 = this.physics.add.staticSprite(224,  384, 'planete1');
    var p2 = this.physics.add.staticSprite(470,  384, 'planete2');
    var p3 = this.physics.add.staticSprite(716,  384, 'planete3');
    var p4 = this.physics.add.staticSprite(962,  384, 'planete4');
    var p5 = this.physics.add.staticSprite(1208, 384, 'planete5');
    var p6 = this.physics.add.staticSprite(1454, 384, 'planete6');
    var p7 = this.physics.add.staticSprite(1700, 384, 'planete7');
    var p8 = this.physics.add.staticSprite(1946, 384, 'planete8');
    var plateforme = this.physics.add.staticSprite(0,  384, 'plateforme1');

//définitions des hitbox circulaires pour planètes 
    p1.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p1.body.setOffset(56, 56); // décale la hitbox de 64 pixels vers la gauche et 64 pixels vers le haut pour la centrer sur le sprite
    
    p2.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p2.body.setOffset(59, 62);

    p3.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p3.body.setOffset(56, 56);

    p4.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p4.body.setOffset(56, 56);

    p5.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p5.body.setOffset(56, 56);

    p6.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p6.body.setOffset(56, 56);

    p7.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p7.body.setOffset(56, 56);

    p8.body.setCircle(94); // définit une hitbox circulaire de rayon 128 pixels centrée sur le sprite
    p8.body.setOffset(56, 56);

//création joueur 
    player = this.physics.add.sprite(0, 10, 'astronaut'); 
    player.setSize(65, 45); 
    player.direction='droite'

//parametres joueur 
    player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 2048, 768);
    this.cameras.main.setBounds(0, 0, 2048, 768);
    this.cameras.main.startFollow(player);

//collisions 
    clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, plateforme);
    this.physics.add.collider(player, p1);
    this.physics.add.collider(player, p2);
    this.physics.add.collider(player, p3);
    this.physics.add.collider(player, p4);
    this.physics.add.collider(player, p5);
    this.physics.add.collider(player, p6);
    this.physics.add.collider(player, p7);
    this.physics.add.collider(player, p8);
    player.setVelocityX(0); // vitesse horizontale constante vers la droite
    
    //entrer niveau 
    boutonentrer = this.input.keyboard.addKey('E');

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
        frames: [ { key: 'astronaut', frame: 21 } ],
        frameRate: 1
    });
    this.anims.create({
        key: 'immobilegauche',
        frames: [ { key: 'astronautinverse', frame: 21 } ],
        frameRate: 1
    });
    this.anims.create({
        key: 'sautdroit',
        frames: this.anims.generateFrameNumbers('astronaut', { start: 30, end: 35 }),
        frameRate: 10
    })
    
  }

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {
    if (clavier.right.isDown) {
      player.setVelocityX(160); 
      player.direction='droite'
      player.anims.play('anim_droite', true);
    } else if (clavier.left.isDown) {
      player.setVelocityX(-160); 
      player.direction='gauche'
      player.anims.play('anim_gauche', true);
    } else{
       player.setVelocityX(0); // ← action séparée
    if (player.direction == 'droite') {
        player.anims.play('immobiledroit', true);
    } else {
        player.anims.play('immobilegauche', true);
      }
    }
    if (clavier.space.isDown && player.body.blocked.down) {
        player.setVelocityY(-400);
    }
    if (Phaser.Input.Keyboard.JustDown(boutonentrer)) {
    if (this.physics.overlap(player, p1)) {
        this.scene.start('niveau1');
    }
  }
}
}
/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/
