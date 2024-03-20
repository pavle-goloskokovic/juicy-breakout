import { IOError } from '../../../../flash/errors/IOError';
import { Event } from '../../../../flash/events/Event';
import { EventDispatcher } from '../../../../flash/events/EventDispatcher';
import { IOErrorEvent } from '../../../../flash/events/IOErrorEvent';
import { ProgressEvent } from '../../../../flash/events/ProgressEvent';
import { TimerEvent } from '../../../../flash/events/TimerEvent';
import { Sound } from '../../../../flash/media/Sound';
import type { SoundChannel } from '../../../../flash/media/SoundChannel';
import { SoundTransform } from '../../../../flash/media/SoundTransform';
import { URLRequest } from '../../../../flash/net/URLRequest';
import { Timer } from '../../../../flash/utils/Timer';
export class SoundObject extends EventDispatcher {
    private _sound: Sound;
    private _sound_channel: SoundChannel;
    private _sound_transform: SoundTransform;
    private _id: string;
    private _file: string;
    private _volume: number;
    private _pan: number;
    private _startTime: number;
    private _loops: number;
    private _embed_class: Class;
    constructor (id: string, file: string, volume: number, pan: number, startTime: number, loops: number, embedClass: Class = null)
    {
        super();
        this._id = id;
        this._file = file;
        this._volume = volume;
        this._pan = pan;
        this._startTime = startTime;
        this._loops = loops;
        this._embed_class = embedClass;
        this._sound_transform = new SoundTransform(this._volume, this._pan);
    }

    load (basePath: string): void
    {
        if (this._embed_class )
        {
            this._sound = new this._embed_class[this._file.substr(0, this._file.length - 4)]() as Sound;
            const t: Timer = new Timer(100, 1);
            t.addEventListener(TimerEvent.TIMER_COMPLETE, function (): void
            {
                t.removeEventListener(TimerEvent.TIMER_COMPLETE, arguments.callee);
                dispatchEvent(new Event(Event.COMPLETE));
            });
            t.start();
        }
        else
        {
            this._sound = new Sound(new URLRequest(basePath + this._file));
            this._sound.addEventListener(Event.COMPLETE, this.handleSoundLoaded);
            this._sound.addEventListener(IOErrorEvent.IO_ERROR, this.handleLoadError);
            this._sound.addEventListener(ProgressEvent.PROGRESS, this.handleLoadProgress);
        }
    }

    private handleLoadProgress (e: ProgressEvent): void
    {
        dispatchEvent(e);
    }

    play (): void
    {
        this._sound_channel = this._sound.play(this._startTime, this._loops, this._sound_transform);
    }

    stop (): void
    {
        if (!this._sound_channel )
        {
            return;
        }
        this._sound_channel.stop();
        this._sound_channel = null;
    }

    private handleSoundLoaded (event: Event): void
    {
        this._sound.removeEventListener(Event.COMPLETE, this.handleSoundLoaded);
        dispatchEvent(new Event(Event.COMPLETE));
    }

    private handleLoadError (e: IOErrorEvent): void
    {
        console.log('could not load sound: ', this._id);
    }

    get id (): string
    {
        return this._id;
    }

    get bytesTotal (): number
    {
        return this._sound.bytesTotal;
    }

    get bytesLoaded (): number
    {
        return this._sound.bytesLoaded;
    }

    get isPlaying (): boolean
    {
        return this._sound_channel != null;
    }
}
