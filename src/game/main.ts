import { AUTO, Game, Scale } from 'phaser';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: '#000',
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 640,
        height: 960,
        min: {
          width: 320,
          height: 480,
        },
        max: {
          width: 750,
          height: 900,
        },
      },
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
