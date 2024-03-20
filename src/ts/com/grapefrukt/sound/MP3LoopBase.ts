import { MP3LoopEvent } from './event/MP3LoopEvent';
import { Event } from '../../../flash/events/Event';
import { EventDispatcher } from '../../../flash/events/EventDispatcher';
import { IOErrorEvent } from '../../../flash/events/IOErrorEvent';
import { ProgressEvent } from '../../../flash/events/ProgressEvent';
import { TimerEvent } from '../../../flash/events/TimerEvent';
import { Sound } from '../../../flash/media/Sound';
import type { SoundChannel } from '../../../flash/media/SoundChannel';
import { URLRequest } from '../../../flash/net/URLRequest';
import { Timer } from '../../../flash/utils/Timer';
export class MP3LoopBase extends EventDispatcher {
    static ASSET_CLASS: Class;
    protected _out: Sound;
    protected _play_on_load = false;
    protected _state: number = NOT_LOADED;
    protected _playing = false;
    protected _loops = 0;
    protected _url = '';
    protected _out_channel: SoundChannel;
    protected _bytes_total = 0;
    protected _bytes_loaded = 0;
    protected static NOT_LOADED = 0;
    protected static LOADING = 1;
    protected static LOADED = 2;
    constructor (url: string, autoLoad = false, playOnLoad = false, loops = 0)
    {
        super();
        this._url = url;
        this._loops = loops;
        this.playOnLoad = playOnLoad;
        this._out = new Sound();
        if (autoLoad && this._url)
        {
            this.load();
        }
    }

    load (): void
    {
        console.log('MP3LoopBase, load()', this._state);
        if (this.loaded || this.loading)
        {
            return;
        }
        if (MP3LoopBase.ASSET_CLASS)
        {
            this._state = MP3LoopBase.LOADING;
            this._out = new MP3LoopBase.ASSET_CLASS[this._url.substr(0, this._url.length - 4)]() as Sound;
            const t: Timer = new Timer(100, 1);
            t.addEventListener(TimerEvent.TIMER_COMPLETE, function (): void
            {
                t.removeEventListener(TimerEvent.TIMER_COMPLETE, arguments.callee);
                this.handleLoadComplete(null);
            });
            t.start();
        }
        else
        {
            this._state = MP3LoopBase.LOADING;
            this._out.addEventListener(Event.COMPLETE, this.handleLoadComplete);
            this._out.addEventListener(ProgressEvent.PROGRESS, this.handleProgress);
            this._out.addEventListener(IOErrorEvent.IO_ERROR, this.handleLoadError);
            this._out.load(new URLRequest(this._url));
        }
    }

    private handleProgress (e: ProgressEvent): void
    {
        this._bytes_total = this._out.bytesTotal;
        this._bytes_loaded = this._out.bytesLoaded;
        dispatchEvent(e);
    }

    protected handleLoadComplete (event: Event): void
    {
        console.log('MP3LoopBase, handleLoadComplete()', this._state);
        this._state = MP3LoopBase.LOADED;
        dispatchEvent(new MP3LoopEvent(MP3LoopEvent.COMPLETE, this));
        if (this._play_on_load)
        {
            this.play();
        }
    }

    play (): boolean
    {
        console.log('playing loop, state:', this._state);
        if (this._playing || !this.loaded)
        {
            return false;
        }
        this._out_channel = this._out.play(0, this._loops);
        this._playing = true;
        dispatchEvent(new MP3LoopEvent(MP3LoopEvent.PLAY, this));
        return true;
    }

    stop (): boolean
    {
        if (!this._playing)
        {
            return false;
        }
        this._out_channel.stop();
        this._playing = false;
        dispatchEvent(new MP3LoopEvent(MP3LoopEvent.STOP, this));
        return true;
    }

    private handleLoadError (event: IOErrorEvent): void
    {
        console.log(event);
    }

    get loaded (): boolean
    {
        return this._state == MP3LoopBase.LOADED;
    }

    get loading (): boolean
    {
        return this._state == MP3LoopBase.LOADING;
    }

    get soundChannel (): SoundChannel
    {
        return this._out_channel;
    }

    get playOnLoad (): boolean
    {
        return this._play_on_load;
    }

    set playOnLoad (value: boolean)
    {
        this._play_on_load = value;
    }

    get playing (): boolean
    {
        return this._playing;
    }

    get bytesTotal (): number
    {
        return this._bytes_total;
    }

    get bytesLoaded (): number
    {
        return this._bytes_loaded;
    }
}
