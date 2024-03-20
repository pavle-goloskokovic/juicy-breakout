import { Component } from './Component';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
import { Rectangle } from '../../../flash/geom/Rectangle';
[Event(name = 'change', type = 'flash.events.Event')];
export class Slider extends Component {
    protected _handle: Sprite;
    protected _back: Sprite;
    protected _backClick = true;
    protected _value = 0;
    protected _max = 100;
    protected _min = 0;
    protected _orientation: string;
    protected _tick = 0.01;
    static HORIZONTAL = 'horizontal';
    static VERTICAL = 'vertical';
    constructor (orientation: string = Slider.HORIZONTAL, parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        this._orientation = orientation;
        super(parent, xpos, ypos);
        if (defaultHandler != null)
        {
            this.addEventListener(Event.CHANGE, defaultHandler);
        }
    }

    protected init (): void
    {
        super.init();
        if (this._orientation == Slider.HORIZONTAL)
        {
            this.setSize(100, 10);
        }
        else
        {
            this.setSize(10, 100);
        }
    }

    protected addChildren (): void
    {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._handle = new Sprite();
        this._handle.filters = [this.getShadow(1)];
        this._handle.addEventListener(MouseEvent.MOUSE_DOWN, this.onDrag);
        this._handle.buttonMode = true;
        this._handle.useHandCursor = true;
        this.addChild(this._handle);
    }

    protected drawBack (): void
    {
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, this._width, this._height);
        this._back.graphics.endFill();
        if (this._backClick)
        {
            this._back.addEventListener(MouseEvent.MOUSE_DOWN, this.onBackClick);
        }
        else
        {
            this._back.removeEventListener(MouseEvent.MOUSE_DOWN, this.onBackClick);
        }
    }

    protected drawHandle (): void
    {
        this._handle.graphics.clear();
        this._handle.graphics.beginFill(Style.BUTTON_FACE);
        if (this._orientation == Slider.HORIZONTAL)
        {
            this._handle.graphics.drawRect(1, 1, this._height - 2, this._height - 2);
        }
        else
        {
            this._handle.graphics.drawRect(1, 1, this._width - 2, this._width - 2);
        }
        this._handle.graphics.endFill();
        this.positionHandle();
    }

    protected correctValue (): void
    {
        if (this._max > this._min)
        {
            this._value = Math.min(this._value, this._max);
            this._value = Math.max(this._value, this._min);
        }
        else
        {
            this._value = Math.max(this._value, this._max);
            this._value = Math.min(this._value, this._min);
        }
    }

    protected positionHandle (): void
    {
        let range: number;
        if (this._orientation == Slider.HORIZONTAL)
        {
            range = this._width - this._height;
            this._handle.x = (this._value - this._min) / (this._max - this._min) * range;
        }
        else
        {
            range = this._height - this._width;
            this._handle.y = this._height - this._width - (this._value - this._min) / (this._max - this._min) * range;
        }
    }

    draw (): void
    {
        super.draw();
        this.drawBack();
        this.drawHandle();
    }

    setSliderParams (min: number, max: number, value: number): void
    {
        this.minimum = min;
        this.maximum = max;
        this.value = value;
    }

    protected onBackClick (event: MouseEvent): void
    {
        if (this._orientation == Slider.HORIZONTAL)
        {
            this._handle.x = this.mouseX - this._height / 2;
            this._handle.x = Math.max(this._handle.x, 0);
            this._handle.x = Math.min(this._handle.x, this._width - this._height);
            this._value = this._handle.x / (this.width - this._height) * (this._max - this._min) + this._min;
        }
        else
        {
            this._handle.y = this.mouseY - this._width / 2;
            this._handle.y = Math.max(this._handle.y, 0);
            this._handle.y = Math.min(this._handle.y, this._height - this._width);
            this._value = (this._height - this._width - this._handle.y) / (this.height - this._width) * (this._max - this._min) + this._min;
        }
        dispatchEvent(new Event(Event.CHANGE));
    }

    protected onDrag (event: MouseEvent): void
    {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onSlide);
        if (this._orientation == Slider.HORIZONTAL)
        {
            this._handle.startDrag(false, new Rectangle(0, 0, this._width - this._height, 0));
        }
        else
        {
            this._handle.startDrag(false, new Rectangle(0, 0, 0, this._height - this._width));
        }
    }

    protected onDrop (event: MouseEvent): void
    {
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onSlide);
        this.stopDrag();
    }

    protected onSlide (event: MouseEvent): void
    {
        const oldValue: number = this._value;
        if (this._orientation == Slider.HORIZONTAL)
        {
            this._value = this._handle.x / (this.width - this._height) * (this._max - this._min) + this._min;
        }
        else
        {
            this._value = (this._height - this._width - this._handle.y) / (this.height - this._width) * (this._max - this._min) + this._min;
        }
        if (this._value != oldValue)
        {
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    set backClick (b: boolean)
    {
        this._backClick = b;
        this.invalidate();
    }

    get backClick (): boolean
    {
        return this._backClick;
    }

    set value (v: number)
    {
        this._value = v;
        this.correctValue();
        this.positionHandle();
    }

    get value (): number
    {
        return Math.round(this._value / this._tick) * this._tick;
    }

    get rawValue (): number
    {
        return this._value;
    }

    set maximum (m: number)
    {
        this._max = m;
        this.correctValue();
        this.positionHandle();
    }

    get maximum (): number
    {
        return this._max;
    }

    set minimum (m: number)
    {
        this._min = m;
        this.correctValue();
        this.positionHandle();
    }

    get minimum (): number
    {
        return this._min;
    }

    set tick (t: number)
    {
        this._tick = t;
    }

    get tick (): number
    {
        return this._tick;
    }
}
