import { Timestep } from '../com/grapefrukt/Timestep';
import { SettingsToggler } from '../com/grapefrukt/games/juicy/SettingsToggler';
import { Block } from '../com/grapefrukt/games/juicy/gameobjects/Block';
import { Settings } from '../com/grapefrukt/games/juicy/Settings';
import { Ball } from '../com/grapefrukt/games/juicy/gameobjects/Ball';
import { Paddle } from '../com/grapefrukt/games/juicy/gameobjects/Paddle';

/**
 * Game Phaser scene.
 *
 * This is where all the logic for your game goes.
 */
export default class Game extends Phaser.Scene {

    private _timestep: Timestep;

    private paddle: Paddle;

    constructor () { super('game'); }

    create (): void
    {
        console.info('Game enter');

        const scale = this.scale;
        const x = scale.width / 2;
        const y = scale.height / 2;

        this.add.existing(new Ball(this, x, y + 100));

        this.paddle = this.add.existing(new Paddle(this));

        for (let i = 0; i < 80; i++)
        {
            this.add.existing(new Block(this,
                120 + i % 10 * (Settings.BLOCK_W + 10),
                30 + 47.5 + Math.trunc(i / 10) * (Settings.BLOCK_H + 10)
            ));
        }

        this._timestep = new Timestep();

        this.input.keyboard.on('keydown', (e: KeyboardEvent) =>
        {
            switch (e.code)
            {
                case 'KeyW':

                    this.time.timeScale =
                        this._timestep.gameSpeed += 0.1;

                    break;

                case 'KeyS':

                    this.time.timeScale =
                        this._timestep.gameSpeed -= 0.1;

                    break;

                default:
                    console.log(e.code);
            }
        });

        new SettingsToggler(this);
    }

    update (time: number, delta: number)
    {
        this._timestep.tick();

        const deltaFactor = delta / 1000 * 60 * this.time.timeScale;

        this.paddle.update(deltaFactor);

        // console.log(this._timestep.timeDelta.toFixed(2), deltaFactor.toFixed(2));
    }
}
