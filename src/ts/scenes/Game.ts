import { Timestep } from '../com/grapefrukt/Timestep';

/**
 * Game Phaser scene.
 *
 * This is where all the logic for your game goes.
 */
export default class Game extends Phaser.Scene {

    private _timestep: Timestep;

    constructor () { super('game'); }

    create (): void
    {
        console.info('Game enter');

        const scale = this.scale;
        const x = scale.width / 2;
        const y = scale.height / 2;

        this.add.image(x, y, 'bg');
        this.add.image(x, y, 'logo');

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
    }

    update (time: number, delta: number)
    {
        this._timestep.tick();

        const deltaFactor = delta / 1000 * 60 * this.time.timeScale;

        console.log(this._timestep.timeDelta.toFixed(2), deltaFactor.toFixed(2));
    }
}
