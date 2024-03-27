import { Component } from './Component';
import { Label } from './Label';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { GradientType } from '../../../flash/display/GradientType';
import { Shape } from '../../../flash/display/Shape';
import { TimerEvent } from '../../../flash/events/TimerEvent';
import { Matrix } from '../../../flash/geom/Matrix';
import { Timer } from '../../../flash/utils/Timer';
export class IndicatorLight extends Component {
    protected _color = 0;
    protected _lit = false;
    protected _label: Label;
    protected _labelText = '';
    protected _lite: Shape;
    protected _timer: Timer;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, color = 0xff0000, label = '')
    {
        this._color = color;
        this._labelText = label;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this._timer = new Timer(500);
        this._timer.addEventListener(TimerEvent.TIMER, this.onTimer);
    }

    protected addChildren (): void
    {
        this._lite = new Shape();
        this.addChild(this._lite);
        this._label = new Label(this, 0, 0, this._labelText);
        this.draw();
    }

    protected drawLite (): void
    {
        let colors: any[];
        if (this._lit)
        {
            colors = [0xffffff, this._color];
        }
        else
        {
            colors = [0xffffff, 0];
        }
        this._lite.graphics.clear();
        const matrix: Matrix = new Matrix();
        matrix.createGradientBox(10, 10, 0, -2.5, -2.5);
        this._lite.graphics.beginGradientFill(GradientType.RADIAL, colors, [1, 1], [0, 255], matrix);
        this._lite.graphics.drawCircle(5, 5, 5);
        this._lite.graphics.endFill();
    }

    protected onTimer (event: TimerEvent): void
    {
        this._lit = !this._lit;
        this.draw();
    }

    draw (): void
    {
        super.draw();
        this.drawLite();
        this._label.text = this._labelText;
        this._label.x = 12;
        this._label.y = (10 - this._label.height) / 2;
        this._width = this._label.width + 12;
        this._height = 10;
    }

    flash (interval = 500): void
    {
        if (interval < 1)
        {
            this._timer.stop();
            this.isLit = false;
            return;
        }
        this._timer.delay = interval;
        this._timer.start();
    }

    set isLit (value: boolean)
    {
        this._timer.stop();
        this._lit = value;
        this.drawLite();
    }

    get isLit (): boolean
    {
        return this._lit;
    }

    set color (value: number)
    {
        this._color = value;
        this.draw();
    }

    get color (): number
    {
        return this._color;
    }

    get isFlashing (): boolean
    {
        return this._timer.running;
    }

    set label (str: string)
    {
        this._labelText = str;
        this.draw();
    }

    get label (): string
    {
        return this._labelText;
    }
}
