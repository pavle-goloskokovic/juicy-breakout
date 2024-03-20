import { Component } from './Component';
import { Style } from './Style';
import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
export class Panel extends Component {
    protected _mask: Sprite;
    protected _background: Sprite;
    protected _color = -1;
    protected _shadow = true;
    protected _gridSize = 10;
    protected _showGrid = false;
    protected _gridColor = 0xd0d0d0;
    content: Sprite;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0)
    {
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 100);
    }

    protected addChildren (): void
    {
        this._background = new Sprite();
        super.addChild(this._background);
        this._mask = new Sprite();
        this._mask.mouseEnabled = false;
        super.addChild(this._mask);
        this.content = new Sprite();
        super.addChild(this.content);
        this.content.mask = this._mask;
        this.filters = [this.getShadow(2, true)];
    }

    addChild (child: DisplayObject): DisplayObject
    {
        this.content.addChild(child);
        return child;
    }

    addRawChild (child: DisplayObject): DisplayObject
    {
        super.addChild(child);
        return child;
    }

    draw (): void
    {
        super.draw();
        this._background.graphics.clear();
        this._background.graphics.lineStyle(1, 0, 0.1);
        if (this._color == -1 )
        {
            this._background.graphics.beginFill(Style.PANEL);
        }
        else
        {
            this._background.graphics.beginFill(this._color);
        }
        this._background.graphics.drawRect(0, 0, this._width, this._height);
        this._background.graphics.endFill();
        this.drawGrid();
        this._mask.graphics.clear();
        this._mask.graphics.beginFill(0xff0000);
        this._mask.graphics.drawRect(0, 0, this._width, this._height);
        this._mask.graphics.endFill();
    }

    protected drawGrid (): void
    {
        if (!this._showGrid )
        {
            return;
        }
        this._background.graphics.lineStyle(0, this._gridColor);
        for (let i = 0; i < this._width; i += this._gridSize)
        {
            this._background.graphics.moveTo(i, 0);
            this._background.graphics.lineTo(i, this._height);
        }
        for (i = 0; i < this._height; i += this._gridSize)
        {
            this._background.graphics.moveTo(0, i);
            this._background.graphics.lineTo(this._width, i);
        }
    }

    set shadow (b: boolean)
    {
        this._shadow = b;
        if (this._shadow )
        {
            this.filters = [this.getShadow(2, true)];
        }
        else
        {
            this.filters = [];
        }
    }

    get shadow (): boolean
    {
        return this._shadow;
    }

    set color (c: number)
    {
        this._color = c;
        this.invalidate();
    }

    get color (): number
    {
        return this._color;
    }

    set gridSize (value: number)
    {
        this._gridSize = value;
        this.invalidate();
    }

    get gridSize (): number
    {
        return this._gridSize;
    }

    set showGrid (value: boolean)
    {
        this._showGrid = value;
        this.invalidate();
    }

    get showGrid (): boolean
    {
        return this._showGrid;
    }

    set gridColor (value: number)
    {
        this._gridColor = value;
        this.invalidate();
    }

    get gridColor (): number
    {
        return this._gridColor;
    }
}
