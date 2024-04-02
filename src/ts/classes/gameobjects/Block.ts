import type { Ball } from './Ball';
import { GameObject } from './GameObject';
import { GraphicsSliceEffect } from '../effects/GraphicsSliceEffect';
import { JuicyEvent } from '../events/JuicyEvent';
import { Freezer } from '../Freezer';
import { Settings } from '../Settings';

const tempVec = new Phaser.Math.Vector2();
const boundsRect = new Phaser.Geom.Rectangle(
    -Settings.BLOCK_W / 2,
    -Settings.BLOCK_H / 2,
    Settings.BLOCK_W,
    Settings.BLOCK_H
);

export class Block extends GameObject {

    protected _collisionW: number = Settings.BLOCK_W;
    protected _collisionH: number = Settings.BLOCK_H;
    private _collidable = true;
    protected gfx: Phaser.GameObjects.Graphics;

    private sliceEffect: GraphicsSliceEffect;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.add(
            this.gfx = scene.add.graphics()
        );

        this.render();

        if (Settings.EFFECT_TWEENIN_ENABLED)
        {
            if (Settings.EFFECT_TWEENIN_PROPERTY_Y)
            {
                this.y = y - 500;
            }

            if (Settings.EFFECT_TWEENIN_PROPERTY_ROTATION)
            {
                this.angle = Math.random() * 90 - 45;
            }

            if (Settings.EFFECT_TWEENIN_PROPERTY_SCALE)
            {
                this.setScale(.2);
            }

            scene.tweens.add({
                targets: this,
                duration: Settings.EFFECT_TWEENIN_DURATION * 1000,
                props: {
                    y,
                    angle: 0,
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

        // moved to slice effect
        /*if (Settings.EFFECT_BLOCK_DARKEN)
        {
            this.transform.colorTransform = new ColorTransform(.7, .7, .8);
        }*/

        if (Settings.EFFECT_BLOCK_PUSH)
        {
            tempVec.set(this.x - ball.x, this.y - ball.y)
                .normalize()
                .scale(ball.velocity);

            this.velocityX += tempVec.x;
            this.velocityY += tempVec.y;

            delayDestruction = true;
        }

        this.scene.children.bringToTop(this);
        this.add(this.sliceEffect =
            new GraphicsSliceEffect(this.scene, this.gfx, boundsRect));

        this.gfx.visible = false;

        Freezer.freeze();

        if (Settings.EFFECT_BLOCK_ROTATE && !Settings.EFFECT_BLOCK_SHATTER)
        {
            this.sliceEffect.slices[0].velocityR = Math.random() > .5 ?
                Settings.EFFECT_BLOCK_SHATTER_ROTATION :
                -Settings.EFFECT_BLOCK_SHATTER_ROTATION;

            delayDestruction = true;
        }

        if (Settings.EFFECT_BLOCK_SHATTER)
        {
            this.sliceEffect.slice( // TODO cache vectors
                new Phaser.Math.Vector2(
                    ball.x - this.x + ball.velocityX * 10,
                    ball.y - this.y + ball.velocityY * 10
                ),
                new Phaser.Math.Vector2(
                    ball.x - this.x - ball.velocityX * 10,
                    ball.y - this.y - ball.velocityY * 10
                )
            );

            delayDestruction = true;
        }

        if (Settings.EFFECT_BLOCK_SCALE)
        {
            for (const slice of this.sliceEffect.slices)
            {
                this.scene.tweens.add({
                    targets: slice,
                    duration: Settings.EFFECT_BLOCK_DESTRUCTION_DURATION * 1000,
                    props: { scaleY: 0, scaleX: 0 },
                    ease: Phaser.Math.Easing.Quadratic.Out
                });
            }

            delayDestruction = true;
        }

        const events = this.scene.events;

        if (!delayDestruction)
        {
            events.emit(JuicyEvent.BLOCK_DESTROYED, ball, this);

            this.destroy();
        }
        else
        {
            this.scene.time.delayedCall(
                Settings.EFFECT_BLOCK_DESTRUCTION_DURATION * 1000,
                () =>
                {
                    events.emit(JuicyEvent.BLOCK_DESTROYED, ball, this);

                    this.destroy();
                });
        }
    }

    jellyEffect (strength = .2, delay = 0): void
    {
        const tweens = this.scene.tweens;

        tweens.add({
            targets: this.gfx,
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
            targets: this.gfx,
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

        if (this.sliceEffect)
        {
            this.sliceEffect.update(deltaFactor);
        }

        if (Settings.EFFECT_BLOCK_GRAVITY && !this._collidable)
        {
            this.velocityY += .4 * deltaFactor;
        }
    }

    updateColorUse (): void
    {
        this.render();
    }

    protected render (color = Settings.COLOR_BLOCK): void
    {
        this.gfx.clear()
            .fillStyle(Settings.EFFECT_SCREEN_COLORS ? color : 0xFFFFFF)
            .fillRect(
                boundsRect.x, boundsRect.y,
                boundsRect.width, boundsRect.height
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
