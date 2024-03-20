import type { DisplayObject } from '../../../../flash/display/DisplayObject';
import { Point } from '../../../../flash/geom/Point';
export class Shaker {
    private _velocity: Point;
    private _position: Point;
    private _target: DisplayObject;
    private _drag: number = .1;
    private _elasticity: number = .1;
    public constructor (target: DisplayObject)
    {
        this._target = target;
        this._velocity = new Point();
        this._position = new Point();
    }

    public shake (powerX: number, powerY: number): void
    {
        this._velocity.x += powerX;
        this._velocity.y += powerY;
    }

    public shakeRandom (power: number): void
    {
        this._velocity = Point.polar(power, Math.random() * Math.PI * 2);
    }

    public update (delta: number): void
    {
        this._velocity.x -= this._velocity.x * this._drag * delta;
        this._velocity.y -= this._velocity.y * this._drag * delta;
        this._velocity.x -= this._position.x * this._elasticity * delta;
        this._velocity.y -= this._position.y * this._elasticity * delta;
        this._position.x += this._velocity.x * delta;
        this._position.y += this._velocity.y * delta;
        this._target.x = this._position.x;
        this._target.y = this._position.y;
    }
}