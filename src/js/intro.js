export default class intro extends Phaser.Scene {
    constructor() {
        super({ key: "intro" });
    }

    preload() {
        this.load.image("fusee", "src/assets/fusee.png");
        this.load.image("flammes", "src/assets/flammes.png");
        this.load.spritesheet('astronaut', 'src/assets/astronaut.png', {
            frameWidth: 130,
            frameHeight: 90
        });
        this.load.audio("alarme", "src/assets/sons/alarm.ogg");
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.sound.mute = !this.game.soundOn;

        // Bouton son
        this.boutonSon = this.add.text(880, 20, this.game.soundOn ? "Sound ON" : "Sound OFF", {
            fontSize: "24px",
            fill: "#ffffff",
            backgroundColor: "#000000"
        }).setInteractive();
        this.boutonSon.setScrollFactor(0);
        this.boutonSon.on("pointerdown", () => {
            this.game.soundOn = !this.game.soundOn;
            this.sound.mute = !this.game.soundOn;
            this.boutonSon.setText(this.game.soundOn ? "Sound ON" : "Sound OFF");
        });

        // Personnage
        this.perso = this.physics.add.sprite(250, 450, 'astronaut');
        this.perso.body.allowGravity = false;
        this.perso.setScale(1.0);

        // Animations
        this.anims.create({
            key: 'anim_droite',
            frames: this.anims.generateFrameNumbers('astronaut', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'immobiledroit',
            frames: [{ key: 'astronaut', frame: 21 }],
            frameRate: 1
        });

        // Fusée
        this.fusee = this.add.image(600, 400, 'fusee');
        this.fusee.setScale(2.0);

        // Flammes
        this.flammes = this.add.image(600, 500, 'flammes');
        this.flammes.setScale(0.3);
        this.flammes.setVisible(false);

        // Bulle
        this.bulle = this.add.graphics();
        this.bulle.fillStyle(0xffffff, 1);
        this.bulle.fillRoundedRect(80, 300, 350, 80, 15);
        this.bulle.setVisible(false);

        // Texte bulle
        this.texteBulle = this.add.text(100, 320, '', {
            fontSize: '16px',
            fill: '#000000',
            wordWrap: { width: 320 }
        });
        this.texteBulle.setVisible(false);

        // Texte "appuie sur espace"
        this.texteEspace = this.add.text(350, 650, 'Appuie sur ESPACE pour continuer...', {
            fontSize: '14px',
            fill: '#aaaaaa',
            align: 'center'
        });
        this.texteEspace.setOrigin(0.5);
        this.texteEspace.setVisible(false);

        // Texte final
        this.texteFinal = this.add.text(400, 350,
            '💥 Ma fusée vient de percuter une météorite !\nJ\'ai perdu toutes les pièces...\nAide-moi à les retrouver !', {
            fontSize: '28px',
            fill: '#ffffff',
            align: 'center'
        });
        this.texteFinal.setOrigin(0.5);
        this.texteFinal.setVisible(false);

        // Touche espace
        this.touche_espace = this.input.keyboard.addKey('SPACE');

        // Dialogues (index 0 à 3)
        this.dialogues = [
            "Bonjour ! Je m'appelle Winston, physicien et astronaute !",
            "Après des années de voyage spatial, j'ai hâte de rentrer sur Terre...",
            "Ma fusée est prête pour le grand décollage !",
            "Tout est prêt. Systèmes en ligne. Décollage imminent...",
        ];

        this.indexDialogue = 0;
        this.etape = 'dialogue';

        // Affiche le premier dialogue
        this.afficherDialogue(0);
    }

    // Effet machine à écrire
    ecrireLetterByLetter(texteObj, message, vitesse = 40, onComplete = null) {
        if (!message) return;
        texteObj.setText('');
        let i = 0;
        this.input.keyboard.enabled = false;
        this.texteEspace.setVisible(false);

        if (this.timerEcriture) {
            this.timerEcriture.remove();
        }

        this.timerEcriture = this.time.addEvent({
            delay: vitesse,
            repeat: message.length - 1,
            callback: () => {
                texteObj.setText(texteObj.text + message[i]);
                i++;
                if (i >= message.length) {
                    this.input.keyboard.enabled = true;
                    this.texteEspace.setVisible(true);
                    if (onComplete) onComplete();
                }
            }
        });
    }

    afficherDialogue(index) {
        this.bulle.setVisible(true);
        this.texteBulle.setVisible(true);
        this.ecrireLetterByLetter(this.texteBulle, this.dialogues[index], 40);
    }

    lancerMarche() {
        this.bulle.setVisible(false);
        this.texteBulle.setVisible(false);
        this.texteEspace.setVisible(false);
        this.etape = 'marche';

        this.perso.anims.play('anim_droite', true);
        this.perso.body.velocity.x = 120;
    }

    lancerDecollage() {
        this.etape = 'decollage';
        this.flammes.setVisible(true);

        this.tweens.add({
            targets: [this.fusee, this.flammes, this.perso],
            y: '-=700',
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {
                this.cameras.main.flash(800, 255, 50, 0);
                this.sound.play("alarme");
                this.etape = 'fin';

                this.time.delayedCall(1500, () => {
                    this.texteEspace.setVisible(false);
                    this.texteFinal.setVisible(true);
                    this.ecrireLetterByLetter(
                        this.texteFinal,
                        '💥 Ma fusée vient de percuter une météorite !\nJ\'ai perdu toutes les pièces...\nAide-moi à les retrouver !',
                        40
                    );

                    this.time.delayedCall(4000, () => {
                        this.cameras.main.fadeOut(1000);
                        this.time.delayedCall(1000, () => {
                            this.scene.start('pageprincipale');
                        });
                    });
                });
            }
        });
    }

    update() {
        // Personnage marche → vérifie s'il est arrivé à la fusée
        if (this.etape === 'marche') {
            if (this.perso.x >= 520) {
                this.perso.body.velocity.x = 0;
                this.perso.anims.play('immobiledroit');
                this.etape = 'dialogue2';
                this.afficherDialogue(3);
            }
        }

        // Espace → avance dans les dialogues
        if (Phaser.Input.Keyboard.JustDown(this.touche_espace)) {
            if (this.etape === 'dialogue') {
                this.indexDialogue++;
                if (this.indexDialogue <= 2) {
                    this.afficherDialogue(this.indexDialogue);
                } else {
                    // Après dialogue 2 → marche vers la fusée
                    this.lancerMarche();
                }
            } else if (this.etape === 'dialogue2') {
                // Après dialogue 3 → décollage
                this.bulle.setVisible(false);
                this.texteBulle.setVisible(false);
                this.texteEspace.setVisible(false);
                this.lancerDecollage();
            }
        }
    }
}