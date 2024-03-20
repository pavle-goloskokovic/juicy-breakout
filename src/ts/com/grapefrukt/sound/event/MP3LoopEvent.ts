import type { MP3LoopBase } from '../MP3LoopBase';
import { Event } from '../../../../flash/events/Event';
export class MP3LoopEvent extends Event {
    public static PLAY = 'mp3loopevent_play';
    public static STOP = 'mp3loopevent_stop';
    public static COMPLETE = 'mp3loopevent_complete';
    private _loop: MP3LoopBase;
    public constructor (type: string, loop: MP3LoopBase)
    {
        super(type, bubbles, cancelable);
        this._loop = loop;
    }

    public clone (): Event
    {
        return new MP3LoopEvent(this.type, this._loop);
    }

    public toString (): string
    {
        return this.formatToString('MP3LoopEvent', 'type', 'bubbles', 'cancelable', 'eventPhase');
    }

    public get loop (): MP3LoopBase
    {
        return this._loop;
    }
}