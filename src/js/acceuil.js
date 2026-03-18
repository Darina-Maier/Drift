export default class acceuil extends Phaser.Scene {
    constructor() {
        super({ key: "acceuil" });
    }

    preload() {
        this.load.image("acceuil_bouton", "src/assets/bouton_play.png"); // remplace par un vrai bouton
        this.load.image("background", "src/assets/acceuil.png"); // remplace par un vrai fond
    }

    create() {
        // Fond du menu
        this.add.image(512, 384, "background");
    

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
        });
    }
}