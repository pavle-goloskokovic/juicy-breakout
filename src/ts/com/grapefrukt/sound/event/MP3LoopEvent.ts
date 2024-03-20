import type { MP3LoopBase } from '../MP3LoopBase';
import { Event } from '../../../../flash/events/Event';
export class MP3LoopEvent extends Event {
    static PLAY = 'mp3loopevent_play';
    static STOP = 'mp3loopevent_stop';
    static COMPLETE = 'mp3loopevent_complete';
    private _loop: MP3LoopBase;
    constructor (type: string, loop: MP3LoopBase)
    {
        super(type, bubbles, cancelable);
        this._loop = loop;
    }

    clone (): Event
    {
        return new MP3LoopEvent(this.type, this._loop);
    }

    toString (): string
    {
        return this.formatToString('MP3LoopEvent', 'type', 'bubbles', 'cancelable', 'eventPhase');
    }

    get loop (): MP3LoopBase
    {
        return this._loop;
    }
}
