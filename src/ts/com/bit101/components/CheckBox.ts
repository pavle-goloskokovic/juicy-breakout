import { Component } from './Component';
import { Label } from './Label';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { MouseEvent } from '../../../flash/events/MouseEvent';
export class CheckBox extends Component {
    protected _back: Sprite;
    protected _button: Sprite;
    protected _label: Label;
    protected _labelText = '';
    protected _selected = false;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
    {
        this._labelText = label;
        super(parent, xpos, ypos);
        if (defaultHandler != null )
        {
            this.addEventListener(MouseEvent.CLICK, defaultHandler);
        }
    }

    protected init (): void
    {
        super.init();
        this.buttonMode = true;
        this.useHandCursor = true;
        this.mouseChildren = false;
    }

    protected addChildren (): void
    {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._button = new Sprite();
        this._button.filters = [this.getShadow(1)];
        this._button.visible = false;
        this.addChild(this._button);
        this._label = new Label(this, 0, 0, this._labelText);
        this.draw();
        this.addEventListener(MouseEvent.CLICK, this.onClick);
    }

    draw (): void
    {
        super.draw();
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, 10, 10);
        this._back.graphics.endFill();
        this._button.graphics.clear();
        this._button.graphics.beginFill(Style.BUTTON_FACE);
        this._button.graphics.drawRect(2, 2, 6, 6);
        this._label.text = this._labelText;
        this._label.draw();
        this._label.x = 12;
        this._label.y = (10 - this._label.height) / 2;
        this._width = this._label.width + 12;
        this._height = 10;
    }

    protected onClick (event: MouseEvent): void
    {
        this._selected = !this._selected;
        this._button.visible = this._selected;
    }

    set label (str: string)
    {
        this._labelText = str;
        this.invalidate();
    }

    get label (): string
    {
        return this._labelText;
    }

    set selected (s: boolean)
    {
        this._selected = s;
        this._button.visible = this._selected;
    }

    get selected (): boolean
    {
        return this._selected;
    }

    set enabled (value: boolean)
    {
        super.enabled = value;
        this.mouseChildren = false;
    }
}
