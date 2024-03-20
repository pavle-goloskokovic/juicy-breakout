import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { Sound } from '../../../flash/media/Sound';
import type { SoundChannel } from '../../../flash/media/SoundChannel';
import { SoundTransform } from '../../../flash/media/SoundTransform';
export class SoundUtil {
    static stageWidth = 800;
    static stereoSeparation = 0.75;
    static globalVolume = 1;
    static playAtSprite (sound: Sound, target: DisplayObject = null, volume = 1, loops = 0): SoundChannel
    {
        return SoundUtil.play(sound, volume, SoundUtil.getPan(target), loops);
    }

    static playClassAtSprite (soundClass: Class, target: DisplayObject = null, volume = 1, loops = 0): SoundChannel
    {
        return SoundUtil.playAtSprite(SoundUtil.getClassAsSound(soundClass), target, volume, loops);
    }

    static play (sound: Sound, volume = 1, pan = 0, loops = 0): SoundChannel
    {
        return sound.play(0, loops, SoundUtil.generateTransform(volume, pan));
    }

    static playClass (soundClass: Class, volume = 1, pan = 0, loops = 0): SoundChannel
    {
        return SoundUtil.play(SoundUtil.getClassAsSound(soundClass), volume, pan, loops);
    }

    static getClassAsSound (soundClass: Class): Sound
    {
        return new soundClass() as Sound;
    }

    static generateTransform (volume = 1, pan = 0): SoundTransform
    {
        const st: SoundTransform = new SoundTransform();
        st.volume = SoundUtil.wrapVol(volume / 10) * 2 * SoundUtil.globalVolume;
        st.pan = SoundUtil.wrapPan(pan);
        return st;
    }

    static setNewTransform (soundChannel: SoundChannel, volume = 1, pan = 0): void
    {
        soundChannel.soundTransform = SoundUtil.generateTransform(volume, pan);
    }

    static updateTransformAtSprite (soundChannel: SoundChannel, target: DisplayObject = null, volume = 1): void
    {
        SoundUtil.setNewTransform(soundChannel, volume, SoundUtil.getPan(target));
    }

    private static getPan (target: DisplayObject): number
    {
        const pan: number = target.x / SoundUtil.stageWidth * 2 - 1;
        return pan * SoundUtil.stereoSeparation;
    }

    private static wrapVol (num: number): number
    {
        if (num > 1 )
        {
            num = 1;
        }
        if (num < 0 )
        {
            num = 0;
        }
        return num;
    }

    private static wrapPan (num: number): number
    {
        if (num > 1 )
        {
            num = 1;
        }
        if (num < -1 )
        {
            num = -1;
        }
        return num;
    }
}
