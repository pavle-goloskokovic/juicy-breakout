import type { Block } from './Block';
import { GameObject } from '../../general/gameobjects/GameObject';
import { Rainbow } from '../effects/Rainbow';
import { JuicyEvent } from '../events/JuicyEvent';
import { Settings } from '../Settings';

const tempVec = new Phaser.Math.Vector2();

export class Ball extends GameObject {

    private static SIZE = 15;

    private _trail: Rainbow;
    private _gfx: Phaser.GameObjects.Graphics;
    private _ball_shakiness: number;
    private _ball_shakiness_vel: number;
    private _ball_rotation: number;
    private _ball_extra_scale: number;
    // TODO ball glow
    // private _tween_brightness: GTween;

    exX: number;
    exY: number;

    private _trailCooldown = .5;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.add(
            this._trail = new Rainbow(scene)
        );

        this.add(
            this._gfx = scene.add.graphics()
        );

        this.drawBall();

        tempVec // Point.polar
            .set(1, 0)
            .scale(5)
            .setAngle(Math.random() * Math.PI * 2);
        this.velocityX = tempVec.x;
        this.velocityY = tempVec.y;

        this._ball_shakiness = 0;
        this._ball_shakiness_vel = 0;
        this._ball_rotation = 0;
        this._ball_extra_scale = 0;
    }

    private drawBall (): void
    {
        this._gfx.clear();
        this._gfx.fillStyle(Settings.COLOR_BALL);
        this._gfx.fillRect(
            -Ball.SIZE / 2,
            -Ball.SIZE / 2,
            Ball.SIZE,
            Ball.SIZE
        );
    }

    update (deltaFactor = 1): void
    {
        this.exX = this.x;
        this.exY = this.y;

        super.update(deltaFactor);

        if (Settings.EFFECT_BALL_ROTATE)
        {
            const target_rotation =
                Math.atan2(this.velocityY, this.velocityX) / Math.PI * 180;

            this._ball_rotation +=
                (target_rotation - this._ball_rotation) * deltaFactor * 0.5;

            if (!Settings.EFFECT_BALL_ROTATE_ANIMATED)
            {
                this._ball_rotation = target_rotation;
            }

            this._gfx.rotation = this._ball_rotation;
        }
        else
        {
            this._gfx.rotation = 0;
        }

        if (Math.abs(this._ball_shakiness) > 0)
        {
            this._ball_shakiness_vel +=
                deltaFactor * -0.25 * this._ball_shakiness;
            this._ball_shakiness_vel -=
                deltaFactor * this._ball_shakiness_vel * 0.10;
            this._ball_shakiness +=
                deltaFactor * this._ball_shakiness_vel;
        }

        if (Settings.EFFECT_BALL_STRETCH)
        {
            if (!Settings.EFFECT_BALL_STRETCH_ANIMATED)
            {
                this._gfx.scaleX = 1
                    + (this.velocity - Settings.BALL_MIN_VELOCITY)
                    / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .3;

                this._gfx.scaleY = 1
                    - (this.velocity - Settings.BALL_MIN_VELOCITY)
                    / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .2;
            }
            else
            {
                let relative = 1.0 +
                    this.velocity / (2 * Settings.BALL_MAX_VELOCITY);
                relative = Phaser.Math.Clamp(relative, 1.0, 2.5);
                this._gfx.scaleX = 1.0 * relative;
                this._gfx.scaleY = 1.0 / relative;
                this._gfx.scaleX -= this._ball_shakiness;
                this._gfx.scaleY += this._ball_shakiness;
                this._gfx.scaleX = Phaser.Math.Clamp(this._gfx.scaleX, 0.85, 1.35);
                this._gfx.scaleY = Phaser.Math.Clamp(this._gfx.scaleY, 0.85, 1.35);
            }
        }
        else
        {
            this._gfx.scaleX =
                this._gfx.scaleY = 1;
        }

        if (Settings.EFFECT_BALL_EXTRA_SCALE)
        {
            if (this._ball_extra_scale > 0.01)
            {
                this._gfx.scaleX += this._ball_extra_scale;
                this._gfx.scaleY += this._ball_extra_scale;
                this._ball_extra_scale -= deltaFactor
                    * this._ball_extra_scale * 0.35;
            }
        }
        else
        {
            this._ball_extra_scale = 0;
        }

        this._trailCooldown -= deltaFactor;
        if (this._trailCooldown < 0)
        {
            this._trail.addSegment(this.x, this.y);
            this._trailCooldown = 3;
        }
        this._trail.redrawSegments(this.x, this.y);
    }

    private doCollisionEffects (block: Block = null): void
    {
        this.scene.events.emit(JuicyEvent.BALL_COLLIDE, this, block);

        this._ball_shakiness = 0.1;
        this._ball_shakiness_vel = 2.5;
        this._ball_extra_scale += 1.5;

        /* if (Settings.EFFECT_BALL_GLOW)
        {
            if (!this._tween_brightness)
            {
                this._tween_brightness = new GTween(this, 0.7, null, { ease: Back.easeOut });
            }

            this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            this._tween_brightness.proxy.redOffset = (this._tween_brightness.proxy.greenOffset = (this._tween_brightness.proxy.blueOffset = 1));
        }*/
    }

    collide (velocityMultiplierX: number, velocityMultiplierY: number, block: Block = null): void
    {
        this.velocityX *= velocityMultiplierX;
        this.velocityY *= velocityMultiplierY;
        this.doCollisionEffects(block);
    }
}
