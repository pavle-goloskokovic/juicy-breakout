import { Component } from './Component';
import { Label } from './Label';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
import { Rectangle } from '../../../flash/geom/Rectangle';
[Event(name = 'change', type = 'flash.events.Event')];
export class RangeSlider extends Component {
    protected _back: Sprite;
    protected _highLabel: Label;
    protected _highValue = 100;
    protected _labelMode: string = ALWAYS;
    protected _labelPosition: string;
    protected _labelPrecision = 0;
    protected _lowLabel: Label;
    protected _lowValue = 0;
    protected _maximum = 100;
    protected _maxHandle: Sprite;
    protected _minimum = 0;
    protected _minHandle: Sprite;
    protected _orientation: string = VERTICAL;
    protected _tick = 1;
    static ALWAYS = 'always';
    static BOTTOM = 'bottom';
    static HORIZONTAL = 'horizontal';
    static LEFT = 'left';
    static MOVE = 'move';
    static NEVER = 'never';
    static RIGHT = 'right';
    static TOP = 'top';
    static VERTICAL = 'vertical';
    constructor (orientation: string, parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        this._orientation = orientation;
        super(parent, xpos, ypos);
        if (defaultHandler != null )
        {
            this.addEventListener(Event.CHANGE, defaultHandler);
        }
    }

