import { Component } from './Component';
import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
[Event(name = 'resize', type = 'flash.events.Event')];
export class HBox extends Component {
    protected _spacing = 5;
    private _alignment: string = NONE;
    static TOP = 'top';
    static BOTTOM = 'bottom';
    static MIDDLE = 'middle';
    static NONE = 'none';
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0)
    {
        super(parent, xpos, ypos);
    }

    addChild (child: DisplayObject): DisplayObject
    {
        super.addChild(child);
        child.addEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }

    addChildAt (child: DisplayObject, index: number): DisplayObject
    {
        super.addChildAt(child, index);
        child.addEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }

    removeChild (child: DisplayObject): DisplayObject
    {
        super.removeChild(child);
        child.removeEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }

    removeChildAt (index: number): DisplayObject
    {
        const child: DisplayObject = super.removeChildAt(index);
        child.removeEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }

    protected onResize (event: Event): void
    {
        this.invalidate();
    }

    protected doAlignment (): void
    {
        if (this._alignment != HBox.NONE)
        {
            for (let i = 0; i < this.numChildren; i++)
            {
                const child: DisplayObject = this.getChildAt(i);
                if (this._alignment == HBox.TOP)
                {
                    child.y = 0;
                }
                else if (this._alignment == HBox.BOTTOM)
                {
                    child.y = this._height - child.height;
                }
                else if (this._alignment == HBox.MIDDLE)
                {
                    child.y = (this._height - child.height) / 2;
                }
            }
        }
    }

    draw (): void
    {
        this._width = 0;
        this._height = 0;
        let xpos = 0;
        for (let i = 0; i < this.numChildren; i++)
        {
            const child: DisplayObject = this.getChildAt(i);
            child.x = xpos;
            xpos += child.width;
            xpos += this._spacing;
            this._width += child.width;
            this._height = Math.max(this._height, child.height);
        }
        this.doAlignment();
        this._width += this._spacing * (this.numChildren - 1);
        dispatchEvent(new Event(Event.RESIZE));
    }

    set spacing (s: number)
    {
        this._spacing = s;
        this.invalidate();
    }

    get spacing (): number
    {
        return this._spacing;
    }

    set alignment (value: string)
    {
        this._alignment = value;
        this.invalidate();
    }

    get alignment (): string
    {
        return this._alignment;
    }
}
