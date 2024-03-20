import { Component } from './Component';
import { PushButton } from './PushButton';
import { InputText } from './InputText';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
import { TimerEvent } from '../../../flash/events/TimerEvent';
import { Timer } from '../../../flash/utils/Timer';
[Event(name = 'change', type = 'flash.events.Event')];
export class NumericStepper extends Component {
    protected DELAY_TIME = 500;
    protected UP = 'up';
    protected DOWN = 'down';
    protected _minusBtn: PushButton;
    protected _repeatTime = 100;
    protected _plusBtn: PushButton;
    protected _valueText: InputText;
    protected _value = 0;
    protected _step = 1;
    protected _labelPrecision = 1;
    protected _maximum: number = Number.POSITIVE_INFINITY;
    protected _minimum: number = Number.NEGATIVE_INFINITY;
    protected _delayTimer: Timer;
    protected _repeatTimer: Timer;
    protected _direction: string;
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        super(parent, xpos, ypos);
        if (defaultHandler != null )
        {
            this.addEventListener(Event.CHANGE, defaultHandler);
        }
    }

    protected init (): void
    {
        super.init();
        this.setSize(80, 16);
        this._delayTimer = new Timer(this.DELAY_TIME, 1);
        this._delayTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this.onDelayComplete);
        this._repeatTimer = new Timer(this._repeatTime);
        this._repeatTimer.addEventListener(TimerEvent.TIMER, this.onRepeat);
    }

    protected addChildren (): void
    {
        this._valueText = new InputText(this, 0, 0, '0', this.onValueTextChange);
        this._valueText.restrict = '-0123456789.';
        this._minusBtn = new PushButton(this, 0, 0, '-');
        this._minusBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.onMinus);
        this._minusBtn.setSize(16, 16);
        this._plusBtn = new PushButton(this, 0, 0, '+');
        this._plusBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.onPlus);
        this._plusBtn.setSize(16, 16);
    }

    protected increment (): void
    {
        if (this._value + this._step <= this._maximum )
        {
            this._value += this._step;
            this.invalidate();
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    protected decrement (): void
    {
        if (this._value - this._step >= this._minimum )
        {
            this._value -= this._step;
            this.invalidate();
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    public draw (): void
    {
        this._plusBtn.x = this._width - 16;
        this._minusBtn.x = this._width - 32;
        this._valueText.text = (Math.round(this._value * Math.pow(10, this._labelPrecision)) / Math.pow(10, this._labelPrecision)).toString();
        this._valueText.width = this._width - 32;
        this._valueText.draw();
    }

    protected onMinus (event: MouseEvent): void
    {
        this.decrement();
        this._direction = this.DOWN;
        this._delayTimer.start();
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }

    protected onPlus (event: MouseEvent): void
    {
        this.increment();
        this._direction = this.UP;
        this._delayTimer.start();
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }

    protected onMouseGoUp (event: MouseEvent): void
    {
        this._delayTimer.stop();
        this._repeatTimer.stop();
    }

    protected onValueTextChange (event: Event): void
    {
        event.stopImmediatePropagation();
        const newVal = Number(this._valueText.text);
        if (newVal <= this._maximum && newVal >= this._minimum )
        {
            this._value = newVal;
            this.invalidate();
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    protected onDelayComplete (event: TimerEvent): void
    {
        this._repeatTimer.start();
    }

    protected onRepeat (event: TimerEvent): void
    {
        if (this._direction == this.UP )
        {
            this.increment();
        }
        else
        {
            this.decrement();
        }
    }

    public set value (val: number)
    {
        if (val <= this._maximum && val >= this._minimum )
        {
            this._value = val;
            this.invalidate();
        }
    }

    public get value (): number
    {
        return this._value;
    }

    public set step (value: number)
    {
        if (this.value < 0 )
        {
            throw new Error('NumericStepper step must be positive.');
        }
        this._step = this.value;
    }

    public get step (): number
    {
        return this._step;
    }

    public set labelPrecision (value: number)
    {
        this._labelPrecision = this.value;
        this.invalidate();
    }

    public get labelPrecision (): number
    {
        return this._labelPrecision;
    }

    public set maximum (value: number)
    {
        this._maximum = this.value;
        if (this._value > this._maximum )
        {
            this._value = this._maximum;
            this.invalidate();
        }
    }

    public get maximum (): number
    {
        return this._maximum;
    }

    public set minimum (value: number)
    {
        this._minimum = this.value;
        if (this._value < this._minimum )
        {
            this._value = this._minimum;
            this.invalidate();
        }
    }

    public get minimum (): number
    {
        return this._minimum;
    }

    public get repeatTime (): number
    {
        return this._repeatTime;
    }

    public set repeatTime (value: number)
    {
        this._repeatTime = Math.max(value, 10);
        this._repeatTimer.delay = this._repeatTime;
    }
}