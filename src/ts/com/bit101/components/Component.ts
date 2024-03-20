import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import type { Stage } from '../../../flash/display/Stage';
import { StageAlign } from '../../../flash/display/StageAlign';
import { StageScaleMode } from '../../../flash/display/StageScaleMode';
import { Event } from '../../../flash/events/Event';
import { DropShadowFilter } from '../../../flash/filters/DropShadowFilter';
[Event(name = 'resize', type = 'flash.events.Event')][Event(name = 'draw', type = 'flash.events.Event')];
export class Component extends Sprite {
    protected Ronda: Class;
    protected _width = 0;
    protected _height = 0;
    protected _tag = -1;
    protected _enabled = true;
    public static DRAW = 'draw';
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0)
    {
        super();
        this.move(xpos, ypos);
        this.init();
        if (parent != null )
        {
            parent.addChild(this);
        }
    }

    protected init (): void
    {
        this.addChildren();
        this.invalidate();
    }

    protected addChildren (): void
    {

    }

    protected getShadow (dist: number, knockout = false): DropShadowFilter
    {
        return new DropShadowFilter(dist, 45, Style.DROPSHADOW, 1, dist, dist, .3, 1, knockout);
    }

    protected invalidate (): void
    {
        this.addEventListener(Event.ENTER_FRAME, this.onInvalidate);
    }

    public static initStage (stage: Stage): void
    {
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;
    }

    public move (xpos: number, ypos: number): void
    {
        this.x = Math.round(xpos);
        this.y = Math.round(ypos);
    }

    public setSize (w: number, h: number): void
    {
        this._width = w;
        this._height = h;
        dispatchEvent(new Event(Event.RESIZE));
        this.invalidate();
    }

    public draw (): void
    {
        dispatchEvent(new Event(Component.DRAW));
    }

    protected onInvalidate (event: Event): void
    {
        this.removeEventListener(Event.ENTER_FRAME, this.onInvalidate);
        this.draw();
    }

    public set width (w: number)
    {
        this._width = w;
        this.invalidate();
        dispatchEvent(new Event(Event.RESIZE));
    }

    public get width (): number
    {
        return this._width;
    }

    public set height (h: number)
    {
        this._height = h;
        this.invalidate();
        dispatchEvent(new Event(Event.RESIZE));
    }

    public get height (): number
    {
        return this._height;
    }

    public set tag (value: number)
    {
        this._tag = value;
    }

    public get tag (): number
    {
        return this._tag;
    }

    public set x (value: number)
    {
        super.x = Math.round(value);
    }

    public set y (value: number)
    {
        super.y = Math.round(value);
    }

    public set enabled (value: boolean)
    {
        this._enabled = value;
        this.mouseEnabled = (this.mouseChildren = this._enabled);
        this.tabEnabled = value;
        this.alpha = this._enabled ? 1.0 : 0.5;
    }

    public get enabled (): boolean
    {
        return this._enabled;
    }
}