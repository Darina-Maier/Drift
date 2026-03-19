

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/
var player;
var clavier;
var p1;
var p2;
var p3;
var p4;
var p5;
var p6;
var p7;
var p8;
var boutonentrer;
var boutoncourir;

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
        this.load.image("backgp", "src/assets/backgp.jpg");
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
        this.load.audio('ArriveSurTerre', 'src/assets/sons/accueil.ogg');
    }

    /***********************************************************************/
    /** FONCTION CREATE 
  /***********************************************************************/

    create() {
        // appliquer l'état global du son
        this.sound.mute = !this.game.soundOn;

        // relancer la musique menu si elle n'est pas déjà en cours
        if (!this.game.musiqueMenu || !this.game.musiqueMenu.isPlaying) {
            this.game.musiqueMenu = this.sound.add('ArriveSurTerre', {
                loop: true,
                volume: 0.5
            });
            this.game.musiqueMenu.play();
        }
        // fond 
        let background = this.add.image(400, 300, 'backgp');
        background.setScrollFactor(0.4); // le fond ne bouge pas avec la caméra

        //planetes
        p1 = this.physics.add.staticSprite(224, 384, 'planete1');
        p2 = this.physics.add.staticSprite(470, 384, 'planete2');
        p3 = this.physics.add.staticSprite(716, 384, 'planete3');
        p4 = this.physics.add.staticSprite(962, 384, 'planete4');
        p5 = this.physics.add.staticSprite(1208, 384, 'planete5');
        p6 = this.physics.add.staticSprite(1454, 384, 'planete6');
        p7 = this.physics.add.staticSprite(1700, 384, 'planete7');
        p8 = this.physics.add.staticSprite(1946, 384, 'planete8');
        var plateforme = this.physics.add.staticSprite(0, 384, 'plateforme1');

        // Compteur pièces (fixe à l'écran)
        this.textePieces = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Orbitron',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(10);

        // Overlay gris pour planètes terminées
        this.overlays = {};
        const planetes = { niveau1: p1, niveau2: p2, niveau3: p3, niveau4: p4, niveau5: p5, niveau6: p6, niveau7: p7 };

        Object.entries(planetes).forEach(([nom, planete]) => {
            let overlay = this.add.circle(planete.x, planete.y, 94, 0x000000, 0.6);
            overlay.setDepth(5);
            let check = this.add.text(planete.x, planete.y, '✓', {
                fontSize: '48px',
                fill: '#00ff00',
                fontFamily: 'Orbitron'
            }).setOrigin(0.5).setDepth(6);

            this.overlays[nom] = { overlay, check };
        });

        // Overlay pour la Terre (p8) — bloquée par défaut
        this.overlayTerre = this.add.circle(p8.x, p8.y, 94, 0x000000, 0.7).setDepth(5);
        this.texteTerre = this.add.text(p8.x, p8.y, '🔒', {
            fontSize: '36px'
        }).setOrigin(0.5).setDepth(6);

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

        document.fonts.load('16px Orbitron').then(() => {
        });
        // ajout des noms des planètes 
        this.add.text(224, 520, 'Planète\nMAKHCHAN', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(470, 520, 'Planète\nFRAGALE', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(716, 520, 'Planète\nDURAND', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(962, 520, 'Planète\nJOUSSET', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(1208, 520, 'Planète\nMEYER', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(1454, 520, 'Planète\nALONZO', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(1700, 520, 'Planète\nDARTIES', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);
        this.add.text(1946, 520, 'Planète\nTERRE', { fontSize: '16px', fill: '#fff', fontFamily: 'Orbitron', align: 'center' }).setOrigin(0.5);

        //création joueur 
        player = this.physics.add.sprite(0, 10, 'astronaut');
        player.setSize(40, 65);
        player.direction = 'droite'

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
        boutoncourir = this.input.keyboard.addKey('C');

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
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'courirdroite',
            frames: this.anims.generateFrameNumbers('astronaut', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'courirgauche',
            frames: this.anims.generateFrameNumbers('astronautinverse', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        // Dans create(), remplace ou complète ta plateforme existante
        const sol = this.add.rectangle(1024, 490, 2048, 20); // invisible (pas de couleur)
        this.physics.add.existing(sol, true); // true = statique
        this.physics.add.collider(player, sol);

    }

    

    update() {
        // Mise à jour compteur
        const pieces = this.game.registry.get('pieces');
        const piecesTotal = this.game.registry.get('piecesTotal');
        const niveauxFinis = this.game.registry.get('niveauxFinis');
        this.textePieces.setText('🪐 Planètes : ' + niveauxFinis.length + ' / 7');

        // Affiche overlays des niveaux terminés
        const planetes = { niveau1: p1, niveau2: p2, niveau3: p3, niveau4: p4, niveau5: p5, niveau6: p6, niveau7: p7 };
        Object.entries(planetes).forEach(([nom, planete]) => {
            const fini = niveauxFinis.includes(nom);
            this.overlays[nom].overlay.setVisible(fini);
            this.overlays[nom].check.setVisible(fini);
        });

        // Terre : bloquée tant que toutes les pièces ne sont pas récupérées
        const terreDeverrouillee = niveauxFinis.length >= 7;
        this.overlayTerre.setVisible(!terreDeverrouillee);
        this.texteTerre.setVisible(!terreDeverrouillee);

        // Mouvements joueur 
        if (boutoncourir.isDown) {
            if (player.direction == 'droite') {
                player.setVelocityX(300);
                player.anims.play('courirdroite', true);
            } else {
                player.setVelocityX(-300);
                player.anims.play('courirgauche', true);
            }
        } else {
            if (clavier.right.isDown) {
                player.setVelocityX(160);
                player.direction = 'droite';
                player.anims.play('anim_droite', true);
            } else if (clavier.left.isDown) {
                player.setVelocityX(-160);
                player.direction = 'gauche';
                player.anims.play('anim_gauche', true);
            } else {
                player.setVelocityX(0);
                if (player.direction == 'droite') {
                    player.anims.play('immobiledroit', true);
                } else {
                    player.anims.play('immobilegauche', true);
                }
            }
        }

        if (clavier.space.isDown && player.body.blocked.down) {
            player.setVelocityY(-300);
        }

        // Entrée dans les niveaux avec touche E
        if (Phaser.Input.Keyboard.JustDown(boutonentrer)) {
            const entrees = [
                { planete: p1, niveau: 'niveau1' },
                { planete: p2, niveau: 'niveau2' },
                { planete: p3, niveau: 'niveau3' },
                { planete: p4, niveau: 'niveau4' },
                { planete: p5, niveau: 'niveau5' },
                { planete: p6, niveau: 'niveau6' },
                { planete: p7, niveau: 'niveau7' },
            ];

            entrees.forEach(({ planete, niveau }) => {
                if (this.physics.overlap(player, planete)) {
                    // Bloque si niveau déjà terminé
                    if (!niveauxFinis.includes(niveau)) {
                        this.scene.start(niveau);
                    }
                }
            });

            // Terre : seulement si toutes les pièces récupérées
            if (this.physics.overlap(player, p8) && terreDeverrouillee) {
                this.scene.start('niveauTerre'); // à adapter selon ton nom de scène

            }

        }
        //triche
        // Touche de triche : T = tout débloquer
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('T'))) {
            this.game.registry.set('niveauxFinis', ['niveau1', 'niveau2', 'niveau3', 'niveau4', 'niveau5', 'niveau6', 'niveau7']);
        }
    }
}

