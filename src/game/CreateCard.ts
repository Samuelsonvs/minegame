import { Math as PhaserMath } from "phaser";
export const createCard = ({
    scene,
    x,
    y,
    cardName,
}: {
    scene: any;
    x: any;
    y: any;
    cardName: any;
}) => {
    let isFlipping = false;
    const rotation = { y: 0 };

    const backTexture = "cardback";

    const card = scene.add
        .plane(x, y, backTexture)
        .setName(cardName)
        .setScale(0.8)
        .setInteractive();

    // start with the card face down

    card.modelRotationY = 180;

    const flipCard = (callbackComplete: any, front: 'text') => {
        if (isFlipping) {
            return;
        }
        scene.add.tween({
            targets: [rotation],
            y: rotation.y === 180 ? 0 : 180,
            ease: PhaserMath.Easing.Expo.Out,
            duration: 300,
            onStart: () => {
                isFlipping = true;
                //scene.sound.play("card-flip");
                scene.tweens.chain({
                    targets: card,
                    ease: PhaserMath.Easing.Expo.InOut,
                    tweens: [
                        {
                            duration: 200,
                            scale: 1.1,
                        },
                        {
                            duration: 300,
                            scale: 0.8,
                        },
                    ],
                });
            },
            onUpdate: () => {
                // card.modelRotation.y = Phaser.Math.DegToRad(180) + Phaser.Math.DegToRad(rotation.y);
                card.rotateY = 180 + rotation.y;
                const cardRotation = Math.floor(card.rotateY) % 360;
                if (
                    (cardRotation >= 0 && cardRotation <= 90) ||
                    (cardRotation >= 270 && cardRotation <= 359)
                ) {
                    card.setTexture(front);
                } else {
                    card.setTexture(backTexture);
                }
            },
            onComplete: () => {
                isFlipping = false;
                if (callbackComplete) {
                    callbackComplete();
                }
            },
        });
    };

    const destroy = () => {
        scene.add.tween({
            targets: [card],
            y: card.y - 1000,
            easing: PhaserMath.Easing.Elastic.In,
            duration: 300,
            onComplete: () => {
                card.destroy();
            },
        });
    };

    return {
        gameObject: card,
        flip: flipCard,
        destroy,
        cardName,
    };
};