    protected init (): void
    {
        super.init();
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this.setSize(110, 10);
            this._labelPosition = RangeSlider.TOP;
        }
        else
        {
            this.setSize(10, 110);
            this._labelPosition = RangeSlider.RIGHT;
        }
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._minHandle = new Sprite();
        this._minHandle.filters = [this.getShadow(1)];
        this._minHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.onDragMin);
        this._minHandle.buttonMode = true;
        this._minHandle.useHandCursor = true;
        this.addChild(this._minHandle);
        this._maxHandle = new Sprite();
        this._maxHandle.filters = [this.getShadow(1)];
        this._maxHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.onDragMax);
        this._maxHandle.buttonMode = true;
        this._maxHandle.useHandCursor = true;
        this.addChild(this._maxHandle);
        this._lowLabel = new Label(this);
        this._highLabel = new Label(this);
        this._lowLabel.visible = this._labelMode == RangeSlider.ALWAYS;
    }

    protected drawBack (): void
    {
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, this._width, this._height);
        this._back.graphics.endFill();
    }

    protected drawHandles (): void
    {
        this._minHandle.graphics.clear();
        this._minHandle.graphics.beginFill(Style.BUTTON_FACE);
        this._maxHandle.graphics.clear();
        this._maxHandle.graphics.beginFill(Style.BUTTON_FACE);
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this._minHandle.graphics.drawRect(1, 1, this._height - 2, this._height - 2);
            this._maxHandle.graphics.drawRect(1, 1, this._height - 2, this._height - 2);
        }
        else
        {
            this._minHandle.graphics.drawRect(1, 1, this._width - 2, this._width - 2);
            this._maxHandle.graphics.drawRect(1, 1, this._width - 2, this._width - 2);
        }
        this._minHandle.graphics.endFill();
        this.positionHandles();
    }

    protected positionHandles (): void
    {
        let range: number;
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            range = this._width - this._height * 2;
            this._minHandle.x = (this._lowValue - this._minimum) / (this._maximum - this._minimum) * range;
            this._maxHandle.x = this._height + (this._highValue - this._minimum) / (this._maximum - this._minimum) * range;
        }
        else
        {
            range = this._height - this._width * 2;
            this._minHandle.y = this._height - this._width - (this._lowValue - this._minimum) / (this._maximum - this._minimum) * range;
            this._maxHandle.y = this._height - this._width * 2 - (this._highValue - this._minimum) / (this._maximum - this._minimum) * range;
        }
        this.updateLabels();
    }

    protected updateLabels (): void
    {
        this._lowLabel.text = this.getLabelForValue(this.lowValue);
        this._highLabel.text = this.getLabelForValue(this.highValue);
        this._lowLabel.draw();
        this._highLabel.draw();
        if (this._orientation == RangeSlider.VERTICAL )
        {
            this._lowLabel.y = this._minHandle.y + (this._width - this._lowLabel.height) * 0.5;
            this._highLabel.y = this._maxHandle.y + (this._width - this._highLabel.height) * 0.5;
            if (this._labelPosition == RangeSlider.LEFT )
            {
                this._lowLabel.x = -this._lowLabel.width - 5;
                this._highLabel.x = -this._highLabel.width - 5;
            }
            else
            {
                this._lowLabel.x = this._width + 5;
                this._highLabel.x = this._width + 5;
            }
        }
        else
        {
            this._lowLabel.x = this._minHandle.x - this._lowLabel.width + this._height;
            this._highLabel.x = this._maxHandle.x;
            if (this._labelPosition == RangeSlider.BOTTOM )
            {
                this._lowLabel.y = this._height + 2;
                this._highLabel.y = this._height + 2;
            }
            else
            {
                this._lowLabel.y = -this._lowLabel.height;
                this._highLabel.y = -this._highLabel.height;
            }
        }
    }

    protected getLabelForValue (value: number): string
    {
        let str: string = (Math.round(value * Math.pow(10, this._labelPrecision)) / Math.pow(10, this._labelPrecision)).toString();
        if (this._labelPrecision > 0 )
        {
            const decimal: string = str.split('.')[1] || '';
            if (decimal.length == 0 )
            {
                str += '.';
            }
            for (let i: number = decimal.length; i < this._labelPrecision; i++)
            {
                str += '0';
            }
        }
        return str;
    }

    draw (): void
    {
        super.draw();
        this.drawBack();
        this.drawHandles();
    }

    protected onDragMin (event: MouseEvent): void
    {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onMinSlide);
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this._minHandle.startDrag(false, new Rectangle(0, 0, this._maxHandle.x - this._height, 0));
        }
        else
        {
            this._minHandle.startDrag(false, new Rectangle(0, this._maxHandle.y + this._width, 0, this._height - this._maxHandle.y - this._width * 2));
        }
        if (this._labelMode == RangeSlider.MOVE )
        {
            this._lowLabel.visible = true;
            this._highLabel.visible = true;
        }
    }

    protected onDragMax (event: MouseEvent): void
    {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onMaxSlide);
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this._maxHandle.startDrag(false, new Rectangle(this._minHandle.x + this._height, 0, this._width - this._height - this._minHandle.x - this._height, 0));
        }
        else
        {
            this._maxHandle.startDrag(false, new Rectangle(0, 0, 0, this._minHandle.y - this._width));
        }
        if (this._labelMode == RangeSlider.MOVE )
        {
            this._lowLabel.visible = true;
            this._highLabel.visible = true;
        }
    }

    protected onDrop (event: MouseEvent): void
    {
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMinSlide);
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMaxSlide);
        this.stopDrag();
        if (this._labelMode == RangeSlider.MOVE )
        {
            this._lowLabel.visible = false;
            this._highLabel.visible = false;
        }
    }

    protected onMinSlide (event: MouseEvent): void
    {
        const oldValue: number = this._lowValue;
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this._lowValue = this._minHandle.x / (this._width - this._height * 2) * (this._maximum - this._minimum) + this._minimum;
        }
        else
        {
            this._lowValue = (this._height - this._width - this._minHandle.y) / (this.height - this._width * 2) * (this._maximum - this._minimum) + this._minimum;
        }
        if (this._lowValue != oldValue )
        {
            dispatchEvent(new Event(Event.CHANGE));
        }
        this.updateLabels();
    }

    protected onMaxSlide (event: MouseEvent): void
    {
        const oldValue: number = this._highValue;
        if (this._orientation == RangeSlider.HORIZONTAL )
        {
            this._highValue = (this._maxHandle.x - this._height) / (this._width - this._height * 2) * (this._maximum - this._minimum) + this._minimum;
        }
        else
        {
            this._highValue = (this._height - this._width * 2 - this._maxHandle.y) / (this._height - this._width * 2) * (this._maximum - this._minimum) + this._minimum;
        }
        if (this._highValue != oldValue )
        {
            dispatchEvent(new Event(Event.CHANGE));
        }
        this.updateLabels();
    }

    set minimum (value: number)
    {
        this._minimum = value;
        this._maximum = Math.max(this._maximum, this._minimum);
        this._lowValue = Math.max(this._lowValue, this._minimum);
        this._highValue = Math.max(this._highValue, this._minimum);
        this.positionHandles();
    }

    get minimum (): number
    {
        return this._minimum;
    }

    set maximum (value: number)
    {
        this._maximum = value;
        this._minimum = Math.min(this._minimum, this._maximum);
        this._lowValue = Math.min(this._lowValue, this._maximum);
        this._highValue = Math.min(this._highValue, this._maximum);
        this.positionHandles();
    }

    get maximum (): number
    {
        return this._maximum;
    }

    set lowValue (value: number)
    {
        this._lowValue = value;
        this._lowValue = Math.min(this._lowValue, this._highValue);
        this._lowValue = Math.max(this._lowValue, this._minimum);
        this.positionHandles();
        dispatchEvent(new Event(Event.CHANGE));
    }

    get lowValue (): number
    {
        return Math.round(this._lowValue / this._tick) * this._tick;
    }

    set highValue (value: number)
    {
        this._highValue = value;
        this._highValue = Math.max(this._highValue, this._lowValue);
        this._highValue = Math.min(this._highValue, this._maximum);
        this.positionHandles();
        dispatchEvent(new Event(Event.CHANGE));
    }

    get highValue (): number
    {
        return Math.round(this._highValue / this._tick) * this._tick;
    }

    set labelMode (value: string)
    {
        this._labelMode = value;
        this._highLabel.visible = this._labelMode == RangeSlider.ALWAYS;
        this._lowLabel.visible = this._labelMode == RangeSlider.ALWAYS;
    }

    get labelMode (): string
    {
        return this._labelMode;
    }

    set labelPosition (value: string)
    {
        this._labelPosition = value;
        this.updateLabels();
    }

    get labelPosition (): string
    {
        return this._labelPosition;
    }

    set labelPrecision (value: number)
    {
        this._labelPrecision = value;
        this.updateLabels();
    }

    get labelPrecision (): number
    {
        return this._labelPrecision;
    }

    set tick (value: number)
    {
        this._tick = value;
        this.updateLabels();
    }

    get tick (): number
    {
        return this._tick;
    }
}
