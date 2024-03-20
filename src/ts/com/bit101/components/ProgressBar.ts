import { Component } from './Component';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
export class ProgressBar extends Component {
    protected _back: Sprite;
    protected _bar: Sprite;
    protected _value: number = 0;
    protected _max: number = 1;
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0)
    {
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 10);
    }

    protected addChildren (): void
    {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._bar = new Sprite();
        this._bar.x = 1;
        this._bar.y = 1;
        this._bar.filters = [this.getShadow(1)];
        this.addChild(this._bar);
    }

    protected update (): void
    {
        this._bar.scaleX = this._value / this._max;
    }

    public draw (): void
    {
        super.draw();
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, this._width, this._height);
        this._back.graphics.endFill();
        this._bar.graphics.clear();
        this._bar.graphics.beginFill(Style.PROGRESS_BAR);
        this._bar.graphics.drawRect(0, 0, this._width - 2, this._height - 2);
        this._bar.graphics.endFill();
        this.update();
    }

    public set maximum (m: number)
    {
        this._max = m;
        this._value = Math.min(this._value, this._max);
        this.update();
    }

    public get maximum (): number
    {
        return this._max;
    }

    public set value (v: number)
    {
        this._value = Math.min(v, this._max);
        this.update();
    }

    public get value (): number
    {
        return this._value;
    }
}