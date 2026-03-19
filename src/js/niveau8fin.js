export default class niveau8fin extends Phaser.Scene {
    constructor() {
        super({ key: "niveau8fin" });
    }

    preload() {
        this.load.image("fusee", "src/assets/fusee.png");
        this.load.image("flammes", "src/assets/flammes.png");
        this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
            frameWidth: 130, frameHeight: 90
        });
        this.load.spritesheet('astronautinverse', 'src/assets/astronautinverse.png', {
            frameWidth: 130, frameHeight: 90
        });
        this.load.spritesheet('ennemi', 'src/assets/ennemi.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.image("terre", "src/assets/planet18_0.png");
    }

    create() {
        this.cameras.main.setBackgroundColor('#000011');

        // ── ÉTOILES ───────────────────────────────────────────────
        for (let i = 0; i < 80; i++) {
            this.add.circle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
        }

        // ── ANIMATIONS ───────────────────────────────────────────
        if (!this.anims.exists('immobiledroit')) {
            this.anims.create({
                key: 'immobiledroit',
                frames: [{ key: 'astronaut', frame: 21 }],
                frameRate: 1
            });
        }
        if (!this.anims.exists('courirdroite')) {
            this.anims.create({
                key: 'courirdroite',
                frames: this.anims.generateFrameNumbers('astronaut', { start: 12, end: 17 }),
                frameRate: 10, repeat: -1
            });
        }
        if (!this.anims.exists('ennemi_droite')) {
            // Robot inversé → flipX pour le retourner vers la gauche
            this.anims.create({
                key: 'ennemi_droite',
                frames: this.anims.generateFrameNumbers('ennemi', { start: 0, end: 2 }),
                frameRate: 6, repeat: -1
            });
        }

        // ── PERSONNAGES ───────────────────────────────────────────
        this.winston = this.add.sprite(150, 500, 'astronaut');
        this.winston.setScale(1.2);
        this.winston.anims.play('immobiledroit');

        // Robot retourné vers la gauche avec flipX
        this.robot = this.add.sprite(830, 500, 'ennemi');
        this.robot.setScale(3);
        this.robot.setFlipX(true); // ← retourne le robot vers la gauche
        this.robot.anims.play('ennemi_droite', true);

        // ── FUSÉE ET TERRE (cachées) ───────────────────────────────
        this.fusee = this.add.image(512, 430, 'fusee');
        this.fusee.setScale(0.7); // ← plus grande
        this.fusee.setVisible(false);

        this.flammes = this.add.image(512, 530, 'flammes');
        this.flammes.setScale(0.4);
        this.flammes.setVisible(false);

        // Terre petite au loin en haut à droite
        this.terre = this.add.image(880, 100, 'terre');
        this.terre.setScale(0.12);
        this.terre.setVisible(false);

        // ── CLAVIER ───────────────────────────────────────────────
        this.curseurs = this.input.keyboard.createCursorKeys();
        this.touche_espace = this.input.keyboard.addKey('SPACE');

        // ── ÉTAT ──────────────────────────────────────────────────
        this.etape = 'message_intro';
        this.rencontreDeclenchee = false;

        // ── TABLEAU INTRO ─────────────────────────────────────────
        this.afficherTableau(
            'Bravo ! Tu as récupéré toutes les pièces !\nIl ne reste plus qu\'à réparer la fusée !',
            '[ ESPACE pour continuer ]'
        );

        // Texte indicatif flèche droite (caché au départ)
        this.texteFlèche = this.add.text(512, 580,
            '→ Flèche droite pour avancer', {
            fontSize: '16px', fill: '#aaaaaa', align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    // ── TABLEAU FUTURISTE ─────────────────────────────────────────
    afficherTableau(texte, bouton) {
        this.cacherTableau();

        this.fondTableau = this.add.graphics().setDepth(30);
        this.fondTableau.fillStyle(0x001133, 0.85);
        this.fondTableau.fillRoundedRect(162, 270, 700, 180, 20);
        this.fondTableau.lineStyle(2, 0x00ccff, 1);
        this.fondTableau.strokeRoundedRect(162, 270, 700, 180, 20);

        this.texteTableau = this.add.text(512, 330, texte, {
            fontSize: '20px', fill: '#00eeff', align: 'center',
            stroke: '#003366', strokeThickness: 2,
            wordWrap: { width: 640 }
        }).setOrigin(0.5).setDepth(32);

        this.texteBouton = this.add.text(512, 415, bouton, {
            fontSize: '15px', fill: '#ffffff', align: 'center',
            backgroundColor: '#004488',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5).setDepth(32);

        this.tweens.add({
            targets: this.texteBouton,
            alpha: 0.4, duration: 600,
            yoyo: true, repeat: -1
        });
    }

    cacherTableau() {
        if (this.fondTableau) this.fondTableau.destroy();
        if (this.texteTableau) this.texteTableau.destroy();
        if (this.texteBouton) this.texteBouton.destroy();
    }

    update() {
        // ── MESSAGE INTRO ─────────────────────────────────────────
        if (this.etape === 'message_intro') {
            if (Phaser.Input.Keyboard.JustDown(this.touche_espace)) {
                this.cacherTableau();
                this.etape = 'marche';
                this.texteFlèche.setVisible(true);
                this.winston.anims.play('courirdroite', true);
            }
        }

        // ── MARCHE VERS LE ROBOT ──────────────────────────────────
        if (this.etape === 'marche') {
            if (this.curseurs.right.isDown) {
                this.winston.x += 3;
                this.winston.anims.play('courirdroite', true);
            } else {
                this.winston.anims.play('immobiledroit', true);
            }

            // Proche du robot → rencontre
            if (this.winston.x >= 620 && !this.rencontreDeclenchee) {
                this.rencontreDeclenchee = true;
                this.etape = 'rencontre';
                this.texteFlèche.setVisible(false);
                this.winston.anims.play('immobiledroit');

                this.afficherTableau(
                    'Robot : "Désolé de t\'avoir attaqué...\nLaisse-moi réparer ta fusée !"',
                    '[ ESPACE pour continuer ]'
                );
            }
        }

        // ── RENCONTRE ─────────────────────────────────────────────
        if (this.etape === 'rencontre') {
            if (Phaser.Input.Keyboard.JustDown(this.touche_espace)) {
                this.cacherTableau();
                this.etape = 'decollage';

                // Fusée apparaît derrière Winston
                this.fusee.setPosition(300, 420);
                this.flammes.setPosition(300, 510);
                this.fusee.setVisible(true);

                // Winston marche vers la fusée
                this.tweens.add({
                    targets: this.winston,
                    x: 280, duration: 1000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.winston.setVisible(false);
                        this.flammes.setVisible(true);

                        // Robot recule
                        this.tweens.add({
                            targets: this.robot,
                            x: 950, duration: 800
                        });

                        // Décollage — fusée monte et part vers la Terre
                        this.terre.setVisible(true);
                        this.tweens.add({
                            targets: [this.fusee, this.flammes],
                            x: 880, y: 100,   // ← part vers la Terre en haut à droite
                            scaleX: 0.15, scaleY: 0.15, // ← rapetisse = s'éloigne
                            duration: 3000,
                            ease: 'Power2',
                            onComplete: () => {
                                this.fusee.setVisible(false);
                                this.flammes.setVisible(false);

                                // Terre grossit légèrement
                                this.tweens.add({
                                    targets: this.terre,
                                    scaleX: 0.25, scaleY: 0.25,
                                    duration: 1500,
                                    ease: 'Power1',
                                    onComplete: () => {
                                        this.etape = 'fin';
                                        this.afficherFin();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }

    afficherFin() {
        this.robot.setVisible(false);

        this.fondFin = this.add.graphics().setDepth(30);
        this.fondFin.fillStyle(0x001133, 0.9);
        this.fondFin.fillRoundedRect(112, 220, 800, 320, 20);
        this.fondFin.lineStyle(2, 0x00ccff, 1);
        this.fondFin.strokeRoundedRect(112, 220, 800, 320, 20);

        this.add.text(512, 330,
            '🚀 Winston est rentré sur Terre !\n\nIl a retrouvé sa famille.\nMerci d\'avoir joué !', {
            fontSize: '24px', fill: '#00eeff', align: 'center',
            stroke: '#003366', strokeThickness: 2,
            wordWrap: { width: 680 }
        }).setOrigin(0.5).setDepth(32);

        // Bouton rejouer
        let boutonRejouer = this.add.text(340, 470, '🔄 Rejouer', {
            fontSize: '20px', fill: '#ffffff',
            backgroundColor: '#004488',
            padding: { x: 20, y: 10 }
        }).setDepth(32).setInteractive();

        // Bouton accueil
        let boutonAccueil = this.add.text(560, 470, '🏠 Accueil', {
            fontSize: '20px', fill: '#ffffff',
            backgroundColor: '#004488',
            padding: { x: 20, y: 10 }
        }).setDepth(32).setInteractive();

        boutonRejouer.on('pointerover', () => boutonRejouer.setStyle({ backgroundColor: '#0077cc' }));
        boutonRejouer.on('pointerout',  () => boutonRejouer.setStyle({ backgroundColor: '#004488' }));
        boutonAccueil.on('pointerover', () => boutonAccueil.setStyle({ backgroundColor: '#0077cc' }));
        boutonAccueil.on('pointerout',  () => boutonAccueil.setStyle({ backgroundColor: '#004488' }));

        boutonRejouer.on('pointerup', () => {
            this.game.registry.set('niveauxFinis', []);
            this.scene.start('pageprincipale');
        });
        boutonAccueil.on('pointerup', () => {
            this.game.registry.set('niveauxFinis', []);
            this.scene.start('acceuil');
        });
    }
}