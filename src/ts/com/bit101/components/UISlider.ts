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
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
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

    public draw (): void
    {
        super.draw();
        this._label.text = this._labelText;
        this._label.draw();
        this.formatValueLabel();
    }

    public setSliderParams (min: number, max: number, value: number): void
    {
        this._slider.setSliderParams(min, max, value);
    }

    protected onSliderChange (event: Event): void
    {
        this.formatValueLabel();
        dispatchEvent(new Event(Event.CHANGE));
    }

    public set value (v: number)
    {
        this._slider.value = v;
        this.formatValueLabel();
    }

    public get value (): number
    {
        return this._slider.value;
    }

    public set maximum (m: number)
    {
        this._slider.maximum = m;
    }

    public get maximum (): number
    {
        return this._slider.maximum;
    }

    public set minimum (m: number)
    {
        this._slider.minimum = m;
    }

    public get minimum (): number
    {
        return this._slider.minimum;
    }

    public set labelPrecision (decimals: number)
    {
        this._precision = decimals;
    }

    public get labelPrecision (): number
    {
        return this._precision;
    }

    public set label (str: string)
    {
        this._labelText = str;
        this.draw();
    }

    public get label (): string
    {
        return this._labelText;
    }

    public set tick (t: number)
    {
        this._tick = t;
        this._slider.tick = this._tick;
    }

    public get tick (): number
    {
        return this._tick;
    }
}