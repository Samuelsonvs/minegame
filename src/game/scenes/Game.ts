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
   

    cardNames:Record<string, { front: string; isOpen: boolean }> = {
        "card-0": { front: "diamond", isOpen: false },
        "card-1": { front: "diamond", isOpen: false },
        "card-2": { front: "diamond", isOpen: false },
        "card-3": { front: "diamond", isOpen: false },
        "card-4": { front: "diamond", isOpen: false },
        "card-5": { front: "diamond", isOpen: false },
        "card-6": { front: "diamond", isOpen: false },
        "card-7": { front: "diamond", isOpen: false },
        "card-8": { front: "diamond", isOpen: false },
        "card-9": { front: "diamond", isOpen: false },
        "card-10": { front: "diamond", isOpen: false },
        "card-11": { front: "diamond", isOpen: false },
        "card-12": { front: "diamond", isOpen: false },
        "card-13": { front: "diamond", isOpen: false },
        "card-14": { front: "diamond", isOpen: false },
        "card-15": { front: "diamond", isOpen: false },
        "card-16": { front: "diamond", isOpen: false },
        "card-17": { front: "diamond", isOpen: false },
        "card-18": { front: "diamond", isOpen: false },
        "card-19": { front: "diamond", isOpen: false },
        "card-20": { front: "diamond", isOpen: false },
        "card-21": { front: "diamond", isOpen: false },
        "card-22": { front: "diamond", isOpen: false },
        "card-23": { front: "diamond", isOpen: false },
        "card-24": { front: "diamond", isOpen: false },
    };
    cardOpened = undefined;
    cards: [] | any = [];
    canMove = false;
    constructor() {
        super("Game");
    }

    create() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        this.gridConfiguration = {
            x: (this.GAME_WIDTH - (4 * 98 + 3 * 10)) / 2, // Dynamically centered
            y: 150,
            paddingX: 10,
            paddingY: 15,
        };

        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

        this.background.setDisplaySize(this.GAME_WIDTH, this.GAME_HEIGHT);

        this.make.image({
            x: 50,
            y: 50,
            key: "diamond-alone",
            add: true,
            scale: { x: 0.4, y: 0.4 },
        });

        this.userScoreText = this.add.text(70, 42, `${this.score}`, {
            fontFamily: "Arial",
            fontSize: 14,
            color: "#e3f2ed",
        });

        this.generateCards();

        this.parent = new Structs.Size(width, height);
        this.sizer = new Structs.Size(
            this.GAME_WIDTH,
            this.GAME_HEIGHT,
            Structs.Size.FIT,
            this.parent
        );

        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);

        this.updateCamera();

        // Resize handler
        this.scale.on("resize", this.resize, this);

        EventBus.emit("current-scene-ready", this);
    }
    updateCamera() {
        const camera = this.cameras.main;
        const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5);
        const y = 0;
        const scaleX = this.sizer.width / this.GAME_WIDTH;
        const scaleY = this.sizer.height / this.GAME_HEIGHT;
        camera.setViewport(x, y, this.sizer.width, this.sizer.height);
        camera.setZoom(Math.max(scaleX, scaleY));
        camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
    }

    resize(gameSize: any) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);

        this.updateCamera();
    }

    shuffleArray(array:string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    setRandomCardsToFront(count: number) {
        const keys = Object.keys(this.cardNames);
        this.shuffleArray(keys);

        for (let i = 0; i < count; i++) {
            this.cardNames[keys[i]].front = "bomb";
        }
    }

    createGridCards() {
        // Phaser random array position
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
                //onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y:
                    this.gridConfiguration.y +
                    (128 + this.gridConfiguration.paddingY) *
                        Math.floor(index / 5),
            });
            return newCard;
        });
    }

    generateCards() {
        this.cards = this.createGridCards();

        // Start canMove
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
        this.input.on(Input.Events.POINTER_MOVE, (pointer: any) => {
            if (this.canMove) {
                const card = this.cards.find((card: any) =>
                    card.gameObject.hasFaceAt(pointer.x, pointer.y)
                );
                if (card) {
                    this.input.setDefaultCursor("pointer");
                } else {
                    this.input.setDefaultCursor("default");
                }
            }
        });

        this.input.on(Input.Events.POINTER_DOWN, (pointer: any) => {
            if (this.canMove && this.cards.length) {
                const card = this.cards.find((card: any) =>
                    card.gameObject.hasFaceAt(pointer.x, pointer.y)
                );
                if (card) {
                    this.canMove = false;
                    if (!this.cardNames[card.cardName].isOpen) {
                        this.cardNames[card.cardName].isOpen = true;
                        card.flip(() => {
                            if (
                                this.cardNames[card.cardName].front ===
                                "diamond"
                            ) {
                                const diamond = this.make.image({
                                    x: card.gameObject.x,
                                    y: card.gameObject.y,
                                    key: "diamond-alone",
                                    add: true,
                                });
                                this.add.tween({
                                    targets: diamond,
                                    duration: 300,
                                    delay: 100,
                                    x: 50,
                                    y: 50,
                                    onComplete: () => {
                                        this.score *= 2;
                                        this.userScoreText.setText(`${this.score}`);
                                        diamond.destroy();
                                    },
                                });

                                this.canMove = true;
                            } else {
                                this.cameras.main.shake(600, 0.01);
                                this.input.setDefaultCursor("default");
                                this.canMove = false;
                                this.cards.forEach((card:any) => {
                                    if (!this.cardNames[card.cardName].isOpen) {
                                        card.flip(() => {
                                            this.resetGame(setter);
                                        }, this.cardNames[card.cardName].front);
                                    }
                                });
                            }
                        }, this.cardNames[card.cardName].front);
                    } else if (
                        this.cardOpened === undefined &&
                        this.cards.length > 0
                    ) {
                        card.flip(() => {
                            this.canMove = true;
                        }, "cardback");
                    }
                }
            }
        });
    }

    openRandomCard(setter:Dispatch<SetStateAction<boolean>>) {
        if (!this.canMove) return; // Prevents interaction if not allowed

        // Get all unopened cards
        const unopenedCards = this.cards.filter(
            (card:any) => !this.cardNames[card.cardName].isOpen
        );

        // If there are no more unopened cards, do nothing
        if (unopenedCards.length === 0) return;

        // Pick a random unopened card
        const randomCard =
            unopenedCards[Math.floor(Math.random() * unopenedCards.length)];

        // Mark it as opened
        this.cardNames[randomCard.cardName].isOpen = true;

        // Flip the card
        randomCard.flip(() => {
            if (this.cardNames[randomCard.cardName].front === "diamond") {
                const diamond = this.make.image({
                    x: randomCard.gameObject.x,
                    y: randomCard.gameObject.y,
                    key: "diamond-alone",
                    add: true,
                });

                this.add.tween({
                    targets: diamond,
                    duration: 300,
                    delay: 100,
                    x: 50,
                    y: 50,
                    onComplete: () => {
                        this.score *= 2;
                        this.userScoreText.setText(`${this.score}`);
                        diamond.destroy();
                    },
                });

                this.canMove = true;
            } else {
                this.cameras.main.shake(600, 0.01);
                this.input.setDefaultCursor("default");
                this.canMove = false;
                this.cards.forEach((card:any) => {
                    if (!this.cardNames[card.cardName].isOpen) {
                        card.flip(() => {
                            this.resetGame(setter);
                        }, this.cardNames[card.cardName].front);
                    }
                });
            }
        }, this.cardNames[randomCard.cardName].front);
    }

    resetGame(statusSetter:Dispatch<SetStateAction<boolean>>) {
        this.time.delayedCall(1000, () => {
            Object.keys(this.cardNames).forEach((key) => {
                this.cardNames[key].isOpen = false;
                this.cardNames[key].front = "diamond";
            });
            this.cards.forEach((card:any) => {
                card.flip(() => {}, "cardback");
            });
            this.score = 1;
            this.cardOpened = undefined;
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
        // Create a dark overlay
        this.canMove = false;
        this.cards.forEach((card: any) => {
            if (!this.cardNames[card.cardName].isOpen) {
                card.flip(() => {}, this.cardNames[card.cardName].front);
            }
        });
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        // Center position
        const centerX = this.GAME_WIDTH / 2;
        const centerY = this.GAME_HEIGHT / 2;

        // Create a diamond image
        const diamond = this.add.image(centerX - 80, centerY, "diamond-alone");
        diamond.setScale(0.8);

        // Create text for multiplication calculation
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

        // Delay before restarting the game
        this.time.delayedCall(2000, () => {
            this.resetGame(statusSetter);
        });
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

