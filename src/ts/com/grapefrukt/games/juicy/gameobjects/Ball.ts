import type { Block } from './Block';
import { GameObject } from '../../general/gameobjects/GameObject';
import { Rainbow } from '../effects/Rainbow';
import { JuicyEvent } from '../events/JuicyEvent';
import { Settings } from '../Settings';
import { MathUtil } from '../../../math/MathUtil';
import { Back } from '../../../../gskinner/motion/easing/Back';
import { Quadratic } from '../../../../gskinner/motion/easing/Quadratic';
import { GTween } from '../../../../gskinner/motion/GTween';
import { Shape } from '../../../../../flash/display/Shape';
import { ColorTransform } from '../../../../../flash/geom/ColorTransform';
import { Point } from '../../../../../flash/geom/Point';
export class Ball extends GameObject {
    private static SIZE = 15;
    private _trail: Rainbow;
    private _gfx: Shape;
    private _ball_shakiness: number;
    private _ball_shakiness_vel: number;
    private _ball_rotation: number;
    private _ball_extra_scale: number;
    private _ball_color: number;
    private _tween_brightness: GTween;
    public exX: number;
    public exY: number;
    private _trailCooldown = .5;
    public constructor (x: number, y: number)
    {
        super();
        this.x = x;
        this.y = y;
        this._trail = new Rainbow();
        this.addChild(this._trail);
        this._gfx = new Shape();
        this.drawBall();
        this.addChild(this._gfx);
        const v: Point = Point.polar(5, Math.random() * Math.PI * 2);
        this.velocityX = v.x;
        this.velocityY = v.y;
        this._ball_shakiness = 0;
        this._ball_shakiness_vel = 0;
        this._ball_rotation = 0;
        this._ball_extra_scale = 0;
    }

    private drawBall (): void
    {
        this._gfx.graphics.clear();
        this._gfx.graphics.beginFill(Settings.COLOR_BALL);
        this._gfx.graphics.drawRect(-Ball.SIZE / 2, -Ball.SIZE / 2, Ball.SIZE, Ball.SIZE);
    }

    public update (timeDelta = 1): void
    {
        this.exX = this.x;
        this.exY = this.y;
        super.update(timeDelta);
        if (Settings.EFFECT_BALL_ROTATE )
        {
            const target_rotation: number = Math.atan2(this.velocityY, this.velocityX) / Math.PI * 180;
            this._ball_rotation += (target_rotation - this._ball_rotation) * timeDelta * 0.5;
            if (Settings.EFFECT_BALL_ROTATE_ANIMATED == false )
            {
                this._ball_rotation = target_rotation;
            }
            this._gfx.rotation = this._ball_rotation;
        }
        else
        {
            this._gfx.rotation = 0;
        }
        if (Math.abs(this._ball_shakiness) > 0 )
        {
            this._ball_shakiness_vel += timeDelta * -0.25 * this._ball_shakiness;
            this._ball_shakiness_vel -= timeDelta * this._ball_shakiness_vel * 0.10;
            this._ball_shakiness += timeDelta * this._ball_shakiness_vel;
        }
        if (Settings.EFFECT_BALL_STRETCH )
        {
            if (Settings.EFFECT_BALL_STRETCH_ANIMATED == false )
            {
                this._gfx.scaleX = 1 + (this.velocity - Settings.BALL_MIN_VELOCITY) / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .3;
                this._gfx.scaleY = 1 - (this.velocity - Settings.BALL_MIN_VELOCITY) / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .2;
            }
            else if (Settings.EFFECT_BALL_STRETCH_ANIMATED )
            {
                let relative: number = 1.0 + this.velocity / (2 * Settings.BALL_MAX_VELOCITY);
                relative = MathUtil.clamp(relative, 2.5, 1.0);
                this._gfx.scaleX = 1.0 * relative;
                this._gfx.scaleY = 1.0 / relative;
                this._gfx.scaleX -= this._ball_shakiness;
                this._gfx.scaleY += this._ball_shakiness;
                this._gfx.scaleX = MathUtil.clamp(this._gfx.scaleX, 1.35, 0.85);
                this._gfx.scaleY = MathUtil.clamp(this._gfx.scaleY, 1.35, 0.85);
            }
        }
        else
        {
            this._gfx.scaleX = (this._gfx.scaleY = 1);
        }
        if (Settings.EFFECT_BALL_EXTRA_SCALE )
        {
            if (this._ball_extra_scale > 0.01 )
            {
                this._gfx.scaleX += this._ball_extra_scale;
                this._gfx.scaleY += this._ball_extra_scale;
                this._ball_extra_scale -= timeDelta * this._ball_extra_scale * 0.35;
            }
        }
        else
        {
            this._ball_extra_scale = 0;
        }
        if ((this._trailCooldown -= timeDelta) < 0 )
        {
            this._trail.addSegment(this.x, this.y);
            this._trailCooldown = 3;
        }
        this._trail.redrawSegments(this.x, this.y);
    }

    private doCollisionEffects (block: Block = null): void
    {
        dispatchEvent(new JuicyEvent(JuicyEvent.BALL_COLLIDE, this, block));
        this._ball_shakiness = 0.1;
        this._ball_shakiness_vel = 2.5;
        this._ball_extra_scale += 1.5;
        if (Settings.EFFECT_BALL_GLOW )
        {
            if (!this._tween_brightness )
            {
                this._tween_brightness = new GTween(this, 0.7, null, { ease: Back.easeOut });
            }
            this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            this._tween_brightness.proxy.redOffset = (this._tween_brightness.proxy.greenOffset = (this._tween_brightness.proxy.blueOffset = 1));
        }
    }

    public collide (velocityMultiplierX: number, velocityMultiplierY: number, block: Block = null): void
    {
        this.velocityX *= velocityMultiplierX;
        this.velocityY *= velocityMultiplierY;
        this.doCollisionEffects(block);
    }

    public collideSet (newVelocityX: number, newVelocityY: number, block: Block = null): void
    {
        this.velocityX = newVelocityX;
        this.velocityY = newVelocityY;
        this.doCollisionEffects(block);
    }
}