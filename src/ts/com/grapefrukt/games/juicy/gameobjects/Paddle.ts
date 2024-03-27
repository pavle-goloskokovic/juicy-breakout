import { Block } from './Block';
import type { Ball } from './Ball';
import { Settings } from '../Settings';
import { PaddleFace } from './PaddleFace';

export class Paddle extends Block {

    private _face: PaddleFace;
    private _happyExtraScale: number;

    constructor (scene: Phaser.Scene)
    {
        super(scene,
            Settings.STAGE_W / 2,
            Settings.STAGE_H + Settings.PADDLE_H / 2 - 50);

        this._collisionW = Settings.PADDLE_W;
        this._collisionH = Settings.PADDLE_H;

        this.render(Settings.COLOR_PADDLE);

        this.add(
            this._face = new PaddleFace(scene)
        );
    }

    collide (/*ball: Ball*/): void
    {
        this._happyExtraScale = 10;
    }

    update (deltaFactor = 1): void
    {
        super.update(deltaFactor);

        this._face.visible = Settings.EFFECT_PADDLE_FACE;
        this._face.smile(Settings.EFFECT_PADDLE_SMILE);
        this._face.eye_l.x = -Settings.EFFECT_PADDLE_EYE_SEPARATION;
        this._face.eye_r.x = Settings.EFFECT_PADDLE_EYE_SEPARATION;

        this._happyExtraScale *= 0.95;

        this._face.eye_l.scaleX =
            this._face.eye_l.scaleY =
                1 + Settings.EFFECT_PADDLE_EYE_SIZE / 100;

        this._face.eye_r.scaleX =
            this._face.eye_r.scaleY =
                1 + Settings.EFFECT_PADDLE_EYE_SIZE / 100;
    }

    lookAt (ball: Ball): void
    {
        if (Settings.EFFECT_PADDLE_LOOK_AT_BALL)
        {
            this._face.eye_l.angle = -Math.atan2(
                this.x + this._face.eye_l.x - ball.x,
                this.y + this._face.eye_l.y - ball.y
            ) * 180 / Math.PI;

            this._face.eye_r.angle = -Math.atan2(
                this.x + this._face.eye_r.x - ball.x,
                this.y + this._face.eye_r.y - ball.y
            ) * 180 / Math.PI;
        }
        else
        {
            this._face.eye_l.angle =
                this._face.eye_r.angle = 0;
        }

        this._face.mouth.scaleX = 1;

        let distance = Math.sqrt(
            Math.pow(this.x - ball.x, 2)
            + Math.pow(this.y - ball.y, 2)
        );
        distance /= 500;
        distance = 1 - Phaser.Math.Clamp(distance - 0.1, 0, 1);
        distance += this._happyExtraScale;

        this.smile(distance);
    }

    smile (distance: number): void
    {
        let t = 0;

        if (distance < 0.4)
        {
            t = -1 + distance / 0.4;

            this._face.mouth.scaleY = t;
        }
        else if (distance <= 1)
        {
            this._face.mouth.scaleY = 0.1;
        }
        else
        {
            t = 0.1 + (Phaser.Math.Clamp(distance, 0, 2) - 1.0) * 0.9;

            this._face.mouth.scaleY = t;
        }
    }

    protected render (color: number): void
    {
        this._gfx.clear();
        this._gfx.fillStyle(color);
        this._gfx.fillRect(
            -Settings.PADDLE_W / 2,
            -Settings.PADDLE_H / 2,
            Settings.PADDLE_W,
            Settings.PADDLE_H
        );
    }
}
