import { GameObjects, Scene } from "phaser";

export class Preloader extends Scene {
    loadText: GameObjects.Text;
    progressBar: GameObjects.Rectangle;
    progressBarContainer: GameObjects.Rectangle;

    constructor() {
        super("Preloader");
    }

    init() {
        const width = this.scale.gameSize.width / 2;
        const height = this.scale.gameSize.height / 2;

        // Loading text
        this.loadText = this.add.text(width, height - 70, "Loading ...", {
            fontFamily: "Arial",
            fontSize: 74,
            color: "#e3f2ed",
        });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke("#203c5b", 6);
        this.loadText.setShadow(2, 2, "#2d2d2d", 4, true, false);

        // Progress bar container (outline)
        this.progressBarContainer = this.add.rectangle(width, height, 350, 32);
        this.progressBarContainer.setStrokeStyle(2, 0xffffff);

        // Progress bar (filled portion)
        this.progressBar = this.add.rectangle(
            width - 175,
            height,
            4,
            28,
            0xffffff
        );
        this.progressBar.setOrigin(0, 0.5);

        // Update progress bar based on loader progress
        this.load.on("progress", (progress: any) => {
            this.progressBar.width = 350 * progress;
        });

        // Hide loading elements when loading completes
        this.load.on("complete", () => {
            this.progressBarContainer.setVisible(false);
            this.progressBar.setVisible(false);
            this.loadText.setText("Loading Complete!");
            setTimeout(() => {
                this.loadText.setVisible(false);
            }, 1000);
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");
        this.load.image("cardback", "/cardback/cardback.png");
        this.load.image("bomb", "/bomb/bomb.png");
        this.load.image("diamond", "/crystal/diamond.png");
        this.load.image("diamond-alone", "/crystal/diamond-alone.png");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("Game");
    }
}

