import type { MP3LoopBase } from './MP3LoopBase';
import { GTween } from '../../gskinner/motion/GTween';
import { SoundTransform } from '../../../flash/media/SoundTransform';
export class MP3LoopController {
    private _loop: MP3LoopBase;
    private _next_music: MP3LoopBase;
    private _gtween: GTween;
    private _volume: number = 0;
    public constructor (loop: MP3LoopBase)
    {
        this._loop = loop;
        this._gtween = new GTween(this, 1);
        this._gtween.onChange = this.handleTweenChange;
        this._gtween.onComplete = this.handleTweenComplete;
    }

    private handleTweenComplete (g: GTween): void
    {
        if (this._volume == 0 )
        {
            this._loop.stop();
        }
    }

    private handleTweenChange (g: GTween): void
    {
        if (!this._loop.soundChannel )
        {
            return;
        }
        const soundTransform: SoundTransform = this._loop.soundChannel.soundTransform;
        soundTransform.volume = this._volume;
        this._loop.soundChannel.soundTransform = soundTransform;
    }

    public tweenVolume (value: number): void
    {
        this._gtween.proxy.volume = value;
        if (value > 0 && !this._loop.playing )
        {
            this._loop.play();
        }
    }

    public play (): boolean
    {
        if (!this._loop.play() )
        {
            return false;
        }
        this._loop.soundChannel.soundTransform = new SoundTransform(this._volume);
        if (this._next_music && !this._next_music.loaded )
        {
            this._next_music.load();
        }
        return true;
    }

    public setNextMusic (value: MP3LoopBase): void
    {
        this._next_music = value;
    }

    public get volume (): number
    {
        return this._volume;
    }

    public set volume (value: number)
    {
        this._volume = value;
    }

    public get loop (): MP3LoopBase
    {
        return this._loop;
    }
}