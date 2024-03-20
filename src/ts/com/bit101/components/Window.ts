import { Component } from './Component';
import { Panel } from './Panel';
import { Label } from './Label';
import { PushButton } from './PushButton';
import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Shape } from '../../../flash/display/Shape';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
[Event(name = 'select', type = 'flash.events.Event')][Event(name = 'close', type = 'flash.events.Event')][Event(name = 'resize', type = 'flash.events.Event')];
export class Window extends Component {
    protected _title: string;
    protected _titleBar: Panel;
    protected _titleLabel: Label;
    protected _panel: Panel;
    protected _color: number = -1;
    protected _shadow: boolean = true;
    protected _draggable: boolean = true;
    protected _minimizeButton: Sprite;
    protected _hasMinimizeButton: boolean = false;
    protected _minimized: boolean = false;
    protected _hasCloseButton: boolean;
    protected _closeButton: PushButton;
    protected _grips: Shape;
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, title: string = 'Window')
    {
        this._title = title;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 100);
    }

    protected addChildren (): void
    {
        this._titleBar = new Panel();
        this._titleBar.filters = [];
        this._titleBar.buttonMode = true;
        this._titleBar.useHandCursor = true;
        this._titleBar.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
        this._titleBar.height = 20;
        super.addChild(this._titleBar);
        this._titleLabel = new Label(this._titleBar.content, 5, 1, this._title);
        this._grips = new Shape();
        for (let i: number = 0; i < 4; i++)
        {
            this._grips.graphics.lineStyle(1, 0xffffff, .55);
            this._grips.graphics.moveTo(0, 3 + i * 4);
            this._grips.graphics.lineTo(100, 3 + i * 4);
            this._grips.graphics.lineStyle(1, 0, .125);
            this._grips.graphics.moveTo(0, 4 + i * 4);
            this._grips.graphics.lineTo(100, 4 + i * 4);
        }
        this._titleBar.content.addChild(this._grips);
        this._grips.visible = false;
        this._panel = new Panel(null, 0, 20);
        this._panel.visible = !this._minimized;
        super.addChild(this._panel);
        this._minimizeButton = new Sprite();
        this._minimizeButton.graphics.beginFill(0, 0);
        this._minimizeButton.graphics.drawRect(-10, -10, 20, 20);
        this._minimizeButton.graphics.endFill();
        this._minimizeButton.graphics.beginFill(0, .35);
        this._minimizeButton.graphics.moveTo(-5, -3);
        this._minimizeButton.graphics.lineTo(5, -3);
        this._minimizeButton.graphics.lineTo(0, 4);
        this._minimizeButton.graphics.lineTo(-5, -3);
        this._minimizeButton.graphics.endFill();
        this._minimizeButton.x = 10;
        this._minimizeButton.y = 10;
        this._minimizeButton.useHandCursor = true;
        this._minimizeButton.buttonMode = true;
        this._minimizeButton.addEventListener(MouseEvent.CLICK, this.onMinimize);
        this._closeButton = new PushButton(null, 86, 6, '', this.onClose);
        this._closeButton.setSize(8, 8);
        this.filters = [this.getShadow(4, false)];
    }

    public addChild (child: DisplayObject): DisplayObject
    {
        this.content.addChild(child);
        return child;
    }

    public addRawChild (child: DisplayObject): DisplayObject
    {
        super.addChild(child);
        return child;
    }

    public draw (): void
    {
        super.draw();
        this._titleBar.color = this._color;
        this._panel.color = this._color;
        this._titleBar.width = this.width;
        this._titleBar.draw();
        this._titleLabel.x = this._hasMinimizeButton ? 20 : 5;
        this._closeButton.x = this._width - 14;
        this._grips.x = this._titleLabel.x + this._titleLabel.width;
        if (this._hasCloseButton )
        {
            this._grips.width = this._closeButton.x - this._grips.x - 2;
        }
        else
        {
            this._grips.width = this._width - this._grips.x - 2;
        }
        this._panel.setSize(this._width, this._height - 20);
        this._panel.draw();
    }

    protected onMouseGoDown (event: MouseEvent): void
    {
        if (this._draggable )
        {
            this.startDrag();
            this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
            this.parent.addChild(this);
        }
        dispatchEvent(new Event(Event.SELECT));
    }

    protected onMouseGoUp (event: MouseEvent): void
    {
        this.stopDrag();
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }

    protected onMinimize (event: MouseEvent): void
    {
        this.minimized = !this.minimized;
    }

    protected onClose (event: MouseEvent): void
    {
        dispatchEvent(new Event(Event.CLOSE));
    }

    public set shadow (b: boolean)
    {
        this._shadow = b;
        if (this._shadow )
        {
            this.filters = [this.getShadow(4, false)];
        }
        else
        {
            this.filters = [];
        }
    }

    public get shadow (): boolean
    {
        return this._shadow;
    }

    public set color (c: number)
    {
        this._color = c;
        this.invalidate();
    }

    public get color (): number
    {
        return this._color;
    }

    public set title (t: string)
    {
        this._title = t;
        this._titleLabel.text = this._title;
    }

    public get title (): string
    {
        return this._title;
    }

    public get content (): DisplayObjectContainer
    {
        return this._panel.content;
    }

    public set draggable (b: boolean)
    {
        this._draggable = b;
        this._titleBar.buttonMode = this._draggable;
        this._titleBar.useHandCursor = this._draggable;
    }

    public get draggable (): boolean
    {
        return this._draggable;
    }

    public set hasMinimizeButton (b: boolean)
    {
        this._hasMinimizeButton = b;
        if (this._hasMinimizeButton )
        {
            super.addChild(this._minimizeButton);
        }
        else if (this.contains(this._minimizeButton) )
        {
            this.removeChild(this._minimizeButton);
        }
        this.invalidate();
    }

    public get hasMinimizeButton (): boolean
    {
        return this._hasMinimizeButton;
    }

    public set minimized (value: boolean)
    {
        this._minimized = value;
        if (this._minimized )
        {
            if (this.contains(this._panel) )
            {
                this.removeChild(this._panel);
            }
            this._minimizeButton.rotation = -90;
        }
        else
        {
            if (!this.contains(this._panel) )
            {
                super.addChild(this._panel);
            }
            this._minimizeButton.rotation = 0;
        }
        dispatchEvent(new Event(Event.RESIZE));
    }

    public get minimized (): boolean
    {
        return this._minimized;
    }

    public get height (): number
    {
        if (this.contains(this._panel) )
        {
            return super.height;
        }
        else
        {
            return 20;
        }
    }

    public set hasCloseButton (value: boolean)
    {
        this._hasCloseButton = value;
        if (this._hasCloseButton )
        {
            this._titleBar.content.addChild(this._closeButton);
        }
        else if (this._titleBar.content.contains(this._closeButton) )
        {
            this._titleBar.content.removeChild(this._closeButton);
        }
        this.invalidate();
    }

    public get hasCloseButton (): boolean
    {
        return this._hasCloseButton;
    }

    public get titleBar (): Panel
    {
        return this._titleBar;
    }

    public set titleBar (value: Panel)
    {
        this._titleBar = value;
    }

    public get grips (): Shape
    {
        return this._grips;
    }
}