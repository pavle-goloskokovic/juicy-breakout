import { Component } from './Component';
import { Label } from './Label';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
[Event(name = 'change', type = 'flash.events.Event')];
export class RotarySelector extends Component {
    static ALPHABETIC = 'alphabetic';
    static NUMERIC = 'numeric';
    static NONE = 'none';
    static ROMAN = 'roman';
    protected _label: Label;
    protected _labelText = '';
    protected _knob: Sprite;
    protected _numChoices = 2;
    protected _choice = 0;
    protected _labels: Sprite;
    protected _labelMode: string = ALPHABETIC;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
    {
        this._labelText = label;
        super(parent, xpos, ypos);
        if (defaultHandler != null)
        {
            this.addEventListener(Event.CHANGE, defaultHandler);
        }
    }

    protected init (): void
    {
        super.init();
        this.setSize(60, 60);
    }

    protected addChildren (): void
    {
        this._knob = new Sprite();
        this._knob.buttonMode = true;
        this._knob.useHandCursor = true;
        this.addChild(this._knob);
        this._label = new Label();
        this._label.autoSize = true;
        this.addChild(this._label);
        this._labels = new Sprite();
        this.addChild(this._labels);
        this._knob.addEventListener(MouseEvent.CLICK, this.onClick);
    }

    protected decrement (): void
    {
        if (this._choice > 0)
        {
            this._choice--;
            this.draw();
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    protected increment (): void
    {
        if (this._choice < this._numChoices - 1)
        {
            this._choice++;
            this.draw();
            dispatchEvent(new Event(Event.CHANGE));
        }
    }

    protected resetLabels (): void
    {
        while (this._labels.numChildren > 0)
        {
            this._labels.removeChildAt(0);
        }
        this._labels.x = this._width / 2 - 5;
        this._labels.y = this._height / 2 - 10;
    }

    protected drawKnob (radius: number): void
    {
        this._knob.graphics.clear();
        this._knob.graphics.beginFill(Style.BACKGROUND);
        this._knob.graphics.drawCircle(0, 0, radius);
        this._knob.graphics.endFill();
        this._knob.graphics.beginFill(Style.BUTTON_FACE);
        this._knob.graphics.drawCircle(0, 0, radius - 2);
        this._knob.x = this._width / 2;
        this._knob.y = this._height / 2;
    }

    draw (): void
    {
        super.draw();
        const radius: number = Math.min(this._width, this._height) / 2;
        this.drawKnob(radius);
        this.resetLabels();
        const arc: number = Math.PI * 1.5 / this._numChoices;
        const start: number = -Math.PI / 2 - arc * (this._numChoices - 1) / 2;
        this.graphics.clear();
        this.graphics.lineStyle(4, Style.BACKGROUND, .5);
        for (let i = 0; i < this._numChoices; i++)
        {
            const angle: number = start + arc * i;
            const sin: number = Math.sin(angle);
            const cos: number = Math.cos(angle);
            this.graphics.moveTo(this._knob.x, this._knob.y);
            this.graphics.lineTo(this._knob.x + cos * (radius + 2), this._knob.y + sin * (radius + 2));
            const lab: Label = new Label(this._labels, cos * (radius + 10), sin * (radius + 10));
            lab.mouseEnabled = true;
            lab.buttonMode = true;
            lab.useHandCursor = true;
            lab.addEventListener(MouseEvent.CLICK, this.onLabelClick);
            if (this._labelMode == RotarySelector.ALPHABETIC)
            {
                lab.text = String.fromCharCode(65 + i);
            }
            else if (this._labelMode == RotarySelector.NUMERIC)
            {
                lab.text = (i + 1).toString();
            }
            else if (this._labelMode == RotarySelector.ROMAN)
            {
                const chars: any[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
                lab.text = chars[i];
            }
            if (i != this._choice)
            {
                lab.alpha = 0.5;
            }
        }
        angle = start + arc * this._choice;
        this.graphics.lineStyle(4, Style.LABEL_TEXT);
        this.graphics.moveTo(this._knob.x, this._knob.y);
        this.graphics.lineTo(this._knob.x + Math.cos(angle) * (radius + 2), this._knob.y + Math.sin(angle) * (radius + 2));
        this._label.text = this._labelText;
        this._label.draw();
        this._label.x = this._width / 2 - this._label.width / 2;
        this._label.y = this._height + 2;
    }

    protected onClick (event: MouseEvent): void
    {
        if (this.mouseX < this._width / 2)
        {
            this.decrement();
        }
        else
        {
            this.increment();
        }
    }

    protected onLabelClick (event: Event): void
    {
        const lab: Label = event.target as Label;
        this.choice = this._labels.getChildIndex(lab);
    }

    set numChoices (value: number)
    {
        this._numChoices = Math.min(value, 10);
        this.draw();
    }

    get numChoices (): number
    {
        return this._numChoices;
    }

    set choice (value: number)
    {
        this._choice = Math.max(0, Math.min(this._numChoices - 1, value));
        this.draw();
        dispatchEvent(new Event(Event.CHANGE));
    }

    get choice (): number
    {
        return this._choice;
    }

    set labelMode (value: string)
    {
        this._labelMode = value;
        this.draw();
    }

    get labelMode (): string
    {
        return this._labelMode;
    }
}
