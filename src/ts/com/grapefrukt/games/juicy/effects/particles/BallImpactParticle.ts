import { Particle } from '../../../general/particles/Particle';
import { Settings } from '../../Settings';
import { Quadratic } from '../../../../../gskinner/motion/easing/Quadratic';
import { ColorTransform } from '../../../../../../flash/geom/ColorTransform';
export class BallImpactParticle extends Particle {
    public constructor ()
    {
        super(.3 + Math.random() * .3);
        this.graphics.beginFill(Settings.COLOR_SPARK);
        this.graphics.drawRect(-7, -7, 14, 14);
        this.cacheAsBitmap = true;
        this._gtween.ease = Quadratic.easeOut;
        const shade: number = .8 + Math.random() * .2;
        this.transform.colorTransform = new ColorTransform(shade, shade, shade);
    }

    public init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        super.init(xPos, yPos, vectorX, vectorY);
        this.scaleX = (this.scaleY = 1);
        this._gtween.proxy.scaleX = .1;
        this._gtween.proxy.scaleY = .1;
    }
}