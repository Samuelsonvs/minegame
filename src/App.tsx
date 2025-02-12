import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import CustomButton from "./ui/button/Button";
import RandomButton from "./ui/button/RandomButton";
import NumberInput from "./ui/input/Input";
import SelectBox from "./ui/select/SelectBox";

function App() {
    const [canMoveSprite, setCanMoveSprite] = useState<boolean>(true);
    const [value, setValue] = useState<number>(1);
    const [selected, setSelected] = useState<number>(3);
    const [gameStatus, setGameStatus] = useState<boolean>(false);

    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const startGame = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game;

            if (scene) {
                setGameStatus(true);
                scene.startGame(selected, value, setGameStatus);
            }
        }
    };
    const cashOut = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game;

            if (scene) {
                scene.cashOut(setGameStatus);
            }
        }
    };

    const openRandomCard = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game;

            if (scene) {
                scene.openRandomCard(setGameStatus);
            }
        }
    };

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, "star");

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1,
                });
            }
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-[100dvh]">
            {/* Button Panel - Fixed size */}
            <div className="absolute lg:relative bottom-0 flex justify-center lg:justify-normal items-center flex-col p-4 w-full lg:w-1/4 bg-black order-1">
                {gameStatus ? (
                    <div className="max-w-md px-4 mt-4 w-full">
                        <RandomButton
                            text={"Pick a Random Pile"}
                            onClick={openRandomCard}
                        />
                    </div>
                ) : (
                    <>
                        <div className="max-w-md w-full">
                            <NumberInput value={value} setValue={setValue} />
                        </div>
                        <div className="max-w-md w-full">
                            <SelectBox
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </>
                )}
                <div className="max-w-md px-4 mt-4 w-full">
                    <CustomButton
                        status={gameStatus}
                        startGameText={"Bet"}
                        cashOutText={"Cash Out"}
                        startGame={startGame}
                        cashOut={cashOut}
                    />
                </div>
            </div>

            {/* Phaser Game - Takes remaining space */}
            <div className="flex-1 h-full order-2">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>
        </div>
    );
}

export default App;

