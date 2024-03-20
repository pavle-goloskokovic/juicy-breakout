import { Component } from './Component';
import { Label } from './Label';
import type { Slider } from './Slider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
[Event(name = 'change', type = 'flash.events.Event')];
export class UISlider extends Component {
    protected _label: Label;
    protected _valueLabel: Label;
    protected _slider: Slider;
    protected _precision = 1;
    protected _sliderClass: Class;
    protected _labelText: string;
    protected _tick = 1;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
    {
        this._labelText = label;
        super(parent, xpos, ypos);
        if (defaultHandler != null )
        {
            this.addEventListener(Event.CHANGE, defaultHandler);
        }
        this.formatValueLabel();
    }

    protected addChildren (): void
    {
        this._label = new Label(this, 0, 0);
        this._slider = new this._sliderClass(this, 0, 0, this.onSliderChange);
        this._valueLabel = new Label(this);
    }

    protected formatValueLabel (): void
    {
        if (isNaN(this._slider.value) )
        {
            this._valueLabel.text = 'NaN';
            return;
        }
        const mult: number = Math.pow(10, this._precision);
        let val: string = (Math.round(this._slider.value * mult) / mult).toString();
        const parts: any[] = val.split('.');
        if (parts[1] == null )
        {
            if (this._precision > 0 )
            {
                val += '.';
            }
            for (let i = 0; i < this._precision; i++)
            {
                val += '0';
            }
        }
        else if (parts[1].length < this._precision )
        {
            for (i = 0; i < this._precision - parts[1].length; i++)
            {
                val += '0';
            }
        }
        this._valueLabel.text = val;
        this.positionLabel();
    }

    protected positionLabel (): void
    {

    }

    draw (): void
    {
        super.draw();
        this._label.text = this._labelText;
        this._label.draw();
        this.formatValueLabel();
    }

    setSliderParams (min: number, max: number, value: number): void
    {
        this._slider.setSliderParams(min, max, value);
    }

    protected onSliderChange (event: Event): void
    {
        this.formatValueLabel();
        dispatchEvent(new Event(Event.CHANGE));
    }

    set value (v: number)
    {
        this._slider.value = v;
        this.formatValueLabel();
    }

    get value (): number
    {
        return this._slider.value;
    }

    set maximum (m: number)
    {
        this._slider.maximum = m;
    }

    get maximum (): number
    {
        return this._slider.maximum;
    }

    set minimum (m: number)
    {
        this._slider.minimum = m;
    }

    get minimum (): number
    {
        return this._slider.minimum;
    }

    set labelPrecision (decimals: number)
    {
        this._precision = decimals;
    }

    get labelPrecision (): number
    {
        return this._precision;
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

    set tick (t: number)
    {
        this._tick = t;
        this._slider.tick = this._tick;
    }

    get tick (): number
    {
        return this._tick;
    }
}
