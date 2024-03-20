import { Component } from './Component';
import { Label } from './Label';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
import { getTimer } from '../../../flash/utils/getTimer';
export class FPSMeter extends Component {
    protected _label: Label;
    protected _startTime: number;
    protected _frames: number;
    protected _prefix = '';
    protected _fps = 0;
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, prefix = 'FPS:')
    {
        super(parent, xpos, ypos);
        this._prefix = prefix;
        this._frames = 0;
        this._startTime = getTimer();
        this.setSize(50, 20);
        if (this.stage != null )
        {
            this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        }
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._label = new Label(this, 0, 0);
    }

    public draw (): void
    {
        this._label.text = this._prefix + this._fps.toString();
    }

    protected onEnterFrame (event: Event): void
    {
        this._frames++;
        const time: number = getTimer();
        const elapsed: number = time - this._startTime;
        if (elapsed >= 1000 )
        {
            this._fps = Math.round(this._frames * 1000 / elapsed);
            this._frames = 0;
            this._startTime = time;
            this.draw();
        }
    }

    protected onRemovedFromStage (event: Event): void
    {
        this.stop();
    }

    public stop (): void
    {
        this.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }

    public start (): void
    {
        this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }

    public set prefix (value: string)
    {
        this._prefix = value;
    }

    public get prefix (): string
    {
        return this._prefix;
    }

    public get fps (): number
    {
        return this._fps;
    }
}