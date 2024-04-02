import { ParticleEvent } from '../../events/ParticleEvent';

export class Particle extends Phaser.GameObjects.Container {

    protected tween: Phaser.Tweens.Tween;
    protected _particleScale = 1;

    constructor (
        scene: Phaser.Scene,
        protected lifespan = 2
    )
    {
        super(scene);
    }

    reset (): void
    {
        this.tween?.remove().destroy();

        this.die();
    }

    init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        this.x = xPos;
        this.y = yPos;

        this.tween = this.scene.tweens.add({
            targets: this,
            duration: this.lifespan * 1000,
            onComplete: () => { this.die(); },
            props: {
                x: xPos + vectorX,
                y: yPos + vectorY
            }
        });
    }

    die (): void
    {
        this.tween = null;

        this.parentContainer?.emit(ParticleEvent.DIE, this);
    }

    get particleScale (): number
    {
        return this._particleScale;
    }

    set particleScale (value: number)
    {
        this._particleScale = value;

        if (value < .5)
        {
            this.setScale(value * 2);
        }
        else
        {
            this.setScale(2 - value * 2);
        }
    }
}
