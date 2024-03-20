import { ParticleEvent } from './events/ParticleEvent';
import { GTween } from '../../../../gskinner/motion/GTween';
import { Sprite } from '../../../../../flash/display/Sprite';
export class Particle extends Sprite {
    protected _gtween: GTween;
    protected _scale = 1;
    constructor (lifespan = 2)
    {
        super();
        this._gtween = new GTween(this, lifespan);
        this._gtween.onComplete = this.die;
    }

    reset (): void
    {
        this._gtween.end();
        this._gtween.position = -this._gtween.delay;
    }

    init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        this.x = xPos;
        this.y = yPos;
        this._gtween.proxy.x = xPos + vectorX;
        this._gtween.proxy.y = yPos + vectorY;
    }

    die (gt: GTween = null): void
    {
        dispatchEvent(new ParticleEvent(ParticleEvent.DIE));
    }

    get scale (): number
    {
        return this._scale;
    }

    set scale (value: number)
    {
        this._scale = value;
        if (this._scale < .5)
        {
            this.scaleX = this._scale * 2;
            this.scaleY = this._scale * 2;
        }
        else
        {
            this.scaleX = 2 - this._scale * 2;
            this.scaleY = 2 - this._scale * 2;
        }
    }
}
