import { Cameras, GameObjects, Input, Scene, Structs, Utils } from "phaser";
import { Dispatch, SetStateAction } from "react";
import { createCard } from "../CreateCard";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    gameText: GameObjects.Text;
    parent: Structs.Size;
    sizer: Structs.Size;
    logo: GameObjects.Image;
    userScoreText: GameObjects.Text;

    GAME_WIDTH = 640;
    GAME_HEIGHT = 960;
    gridConfiguration = {
        x: 113,
        y: 150,
        paddingX: 10,
        paddingY: 15,
    };
    score = 1;
    bet = 0;
    cardNames:Record<string, { front: string; isOpen: boolean }> = {};
    cards: any[] = [];
    canMove = false;
    constructor() {
        super("Game");
    }

    create() {
        this.initializeGame();
        this.createUI();
        this.generateCards();
        EventBus.emit("current-scene-ready", this);
    }


    private initializeGame() {
        this.cardNames = Array.from({ length: 25 }, (_, i) => `card-${i}`)
            .reduce((acc, key) => ({ ...acc, [key]: { front: "diamond", isOpen: false } }), {});

        this.gridConfiguration = {
            x: (this.GAME_WIDTH - (4 * 98 + 3 * 10)) / 2,
            y: 150,
            paddingX: 10,
            paddingY: 15,
        };

        this.parent = new Structs.Size(this.scale.gameSize.width, this.scale.gameSize.height);
        this.sizer = new Structs.Size(this.GAME_WIDTH, this.GAME_HEIGHT, Structs.Size.FIT, this.parent);

        this.updateCamera();
        this.scale.on("resize", this.resize, this);
    }


    private createUI() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.background.setDisplaySize(this.GAME_WIDTH, this.GAME_HEIGHT);

        this.add.image(50, 50, "diamond-alone").setScale(0.4);

        this.userScoreText = this.add.text(70, 42, this.score.toString(), {
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#e3f2ed",
        });
    }

    private updateCamera() {
        const camera = this.cameras.main;
        camera.setViewport(
            Math.ceil((this.parent.width - this.sizer.width) * 0.5),
            0,
            this.sizer.width,
            this.sizer.height
        );
        camera.setZoom(Math.max(this.sizer.width / this.GAME_WIDTH, this.sizer.height / this.GAME_HEIGHT));
        camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
    }

    private resize(gameSize: any) {
        this.parent.setSize(gameSize.width, gameSize.height);
        this.sizer.setSize(gameSize.width, gameSize.height);
        this.updateCamera();
    }



    private shuffleArray(array:string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private setRandomCardsToFront(count: number) {
        const keys = Object.keys(this.cardNames);
        this.shuffleArray(keys);

        for (let i = 0; i < count; i++) {
            this.cardNames[keys[i]].front = "bomb";
        }
    }

    private createGridCards() {
        const gridCardNames = Utils.Array.Shuffle(Object.keys(this.cardNames));

        return gridCardNames.map((name, index) => {
            const newCard = createCard({
                scene: this,
                x:
                    this.gridConfiguration.x +
                    (98 + this.gridConfiguration.paddingX) * (index % 5),
                y: -1000,
                cardName: name,
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                y:
                    this.gridConfiguration.y +
                    (128 + this.gridConfiguration.paddingY) *
                        Math.floor(index / 5),
            });
            return newCard;
        });
    }

    private generateCards() {
        this.cards = this.createGridCards();
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
            },
        });
    }

    startGame(bombNum: number, bet: number, setter:Dispatch<SetStateAction<boolean>>) {
        this.setRandomCardsToFront(bombNum);
        this.bet = bet;
        this.input.on(Input.Events.POINTER_MOVE, (pointer:any) => {
            this.input.setDefaultCursor(this.cards.some(card => card.gameObject.hasFaceAt(pointer.x, pointer.y)) ? "pointer" : "default");
        });

        this.input.on(Input.Events.POINTER_DOWN, (pointer:any) => {
            if (!this.canMove) return;
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
            if (card) this.handleCardSelection(card, setter);
        });
    }

    private handleCardSelection(card: any, setter:Dispatch<SetStateAction<boolean>>) {
        if (this.cardNames[card.cardName].isOpen) return;
        this.canMove = false;
        this.cardNames[card.cardName].isOpen = true;
        card.flip(() => {
            if (this.cardNames[card.cardName].front === "diamond") {
                this.handleDiamondCard(card);
            } else {
                this.handleBombCard(setter);
            }
        }, this.cardNames[card.cardName].front);
    }

    private handleDiamondCard(card: any) {
        const diamond = this.make.image({ x: card.gameObject.x, y: card.gameObject.y, key: "diamond-alone", add: true });
        this.add.tween({
            targets: diamond,
            duration: 300,
            delay: 100,
            x: 50,
            y: 50,
            onComplete: () => {
                this.score *= 2;
                this.userScoreText.setText(this.score.toString());
                diamond.destroy();
                this.canMove = true;
            },
        });
    }


    private handleBombCard(setter:Dispatch<SetStateAction<boolean>>) {
        this.cameras.main.shake(600, 0.01);
        this.canMove = false;
        this.cards.forEach(card => {
            if (!this.cardNames[card.cardName].isOpen) {
                card.flip(() => { this.resetGame(setter); }, this.cardNames[card.cardName].front);
            }
        });
    }

    openRandomCard(setter:Dispatch<SetStateAction<boolean>>) {
        if (!this.canMove) return;
        const unopenedCards = this.cards.filter(card => !this.cardNames[card.cardName].isOpen);
        if (unopenedCards.length === 0) return;
        this.handleCardSelection(unopenedCards[Math.floor(Math.random() * unopenedCards.length)], setter);
    }

    private resetGame(statusSetter:Dispatch<SetStateAction<boolean>>) {
        this.time.delayedCall(1000, () => {
            Object.keys(this.cardNames).forEach((key) => {
                this.cardNames[key].isOpen = false;
                this.cardNames[key].front = "diamond";
            });
            this.cards.forEach((card:any) => {
                card.flip(() => {}, "cardback");
            });
            this.score = 1;
            this.canMove = false;
            this.userScoreText.setText(`${this.score}`);
        });

        this.time.delayedCall(1500, () => {
            statusSetter(false);
            this.scene.restart();
        });
    }

    cashOut(statusSetter:Dispatch<SetStateAction<boolean>>) {
        if (!this.canMove) return;
        this.canMove = false;
        this.cards.forEach((card: any) => {
            if (!this.cardNames[card.cardName].isOpen) {
                card.flip(() => {}, this.cardNames[card.cardName].front);
            }
        });
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        const centerX = this.GAME_WIDTH / 2;
        const centerY = this.GAME_HEIGHT / 2;

        const diamond = this.add.image(centerX - 80, centerY, "diamond-alone");
        diamond.setScale(0.8);

        this.add.text(
            centerX - 40,
            centerY - 10,
            `${this.score} x ${this.bet} = ${this.score * this.bet}`,
            {
                fontFamily: "Arial",
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "bold",
            }
        );

        this.time.delayedCall(2000, () => {
            this.resetGame(statusSetter);
        });
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

