export default class acceuil extends Phaser.Scene {
    constructor() {
        super({ key: "acceuil" });
    }

    preload() {
        this.load.image("acceuil_bouton", "src/assets/bouton_play.png"); // remplace par un vrai bouton
        this.load.image("background", "src/assets/acceuil.png"); // remplace par un vrai fond
        this.load.audio('ArriveSurTerre', 'src/assets/sons/accueil.ogg');
    }

    create() {
        // état global du son
        if (this.game.soundOn === undefined) {
            this.game.soundOn = true;
        }

        // appliquer l'état du son
        this.sound.mute = !this.game.soundOn;

        // Fond du menu
        this.add.image(512, 384, "background");

        // ── ÉTOILES EN ARRIÈRE PLAN ───────────────────────────────
        for (let i = 0; i < 400; i++) {
            this.add.circle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
        }

        // Bouton sound on/off en haut à droite
        this.boutonSon = this.add.text(880, 20, this.game.soundOn ? "Sound ON" : "Sound OFF", {
            fontSize: "24px",
            fill: "#ffffff",
            backgroundColor: "#000000"
        }).setInteractive();

        this.boutonSon.on("pointerdown", () => {
            this.game.soundOn = !this.game.soundOn;
            this.sound.mute = !this.game.soundOn;
            this.boutonSon.setText(this.game.soundOn ? "Sound ON" : "Sound OFF");
        });

        // Bouton play
        var bouton_play = this.add.image(512, 550, "acceuil_bouton");
        bouton_play.setScale(0.6); // ajuste la taille du bouton
        bouton_play.setInteractive(); // rend le bouton cliquablE

        // Survol souris → agrandit le bouton
        bouton_play.on("pointerover", () => {
            bouton_play.setScale(0.9);
        });

        // Souris quitte → taille normale
        bouton_play.on("pointerout", () => {
            bouton_play.setScale(0.6);
        });

        // Clic → lance la scène Selection
        bouton_play.on("pointerup", () => {
            this.scene.start("intro");
        }); if (!this.game.musiqueMenu) {
            this.game.musiqueMenu = this.sound.add('ArriveSurTerre', {
                loop: true,
                volume: 0.5
            });

            this.game.musiqueMenu.play();
        }
    }
}