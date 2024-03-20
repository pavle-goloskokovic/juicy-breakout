import { Component } from './Component';
import { Label } from './Label';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { DropShadowFilter } from '../../../flash/filters/DropShadowFilter';
export class Meter extends Component {
    protected _damp: number = .8;
    protected _dial: Sprite;
    protected _label: Label;
    protected _labelText: string;
    protected _maximum: number = 1.0;
    protected _maxLabel: Label;
    protected _minimum: number = 0.0;
    protected _minLabel: Label;
    protected _needle: Sprite;
    protected _needleMask: Sprite;
    protected _showValues: boolean = true;
    protected _targetRotation: number = 0;
    protected _value: number = 0.0;
    protected _velocity: number = 0;
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, text: string = '')
    {
        this._labelText = text;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this._width = 200;
        this._height = 100;
    }

    protected addChildren (): void
    {
        this._dial = new Sprite();
        this.addChild(this._dial);
        this._needle = new Sprite();
        this._needle.rotation = -50;
        this._dial.addChild(this._needle);
        this._needleMask = new Sprite();
        this.addChild(this._needleMask);
        this._dial.mask = this._needleMask;
        this._minLabel = new Label(this);
        this._minLabel.text = this._minimum.toString();
        this._maxLabel = new Label(this);
        this._maxLabel.autoSize = true;
        this._maxLabel.text = this._maximum.toString();
        this._label = new Label(this);
        this._label.text = this._labelText;
    }

    public draw (): void
    {
        const startAngle: number = -140 * Math.PI / 180;
        const endAngle: number = -40 * Math.PI / 180;
        this.drawBackground();
        this.drawDial(startAngle, endAngle);
        this.drawTicks(startAngle, endAngle);
        this.drawNeedle();
        this._minLabel.move(10, this._height - this._minLabel.height - 4);
        this._maxLabel.move(this._width - this._maxLabel.width - 10, this._height - this._maxLabel.height - 4);
        this._label.move((this._width - this._label.width) / 2, this._height * .5);
        this.update();
    }

    public setSize (w: number, h: number): void
    {
        h = w / 2;
        super.setSize(w, h);
    }

    protected drawBackground (): void
    {
        this.graphics.clear();
        this.graphics.beginFill(Style.BACKGROUND);
        this.graphics.drawRect(0, 0, this._width, this._height);
        this.graphics.endFill();
        this.graphics.beginFill(Style.PANEL);
        this.graphics.drawRect(1, 1, this._width - 2, this._height - 2);
        this.graphics.endFill();
    }

    protected drawDial (startAngle: number, endAngle: number): void
    {
        this._dial.x = this._width / 2;
        this._dial.y = this._height * 1.25;
        this._dial.graphics.clear();
        this._dial.graphics.lineStyle(0, Style.BACKGROUND);
        this._dial.graphics.beginFill(Style.BUTTON_FACE);
        const r1: number = this._height * 1.05;
        const r2: number = this._height * 0.96;
        this._dial.graphics.moveTo(Math.cos(startAngle) * r1, Math.sin(startAngle) * r1);
        for (let i: number = startAngle; i < endAngle; i += .1)
        {
            this._dial.graphics.lineTo(Math.cos(i) * r1, Math.sin(i) * r1);
        }
        this._dial.graphics.lineTo(Math.cos(endAngle) * r1, Math.sin(endAngle) * r1);
        this._dial.graphics.lineTo(Math.cos(endAngle) * r2, Math.sin(endAngle) * r2);
        for (i = endAngle; i > startAngle; i -= .1)
        {
            this._dial.graphics.lineTo(Math.cos(i) * r2, Math.sin(i) * r2);
        }
        this._dial.graphics.lineTo(Math.cos(startAngle) * r2, Math.sin(startAngle) * r2);
        this._dial.graphics.lineTo(Math.cos(startAngle) * r1, Math.sin(startAngle) * r1);
    }

    protected drawTicks (startAngle: number, endAngle: number): void
    {
        const r1: number = this._height * 1.05;
        const r2: number = this._height * 0.96;
        const r3: number = this._height * 1.13;
        let tick: number = 0;
        for (let i: number = 0; i < 9; i++)
        {
            const angle: number = startAngle + i * (endAngle - startAngle) / 8;
            this._dial.graphics.moveTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
            if (tick++ % 2 == 0 )
            {
                this._dial.graphics.lineTo(Math.cos(angle) * r3, Math.sin(angle) * r3);
            }
            else
            {
                this._dial.graphics.lineTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
            }
        }
    }

    protected drawNeedle (): void
    {
        this._needle.graphics.clear();
        this._needle.graphics.beginFill(0xff0000);
        this._needle.graphics.drawRect(-0.5, -this._height * 1.10, 1, this._height * 1.10);
        this._needle.filters = [new DropShadowFilter(4, 0, 0, 1, 3, 3, .2)];
        this._needleMask.graphics.clear();
        this._needleMask.graphics.beginFill(0);
        this._needleMask.graphics.drawRect(0, 0, this._width, this._height);
        this._needleMask.graphics.endFill();
    }

    protected update (): void
    {
        this._value = Math.max(this._value, this._minimum);
        this._value = Math.min(this._value, this._maximum);
        this._targetRotation = -50 + (this._value - this._minimum) / (this._maximum - this._minimum) * 100;
        this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }

    protected onEnterFrame (event: Event): void
    {
        const dist: number = this._targetRotation - this._needle.rotation;
        this._velocity += dist * .05;
        this._velocity *= this._damp;
        if (Math.abs(this._velocity) < .1 && Math.abs(dist) < .1 )
        {
            this._needle.rotation = this._targetRotation;
            this.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        }
        else
        {
            this._needle.rotation += this._velocity;
        }
    }

    public set maximum (value: number)
    {
        this._maximum = this.value;
        this._maxLabel.text = this._maximum.toString();
        this.update();
    }

    public get maximum (): number
    {
        return this._maximum;
    }

    public set minimum (value: number)
    {
        this._minimum = this.value;
        this._minLabel.text = this._minimum.toString();
        this.update();
    }

    public get minimum (): number
    {
        return this._minimum;
    }

    public set value (val: number)
    {
        this._value = val;
        this.update();
    }

    public get value (): number
    {
        return this._value;
    }

    public set label (value: string)
    {
        this._labelText = this.value;
        this._label.text = this._labelText;
    }

    public get label (): string
    {
        return this._labelText;
    }

    public set showValues (value: boolean)
    {
        this._showValues = this.value;
        this._minLabel.visible = this._showValues;
        this._maxLabel.visible = this._showValues;
    }

    public get showValues (): boolean
    {
        return this._showValues;
    }

    public set damp (value: number)
    {
        this._damp = this.value;
    }

    public get damp (): number
    {
        return this._damp;
    }
}