import { Component } from './Component';
import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
[Event(name = 'resize', type = 'flash.events.Event')];
export class VBox extends Component {
    protected _spacing = 5;
    private _alignment: string = NONE;
    static LEFT = 'left';
    static RIGHT = 'right';
    static CENTER = 'center';
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
        if (this._alignment != VBox.NONE )
        {
            for (let i = 0; i < this.numChildren; i++)
            {
                const child: DisplayObject = this.getChildAt(i);
                if (this._alignment == VBox.LEFT )
                {
                    child.x = 0;
                }
                else if (this._alignment == VBox.RIGHT )
                {
                    child.x = this._width - child.width;
                }
                else if (this._alignment == VBox.CENTER )
                {
                    child.x = (this._width - child.width) / 2;
                }
            }
        }
    }

    draw (): void
    {
        this._width = 0;
        this._height = 0;
        let ypos = 0;
        for (let i = 0; i < this.numChildren; i++)
        {
            const child: DisplayObject = this.getChildAt(i);
            child.y = ypos;
            ypos += child.height;
            ypos += this._spacing;
            this._height += child.height;
            this._width = Math.max(this._width, child.width);
        }
        this.doAlignment();
        this._height += this._spacing * (this.numChildren - 1);
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
