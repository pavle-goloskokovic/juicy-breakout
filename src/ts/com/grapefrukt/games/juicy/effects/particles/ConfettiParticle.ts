import { ColorConverter } from '../../../../display/utilities/ColorConverter';
import { Particle } from '../../../general/particles/Particle';
import { ColorMatrix } from '../../../../../gskinner/geom/ColorMatrix';
import { Back } from '../../../../../gskinner/motion/easing/Back';
import { Bounce } from '../../../../../gskinner/motion/easing/Bounce';
import { Exponential } from '../../../../../gskinner/motion/easing/Exponential';
import { GTween } from '../../../../../gskinner/motion/GTween';
import { ColorMatrixFilter } from '../../../../../../flash/filters/ColorMatrixFilter';
import { ColorTransform } from '../../../../../../flash/geom/ColorTransform';
export class ConfettiParticle extends Particle {
    private _gfx: ConfettiParticleGfx;
    private _vectorX = 0;
    private _vectorY = 0;
    private _age = 0;
    constructor (lifespan = 2)
    {
        super(lifespan);
        this._gfx = new ConfettiParticleGfx();
        this.addChild(this._gfx);
        this._gfx.rotation = Math.random() * 360;
        this._gtween.onChange = this.update;
        const colors: any[] = ColorConverter.HSBtoRGB(Math.random(), 1, 1);
        this._gfx.transform.colorTransform = new ColorTransform(colors[0] / 255, colors[1] / 255, colors[2] / 255);
    }

    init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        this._vectorY = vectorY;
        this._vectorX = vectorX;
        this.x = xPos;
        this.y = yPos;
        this.rotation = 0;
        this.scale = .8;
        this.alpha = 1;
        this._gtween.delay = Math.random() * .3;
        this._gtween.proxy.scaleX = (this._gtween.proxy.scaleY = .01);
        this._gtween.proxy.rotation = Math.random() * 360;
        this._age = Math.random() * this._gfx.totalFrames;
    }

    private update (gt: GTween): void
    {
        const timeDelta: number = GTween.timeScaleAll;
        this._age += timeDelta;
        this._gfx.gotoAndPlay(1 + (int(this._age) % this._gfx.totalFrames - 1));
        this.x += this._vectorX / 100 * timeDelta;
        this.y += this._vectorY / 100 * timeDelta;
        this._vectorY += 10 * timeDelta;
        this._vectorX -= this._vectorX * .05 * timeDelta;
        this._vectorY -= this._vectorY * .05 * timeDelta;
    }
}
