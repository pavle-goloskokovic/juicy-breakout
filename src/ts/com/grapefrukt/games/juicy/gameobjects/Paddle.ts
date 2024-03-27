import { Block } from './Block';
import type { Ball } from './Ball';
import { Settings } from '../Settings';
import { PaddleFace } from './PaddleFace';

export class Paddle extends Block {

    private readonly face: PaddleFace;
    private happyExtraScale = 0;

    constructor (scene: Phaser.Scene)
    {
        super(scene,
            Settings.STAGE_W / 2,
            Settings.STAGE_H + Settings.PADDLE_H / 2 - 50);

        this._collisionW = Settings.PADDLE_W;
        this._collisionH = Settings.PADDLE_H;

        this.render(Settings.COLOR_PADDLE);

        this.add(
            this.face = new PaddleFace(scene)
        );
    }

    collide (/*ball: Ball*/): void
    {
        this.happyExtraScale = 10;
    }

    update (deltaFactor = 1): void
    {
        super.update(deltaFactor);

        const face = this.face;
        const eyeL = face.eyeL;
        const eyeR = face.eyeR;

        face.visible = Settings.EFFECT_PADDLE_FACE;
        face.smile(Settings.EFFECT_PADDLE_SMILE);
        eyeL.x = -Settings.EFFECT_PADDLE_EYE_SEPARATION;
        eyeR.x = Settings.EFFECT_PADDLE_EYE_SEPARATION;

        this.happyExtraScale *= 0.95;

        const scale = (1 + Settings.EFFECT_PADDLE_EYE_SIZE / 100) / 4;
        eyeL.setScale(scale);
        eyeR.setScale(scale);
    }

    lookAt (ball: Ball): void
    {
        const face = this.face;
        const eyeL = face.eyeL;
        const eyeR = face.eyeR;

        if (Settings.EFFECT_PADDLE_LOOK_AT_BALL)
        {
            eyeL.angle = -Math.atan2(
                this.x + eyeL.x - ball.x,
                this.y + eyeL.y - ball.y
            ) * 180 / Math.PI;

            eyeR.angle = -Math.atan2(
                this.x + eyeR.x - ball.x,
                this.y + eyeR.y - ball.y
            ) * 180 / Math.PI;
        }
        else
        {
            eyeL.angle =
                eyeR.angle = 0;
        }

        face.mouth.scaleX = 1;

        let distance = Math.sqrt(
            Math.pow(this.x - ball.x, 2)
            + Math.pow(this.y - ball.y, 2)
        );
        distance /= 500;
        distance = 1 - Phaser.Math.Clamp(distance - 0.1, 0, 1);
        distance += this.happyExtraScale;

        this.smile(distance);
    }

    smile (distance: number): void
    {
        const mouth = this.face.mouth;

        let t = 0;

        if (distance < 0.4)
        {
            t = -1 + distance / 0.4;

            mouth.scaleY = t;
        }
        else if (distance <= 1)
        {
            mouth.scaleY = 0.1;
        }
        else
        {
            t = 0.1 + (Phaser.Math.Clamp(distance, 0, 2) - 1.0) * 0.9;

            mouth.scaleY = t;
        }
    }

    protected render (color: number): void
    {
        this._gfx.clear()
            .fillStyle(color)
            .fillRect(
                -Settings.PADDLE_W / 2,
                -Settings.PADDLE_H / 2,
                Settings.PADDLE_W,
                Settings.PADDLE_H
            );
    }
}
