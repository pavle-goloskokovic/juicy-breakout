import {ColorConverter} from "../../../../display/utilities/ColorConverter";
import {Particle} from "../../../general/particles/Particle";
import {ColorMatrix} from "../../../../../gskinner/geom/ColorMatrix";
import {Back} from "../../../../../gskinner/motion/easing/Back";
import {Bounce} from "../../../../../gskinner/motion/easing/Bounce";
import {Exponential} from "../../../../../gskinner/motion/easing/Exponential";
import {GTween} from "../../../../../gskinner/motion/GTween";
import {ColorMatrixFilter} from "../../../../../../flash/filters/ColorMatrixFilter";
import {ColorTransform} from "../../../../../../flash/geom/ColorTransform";
export class ConfettiParticle extends Particle {
    private _gfx: ConfettiParticleGfx;
    private _vectorX: number;
    private _vectorY: number;
    private _age: number;
    public constructor(lifespan: number = 2) {
        super(lifespan);
        this._gfx = new ConfettiParticleGfx();
        addChild(this._gfx);
        this._gfx.rotation = Math.random() * 360;
        this._gtween.onChange = this.update;
        let colors: any[] = ColorConverter.HSBtoRGB(Math.random(), 1, 1);
        this._gfx.transform.colorTransform = new ColorTransform(colors[0] / 255, colors[1] / 255, colors[2] / 255);
    }
    public init(xPos: number, yPos: number, vectorX: number = 0, vectorY: number = 0): void {
        this._vectorY = vectorY;
        this._vectorX = vectorX;
        x = xPos;
        y = yPos;
        rotation = 0;
        this.scale = .8;
        alpha = 1;
        this._gtween.delay = Math.random() * .3;
        this._gtween.proxy.scaleX = (this._gtween.proxy.scaleY = .01);
        this._gtween.proxy.rotation = Math.random() * 360;
        this._age = Math.random() * this._gfx.totalFrames;
    }
    private update(gt: GTween): void {
        let timeDelta: number = GTween.timeScaleAll;
        this._age += timeDelta;
        this._gfx.gotoAndPlay(1 + (int(this._age) % this._gfx.totalFrames - 1));
        x += this._vectorX / 100 * timeDelta;
        y += this._vectorY / 100 * timeDelta;
        this._vectorY += 10 * timeDelta;
        this._vectorX -= this._vectorX * .05 * timeDelta;
        this._vectorY -= this._vectorY * .05 * timeDelta;
    }
}