import {ParticleEvent} from "./events/ParticleEvent";
import {GTween} from "../../../../gskinner/motion/GTween";
import {Sprite} from "../../../../../flash/display/Sprite";
export class Particle extends Sprite {
    protected _gtween: GTween;
    protected _scale: number = 1;
    public constructor(lifespan: number = 2) {
        super();
        this._gtween = new GTween(this, lifespan);
        this._gtween.onComplete = this.die;
    }
    public reset(): void {
        this._gtween.end();
        this._gtween.position = -this._gtween.delay;
    }
    public init(xPos: number, yPos: number, vectorX: number = 0, vectorY: number = 0): void {
        x = xPos;
        y = yPos;
        this._gtween.proxy.x = xPos + vectorX;
        this._gtween.proxy.y = yPos + vectorY;
    }
    public die(gt: GTween = null): void {
        dispatchEvent(new ParticleEvent(ParticleEvent.DIE));
    }
    public get scale(): number {
        return this._scale;
    }
    public set scale(value: number) {
        this._scale = value;
        if(this._scale < .5 ) {
            scaleX = this._scale * 2;
            scaleY = this._scale * 2;
        } else {
            scaleX = 2 - this._scale * 2;
            scaleY = 2 - this._scale * 2;
        }
    }
}