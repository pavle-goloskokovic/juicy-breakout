import { Block } from './Block';
import type { Ball } from './Ball';
import { GameObject } from '../../general/gameobjects/GameObject';
import { Settings } from '../Settings';
import { MathUtil } from '../../../math/MathUtil';
export class Paddle extends Block {
    private _face: PaddleFace;
    private _happyExtraScale: number;
    public constructor ()
    {
        super(Settings.STAGE_W / 2, Settings.STAGE_H + Settings.PADDLE_H / 2 - 50);
        this._collisionW = Settings.PADDLE_W;
        this._collisionH = Settings.PADDLE_H;
        this.render(Settings.COLOR_PADDLE);
        this._face = new PaddleFace();
        this._gfx.addChild(this._face);
    }

    public collide (ball: Ball): void
    {
        this._happyExtraScale = 10;
    }

    public update (timeDelta: number = 1): void
    {
        super.update(timeDelta);
        this._face.visible = Settings.EFFECT_PADDLE_FACE;
        this._face.mouth.gotoAndStop(Settings.EFFECT_PADDLE_SMILE);
        this._face.eye_l.x = -Settings.EFFECT_PADDLE_EYE_SEPARATION;
        this._face.eye_r.x = Settings.EFFECT_PADDLE_EYE_SEPARATION;
        this._happyExtraScale *= 0.95;
        this._face.eye_l.scaleX = (this._face.eye_l.scaleY = 1 + Settings.EFFECT_PADDLE_EYE_SIZE / 100);
        this._face.eye_r.scaleX = (this._face.eye_r.scaleY = 1 + Settings.EFFECT_PADDLE_EYE_SIZE / 100);
    }

    public lookAt (ball: Ball): void
    {
        if (Settings.EFFECT_PADDLE_LOOK_AT_BALL )
        {
            this._face.eye_l.rotation = -Math.atan2(this.x + this._face.eye_l.x - ball.x, this.y + this._face.eye_l.y - ball.y) * 180 / Math.PI;
            this._face.eye_r.rotation = -Math.atan2(this.x + this._face.eye_r.x - ball.x, this.y + this._face.eye_r.y - ball.y) * 180 / Math.PI;
        }
        else
        {
            this._face.eye_l.rotation = (this._face.eye_r.rotation = 0);
        }
        this._face.mouth.scaleX = 1;
        let distance: number = Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));
        distance /= 500;
        distance = 1 - MathUtil.clamp(distance - 0.1, 1, 0);
        distance += this._happyExtraScale;
        this.smile(distance);
    }

    public smile (how_much: number): void
    {
        let t: number = 0;
        if (how_much < 0.4 )
        {
            t = -1 + how_much / 0.4;
            this._face.mouth.scaleY = t;
        }
        else if (how_much <= 1 )
        {
            this._face.mouth.scaleY = 0.1;
        }
        else
        {
            t = 0.1 + (MathUtil.clamp(how_much, 2, 0) - 1.0) / 1.0 * 0.9;
            this._face.mouth.scaleY = t;
        }
    }

    protected render (color: number): void
    {
        this._gfx.graphics.clear();
        this._gfx.graphics.beginFill(color);
        this._gfx.graphics.drawRect(-Settings.PADDLE_W / 2, -Settings.PADDLE_H / 2, Settings.PADDLE_W, Settings.PADDLE_H);
    }
}