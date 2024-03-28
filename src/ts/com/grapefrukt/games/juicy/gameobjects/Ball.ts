import type { Block } from './Block';
import { GameObject } from '../../general/gameobjects/GameObject';
import { Rainbow } from '../effects/Rainbow';
import { JuicyEvent } from '../events/JuicyEvent';
import { Settings } from '../Settings';

const tempVec = new Phaser.Math.Vector2();

export class Ball extends GameObject {

    private static SIZE = 15;

    private trail: Rainbow;
    private gfx: Phaser.GameObjects.Graphics;
    private ballShakiness = 0;
    private ballShakinessVel = 0;
    private ballRotation = 0;
    private ballExtraScale = 0;
    // TODO ball glow
    // private _tween_brightness: GTween;

    exX = 0;
    exY = 0;

    private trailCooldown = .5;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.add(
            this.trail = new Rainbow(scene)
        );

        this.add(
            this.gfx = scene.add.graphics()
        );

        this.drawBall();

        tempVec // Point.polar
            .set(1, 0)
            .scale(5)
            .setAngle(Math.random() * Math.PI * 2);
        this.velocityX = tempVec.x;
        this.velocityY = tempVec.y;

        this.ballShakiness = 0;
        this.ballShakinessVel = 0;
        this.ballRotation = 0;
        this.ballExtraScale = 0;
    }

    private drawBall (): void
    {
        this.gfx.clear();
        this.gfx.fillStyle(Settings.COLOR_BALL);
        this.gfx.fillRect(
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
            const targetRotation =
                Math.atan2(this.velocityY, this.velocityX) / Math.PI * 180;

            this.ballRotation +=
                (targetRotation - this.ballRotation) * deltaFactor * 0.5;

            if (!Settings.EFFECT_BALL_ROTATE_ANIMATED)
            {
                this.ballRotation = targetRotation;
            }

            this.gfx.rotation = this.ballRotation;
        }
        else
        {
            this.gfx.rotation = 0;
        }

        if (Math.abs(this.ballShakiness) > 0)
        {
            this.ballShakinessVel +=
                deltaFactor * -0.25 * this.ballShakiness;
            this.ballShakinessVel -=
                deltaFactor * this.ballShakinessVel * 0.10;
            this.ballShakiness +=
                deltaFactor * this.ballShakinessVel;
        }

        if (Settings.EFFECT_BALL_STRETCH)
        {
            if (!Settings.EFFECT_BALL_STRETCH_ANIMATED)
            {
                this.gfx.scaleX = 1
                    + (this.velocity - Settings.BALL_MIN_VELOCITY)
                    / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .3;

                this.gfx.scaleY = 1
                    - (this.velocity - Settings.BALL_MIN_VELOCITY)
                    / (Settings.BALL_MAX_VELOCITY - Settings.BALL_MIN_VELOCITY) * .2;
            }
            else
            {
                let relative = 1.0 +
                    this.velocity / (2 * Settings.BALL_MAX_VELOCITY);
                relative = Phaser.Math.Clamp(relative, 1.0, 2.5);
                this.gfx.scaleX = 1.0 * relative;
                this.gfx.scaleY = 1.0 / relative;
                this.gfx.scaleX -= this.ballShakiness;
                this.gfx.scaleY += this.ballShakiness;
                this.gfx.scaleX = Phaser.Math.Clamp(this.gfx.scaleX, 0.85, 1.35);
                this.gfx.scaleY = Phaser.Math.Clamp(this.gfx.scaleY, 0.85, 1.35);
            }
        }
        else
        {
            this.gfx.setScale(1);
        }

        if (Settings.EFFECT_BALL_EXTRA_SCALE)
        {
            if (this.ballExtraScale > 0.01)
            {
                this.gfx.scaleX += this.ballExtraScale;
                this.gfx.scaleY += this.ballExtraScale;
                this.ballExtraScale -= deltaFactor
                    * this.ballExtraScale * 0.35;
            }
        }
        else
        {
            this.ballExtraScale = 0;
        }

        this.trailCooldown -= deltaFactor;
        if (this.trailCooldown < 0)
        {
            this.trail.addSegment(this.x, this.y);
            this.trailCooldown = 3;
        }
        this.trail.redrawSegments(this.x, this.y);
    }

    private doCollisionEffects (block: Block = null): void
    {
        this.scene.events.emit(JuicyEvent.BALL_COLLIDE, this, block);

        this.ballShakiness = 0.1;
        this.ballShakinessVel = 2.5;
        this.ballExtraScale += 1.5;

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
