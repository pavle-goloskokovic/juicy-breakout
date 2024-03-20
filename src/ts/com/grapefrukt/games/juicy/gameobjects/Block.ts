import type { Ball } from './Ball';
import { DrawGeometry } from '../../../display/utilities/DrawGeometry';
import { GameObject } from '../../general/gameobjects/GameObject';
import { SliceEffect } from '../effects/SliceEffect';
import { JuicyEvent } from '../events/JuicyEvent';
import { Freezer } from '../Freezer';
import { Settings } from '../Settings';
import { Timestep } from '../../../Timestep';
import { Back } from '../../../../gskinner/motion/easing/Back';
import { Bounce } from '../../../../gskinner/motion/easing/Bounce';
import { Elastic } from '../../../../gskinner/motion/easing/Elastic';
import { Linear } from '../../../../gskinner/motion/easing/Linear';
import { Quadratic } from '../../../../gskinner/motion/easing/Quadratic';
import { GTween } from '../../../../gskinner/motion/GTween';
import { ColorTransformPlugin } from '../../../../gskinner/motion/plugins/ColorTransformPlugin';
import { Shape } from '../../../../../flash/display/Shape';
import { Sprite } from '../../../../../flash/display/Sprite';
import { Event } from '../../../../../flash/events/Event';
import { TimerEvent } from '../../../../../flash/events/TimerEvent';
import { ColorTransform } from '../../../../../flash/geom/ColorTransform';
import { Point } from '../../../../../flash/geom/Point';
import { Timer } from '../../../../../flash/utils/Timer';
export class Block extends GameObject {
    protected _collisionW: number = Settings.BLOCK_W;
    protected _collisionH: number = Settings.BLOCK_H;
    protected _collidable = true;
    protected _gfx: Sprite;
    private _sliceEffect: SliceEffect;
    constructor (x: number, y: number)
    {
        super();
        this.x = x;
        this.y = y;
        this._gfx = new Sprite();
        this.addChild(this._gfx);
        this.render(Settings.COLOR_BLOCK);
        if (Settings.EFFECT_TWEENIN_ENABLED )
        {
            if (Settings.EFFECT_TWEENIN_PROPERTY_Y )
            {
                this._gfx.y = -500;
            }
            if (Settings.EFFECT_TWEENIN_PROPERTY_ROTATION )
            {
                this._gfx.rotation = Math.random() * 90 - 45;
            }
            if (Settings.EFFECT_TWEENIN_PROPERTY_SCALE )
            {
                this._gfx.scaleX = (this._gfx.scaleY = .2);
            }
            const t: GTween = new GTween(this._gfx, Settings.EFFECT_TWEENIN_DURATION);
            t.proxy.y = 0;
            t.proxy.rotation = 0;
            t.proxy.scaleX = 1;
            t.proxy.scaleY = 1;
            t.delay = Math.random() * Settings.EFFECT_TWEENIN_DELAY;
            const easing: Array<Function> = Array([Linear.easeNone, Quadratic.easeOut, Back.easeOut, Bounce.easeOut]);
            t.ease = easing[Settings.EFFECT_TWEENIN_EQUATION];
        }
    }

    collide (ball: Ball): void
    {
        this._collidable = false;
        let delayDestruction = false;
        if (Settings.EFFECT_BLOCK_DARKEN )
        {
            this.transform.colorTransform = new ColorTransform(.7, .7, .8);
        }
        if (Settings.EFFECT_BLOCK_PUSH )
        {
            const v: Point = new Point(this.x - ball.x, this.y - ball.y);
            v.normalize(ball.velocity * 1);
            this.velocityX += v.x;
            this.velocityY += v.y;
            delayDestruction = true;
        }
        this.parent.setChildIndex(this, this.parent.numChildren - 1);
        this._sliceEffect = new SliceEffect(this._gfx, null);
        this.addChild(this._sliceEffect);
        this._gfx.visible = false;
        Freezer.freeze();
        if (Settings.EFFECT_BLOCK_ROTATE && !Settings.EFFECT_BLOCK_SHATTER )
        {
            this._sliceEffect.slices[0].velocityR = Math.random() > .5 ? Settings.EFFECT_BLOCK_SHATTER_ROTATION : -Settings.EFFECT_BLOCK_SHATTER_ROTATION;
            delayDestruction = true;
        }
        if (Settings.EFFECT_BLOCK_SHATTER )
        {
            this._sliceEffect.slice(new Point(ball.x - this.x + ball.velocityX * 10, ball.y - this.y + ball.velocityY * 10), new Point(ball.x - this.x - ball.velocityX * 10, ball.y - this.y - ball.velocityY * 10));
            delayDestruction = true;
        }
        if (Settings.EFFECT_BLOCK_SCALE )
        {
            for (const slice of this._sliceEffect.slices)
            {
                new GTween(slice, Settings.EFFECT_BLOCK_DESTRUCTION_DURATION, { scaleY: 0, scaleX: 0 }, { ease: Quadratic.easeOut });
            }
            delayDestruction = true;
        }
        dispatchEvent(new JuicyEvent(JuicyEvent.BLOCK_DESTROYED, ball, this));
        if (!delayDestruction )
        {
            this.remove();
        }
        else
        {
            new GTween(this, Settings.EFFECT_BLOCK_DESTRUCTION_DURATION, null, { onComplete: this.handleRemoveTweenComplete });
        }
    }

    jellyEffect (strength = .2, delay = 0): void
    {
        new GTween(this._gfx, .05, { scaleX: 1 + strength }, { delay: delay, ease: Quadratic.easeInOut, onComplete: function (gt: GTween): void
        {
            new GTween(gt.target, .6, { scaleX: 1 }, { ease: Elastic.easeOut });
        } });
        new GTween(this._gfx, .05, { scaleY: 1 + strength }, { delay: delay + .05, ease: Quadratic.easeInOut, onComplete: function (gt: GTween): void
        {
            new GTween(gt.target, .6, { scaleY: 1 }, { ease: Elastic.easeOut });
        } });
    }

    update (timeDelta = 1): void
    {
        super.update(timeDelta);
        if (this._sliceEffect )
        {
            this._sliceEffect.update(timeDelta);
        }
        if (Settings.EFFECT_BLOCK_GRAVITY && !this._collidable )
        {
            this.velocityY += .4 * timeDelta;
        }
    }

    private handleRemoveTweenComplete (g: GTween): void
    {
        this.remove();
    }

    protected render (color: number): void
    {
        this._gfx.graphics.clear();
        this._gfx.graphics.beginFill(color);
        this._gfx.graphics.drawRect(-Settings.BLOCK_W / 2, -Settings.BLOCK_H / 2, Settings.BLOCK_W, Settings.BLOCK_H);
    }

    get collidable (): boolean
    {
        return this._collidable;
    }

    get collisionW (): number
    {
        return this._collisionW;
    }

    get collisionH (): number
    {
        return this._collisionH;
    }
}
