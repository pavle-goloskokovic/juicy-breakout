import { MP3LoopBase } from './MP3LoopBase';
import { MP3LoopEvent } from './event/MP3LoopEvent';
import { Sprite } from '../../../flash/display/Sprite';
import type { Event } from '../../../flash/events/Event';
import { EventDispatcher } from '../../../flash/events/EventDispatcher';
import { IOErrorEvent } from '../../../flash/events/IOErrorEvent';
import { ProgressEvent } from '../../../flash/events/ProgressEvent';
import { SampleDataEvent } from '../../../flash/events/SampleDataEvent';
import { Sound } from '../../../flash/media/Sound';
import { SoundChannel } from '../../../flash/media/SoundChannel';
import { URLRequest } from '../../../flash/net/URLRequest';
import type { ByteArray } from '../../../flash/utils/ByteArray';
export class MP3LoopGapless extends MP3LoopBase {
    private MAGIC_DELAY = 2257.0;
    private BUFFER_SIZE = 2048;
    private _samples_total = 0;
    private _mp3: Sound;
    private _samples_position = 0;
    constructor (samplesTotal: number, url = '', autoLoad = false, playOnLoad = false)
    {
        super(url, autoLoad, playOnLoad);
        this._samples_total = samplesTotal;
        if (this._samples_total == 0 )
        {
            throw new Error('sound must be longer than zero samples');
        }
        this._mp3 = new Sound();
    }

    protected handleLoadComplete (event: Event): void
    {
        this._mp3 = this._out;
        this._out = new Sound();
        super.handleLoadComplete(event);
    }

    play (): boolean
    {
        if (this._playing || !this.loaded )
        {
            return false;
        }
        this._out.addEventListener(SampleDataEvent.SAMPLE_DATA, this.handleSampleDataRequest);
        super.play();
        return true;
    }

    stop (): boolean
    {
        if (!super.stop() )
        {
            return false;
        }
        this._out.removeEventListener(SampleDataEvent.SAMPLE_DATA, this.handleSampleDataRequest);
        return true;
    }

    private handleSampleDataRequest (event: SampleDataEvent): void
    {
        this.extract(event.data, this.BUFFER_SIZE);
    }

    private extract (target: ByteArray, length: number): void
    {
        while (0 < length)
        {
            if (this._samples_position + length > this._samples_total )
            {
                const read: number = this._samples_total - this._samples_position;
                this._mp3.extract(target, read, this._samples_position + this.MAGIC_DELAY);
                this._samples_position += read;
                length -= read;
            }
            else
            {
                this._mp3.extract(target, length, this._samples_position + this.MAGIC_DELAY);
                this._samples_position += length;
                length = 0;
            }
            if (this._samples_position == this._samples_total )
            {
                this._samples_position = 0;
            }
        }
    }
}
