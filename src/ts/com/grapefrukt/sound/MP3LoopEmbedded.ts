import { MP3LoopBase } from './MP3LoopBase';
import { TimerEvent } from '../../../flash/events/TimerEvent';
import type { Sound } from '../../../flash/media/Sound';
import { Timer } from '../../../flash/utils/Timer';
export class MP3LoopEmbedded extends MP3LoopBase {
    constructor (soundClass: Class, autoLoad: boolean, loops = 0)
    {
        super('', false, false, loops);
        this._out = new soundClass() as Sound;
        if (autoLoad )
        {
            this.load();
        }
    }

    load (): void
    {
        this.handleLoadComplete(null);
    }
}
