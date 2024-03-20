import {Particle} from "../../../general/particles/Particle";
import {Settings} from "../../Settings";
import {Quadratic} from "../../../../../gskinner/motion/easing/Quadratic";
import {ColorTransform} from "../../../../../../flash/geom/ColorTransform";
export class BlockShatterParticle extends Particle {
    public constructor() {
        super(.3 + Math.random() * .3);
        graphics.beginFill(Settings.COLOR_BLOCK);
        graphics.drawRect(-7, -7, 14, 14);
        cacheAsBitmap = true;
        this._gtween.ease = Quadratic.easeOut;
        let shade: number = .8 + Math.random() * .2;
        transform.colorTransform = new ColorTransform(shade, shade, shade);
    }
    public init(xPos: number, yPos: number, vectorX: number = 0, vectorY: number = 0): void {
        super.init(xPos, yPos, vectorX, vectorY);
        scaleX = (scaleY = 1);
        this._gtween.proxy.scaleX = .1;
        this._gtween.proxy.scaleY = .1;
    }
}