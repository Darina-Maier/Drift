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
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

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
        this.texteEspace = this.add.text(350, 650,
            'Appuie sur ESPACE pour continuer...', {
            fontSize: '14px',
            fill: '#aaaaaa',
            align: 'center'
        });
        this.texteEspace.setOrigin(0.5);

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

        // Dialogues
        this.dialogues = [
            "Bonjour ! Je m'appelle Winston, chercheur en physique quantique spatiale.",
            "Après des années de recherches, ma fusée est enfin prête pour le grand décollage !",
            "Je m'apprête à prendre l'envol... direction les confins de l'univers !",
            "Tout est nominal. Systèmes en ligne. Décollage imminent...",]

        this.indexDialogue = 0;
        this.etape = 'dialogue'; // dialogue → marche → decollage → fin

        // Affiche le premier dialogue
        this.afficherDialogue(0);
    }

    afficherDialogue(index) {
        this.bulle.setVisible(true);
        this.texteBulle.setVisible(true);
        this.texteBulle.setText(this.dialogues[index]);
    }

    lancerMarche() {
        // Cache la bulle
        this.bulle.setVisible(false);
        this.texteBulle.setVisible(false);
        this.texteEspace.setVisible(false);
        this.etape = 'marche';

        // Personnage marche
        this.perso.anims.play('anim_droite', true);
        this.perso.body.velocity.x = 120;
    }

    lancerDecollage() {
        this.etape = 'decollage';
        this.flammes.setVisible(true);

        // Fusée décolle
        this.tweens.add({
            targets: [this.fusee, this.flammes, this.perso],
            y: '-=700',
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Flash rouge = explosion
                this.cameras.main.flash(800, 255, 50, 0);
                this.etape = 'fin';

                this.time.delayedCall(1500, () => {
                    this.texteEspace.setVisible(false);
                    this.texteFinal.setVisible(true);

                    this.time.delayedCall(3000, () => {
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
        // Personnage marche → vérifie s'il est arrivé
        if (this.etape === 'marche') {
            if (this.perso.x >= 520) {
                this.perso.body.velocity.x = 0;
                this.perso.anims.play('immobiledroit');
                this.etape = 'dialogue2';
                this.indexDialogue = 3;
                this.afficherDialogue(3);
                this.texteEspace.setVisible(true);
            }
        }

        // Espace → avance
        if (Phaser.Input.Keyboard.JustDown(this.touche_espace)) {
            if (this.etape === 'dialogue') {
                this.indexDialogue++;
                if (this.indexDialogue <= 2) {
                    // Dialogue 0, 1, 2 → affiche le suivant
                    this.afficherDialogue(this.indexDialogue);
                } else {
                    // Après dialogue 2 → marche
                    this.lancerMarche();
                }
            } else if (this.etape === 'dialogue2') {
                this.indexDialogue++;
                if (this.indexDialogue <= 4) {
                    this.afficherDialogue(this.indexDialogue);
                } else {
                    // Après dernier dialogue → décollage
                    this.bulle.setVisible(false);
                    this.texteBulle.setVisible(false);
                    this.lancerDecollage();
                }
            }
        }
    }
}