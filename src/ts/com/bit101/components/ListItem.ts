import { Component } from './Component';
import { Label } from './Label';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { MouseEvent } from '../../../flash/events/MouseEvent';
export class ListItem extends Component {
    protected _data: any;
    protected _label: Label;
    protected _defaultColor = 0xffffff;
    protected _selectedColor = 0xdddddd;
    protected _rolloverColor = 0xeeeeee;
    protected _selected: boolean;
    protected _mouseOver = false;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, data: any = null)
    {
        this._data = data;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
        this.setSize(100, 20);
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._label = new Label(this, 5, 0);
        this._label.draw();
    }

    draw (): void
    {
        super.draw();
        this.graphics.clear();
        if (this._selected )
        {
            this.graphics.beginFill(this._selectedColor);
        }
        else if (this._mouseOver )
        {
            this.graphics.beginFill(this._rolloverColor);
        }
        else
        {
            this.graphics.beginFill(this._defaultColor);
        }
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
        if (this._data == null )
        {
            return;
        }
        if (this._data instanceof String )
        {
            this._label.text = this._data as string;
        }
        else if (this._data.hasOwnProperty('label') && this._data.label instanceof String )
        {
            this._label.text = this._data.label;
        }
        else
        {
            this._label.text = this._data.toString();
        }
    }

    protected onMouseOver (event: MouseEvent): void
    {
        this.addEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        this._mouseOver = true;
        this.invalidate();
    }

    protected onMouseOut (event: MouseEvent): void
    {
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        this._mouseOver = false;
        this.invalidate();
    }

    set data (value: any)
    {
        this._data = value;
        this.invalidate();
    }

    get data (): any
    {
        return this._data;
    }

    set selected (value: boolean)
    {
        this._selected = value;
        this.invalidate();
    }

    get selected (): boolean
    {
        return this._selected;
    }

    set defaultColor (value: number)
    {
        this._defaultColor = value;
        this.invalidate();
    }

    get defaultColor (): number
    {
        return this._defaultColor;
    }

    set selectedColor (value: number)
    {
        this._selectedColor = value;
        this.invalidate();
    }

    get selectedColor (): number
    {
        return this._selectedColor;
    }

    set rolloverColor (value: number)
    {
        this._rolloverColor = value;
        this.invalidate();
    }

    get rolloverColor (): number
    {
        return this._rolloverColor;
    }
}
