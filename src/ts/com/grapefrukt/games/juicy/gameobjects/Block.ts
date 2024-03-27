import type { Ball } from './Ball';
import { GameObject } from '../../general/gameobjects/GameObject';
// import { SliceEffect } from '../effects/SliceEffect';
import { JuicyEvent } from '../events/JuicyEvent';
import { Freezer } from '../Freezer';
import { Settings } from '../Settings';

const tempVec = new Phaser.Math.Vector2();

export class Block extends GameObject {

    protected _collisionW: number = Settings.BLOCK_W;
    protected _collisionH: number = Settings.BLOCK_H;
    private _collidable = true;
    protected _gfx: Phaser.GameObjects.Graphics;

    // TODO slice effect
    // private _sliceEffect: SliceEffect;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.add(
            this._gfx = scene.add.graphics()
        );

        this.render(Settings.COLOR_BLOCK);

        if (Settings.EFFECT_TWEENIN_ENABLED)
        {
            if (Settings.EFFECT_TWEENIN_PROPERTY_Y)
            {
                this.y = y - 500;
            }

            if (Settings.EFFECT_TWEENIN_PROPERTY_ROTATION)
            {
                this.rotation = Math.random() * 90 - 45;
            }

            if (Settings.EFFECT_TWEENIN_PROPERTY_SCALE)
            {
                this.setScale(.2);
            }

            scene.add.tween({
                targets: this,
                duration: Settings.EFFECT_TWEENIN_DURATION * 1000,
                props: {
                    y,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1
                },
                delay: Math.random() * Settings.EFFECT_TWEENIN_DELAY * 1000,
                ease: [
                    Phaser.Math.Easing.Linear,
                    Phaser.Math.Easing.Quadratic.Out,
                    Phaser.Math.Easing.Back.Out,
                    Phaser.Math.Easing.Bounce.Out
                ][Settings.EFFECT_TWEENIN_EQUATION]
            });
        }
    }

    collide (ball: Ball): void
    {
        this._collidable = false;

        let delayDestruction = false;

        if (Settings.EFFECT_BLOCK_DARKEN) // TODO should affect slice color
        {
            // this.transform.colorTransform = new ColorTransform(.7, .7, .8);
            this.render(0x45846A);
        }

        if (Settings.EFFECT_BLOCK_PUSH)
        {
            tempVec.set(this.x - ball.x, this.y - ball.y)
                .normalize()
                .scale(ball.velocity);

            this.velocityX += tempVec.x;
            this.velocityY += tempVec.y;

            delayDestruction = true;
        }

        /*this.parent.setChildIndex(this, this.parent.numChildren - 1);
        this._sliceEffect = new SliceEffect(this._gfx, null);
        this.addChild(this._sliceEffect);*/

        this._gfx.visible = false;

        Freezer.freeze();

        /*if (Settings.EFFECT_BLOCK_ROTATE && !Settings.EFFECT_BLOCK_SHATTER)
        {
            this._sliceEffect.slices[0].velocityR = Math.random() > .5 ? Settings.EFFECT_BLOCK_SHATTER_ROTATION : -Settings.EFFECT_BLOCK_SHATTER_ROTATION;
            delayDestruction = true;
        }

        if (Settings.EFFECT_BLOCK_SHATTER)
        {
            this._sliceEffect.slice(new Point(ball.x - this.x + ball.velocityX * 10, ball.y - this.y + ball.velocityY * 10), new Point(ball.x - this.x - ball.velocityX * 10, ball.y - this.y - ball.velocityY * 10));
            delayDestruction = true;
        }

        if (Settings.EFFECT_BLOCK_SCALE)
        {
            for (const slice of this._sliceEffect.slices)
            {
                new GTween(slice, Settings.EFFECT_BLOCK_DESTRUCTION_DURATION, { scaleY: 0, scaleX: 0 }, { ease: Quadratic.easeOut });
            }
            delayDestruction = true;
        }*/

        this.scene.events.emit(JuicyEvent.BLOCK_DESTROYED, ball, this);

        if (!delayDestruction)
        {
            this.destroy();
        }
        else
        {
            this.scene.time.delayedCall(
                Settings.EFFECT_BLOCK_DESTRUCTION_DURATION * 1000,
                () => { this.destroy(); });
        }
    }

    jellyEffect (strength = .2, delay = 0): void
    {
        const tweens = this.scene.tweens;

        tweens.add({
            targets: this._gfx,
            duration: .05 * 1000,
            props: {
                scaleX: 1 + strength
            },
            delay: delay * 1000,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: (tween) =>
            {
                // TODO chain
                tweens.add({
                    targets: tween.targets,
                    duration: .6 * 1000,
                    props: {
                        scaleX: 1
                    },
                    ease: Phaser.Math.Easing.Elastic.Out
                });
            }
        });

        tweens.add({
            targets: this._gfx,
            duration: .05 * 1000,
            props: {
                scaleY: 1 + strength
            },
            delay: (delay + .05) * 1000,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: (tween) =>
            {
                // TODO chain
                tweens.add({
                    targets: tween.targets,
                    duration: .6 * 1000,
                    props: {
                        scaleY: 1
                    },
                    ease: Phaser.Math.Easing.Elastic.Out
                });
            }
        });
    }

    update (deltaFactor = 1): void
    {
        super.update(deltaFactor);

        /*if (this._sliceEffect)
        {
            this._sliceEffect.update(deltaFactor);
        }*/

        if (Settings.EFFECT_BLOCK_GRAVITY && !this._collidable)
        {
            this.velocityY += .4 * deltaFactor;
        }
    }

    protected render (color: number): void
    {
        this._gfx.clear()
            .fillStyle(color)
            .fillRect(
                -Settings.BLOCK_W / 2,
                -Settings.BLOCK_H / 2,
                Settings.BLOCK_W,
                Settings.BLOCK_H
            );
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
