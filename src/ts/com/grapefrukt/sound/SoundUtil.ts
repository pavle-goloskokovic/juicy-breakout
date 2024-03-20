import type { DisplayObject } from '../../../flash/display/DisplayObject';
import type { Sound } from '../../../flash/media/Sound';
import type { SoundChannel } from '../../../flash/media/SoundChannel';
import { SoundTransform } from '../../../flash/media/SoundTransform';
export class SoundUtil {
    public static stageWidth: number = 800;
    public static stereoSeparation: number = 0.75;
    public static globalVolume: number = 1;
    public static playAtSprite (sound: Sound, target: DisplayObject = null, volume: number = 1, loops: number = 0): SoundChannel
    {
        return SoundUtil.play(sound, volume, SoundUtil.getPan(target), loops);
    }

    public static playClassAtSprite (soundClass: Class, target: DisplayObject = null, volume: number = 1, loops: number = 0): SoundChannel
    {
        return SoundUtil.playAtSprite(SoundUtil.getClassAsSound(soundClass), target, volume, loops);
    }

    public static play (sound: Sound, volume: number = 1, pan: number = 0, loops: number = 0): SoundChannel
    {
        return sound.play(0, loops, SoundUtil.generateTransform(volume, pan));
    }

    public static playClass (soundClass: Class, volume: number = 1, pan: number = 0, loops: number = 0): SoundChannel
    {
        return SoundUtil.play(SoundUtil.getClassAsSound(soundClass), volume, pan, loops);
    }

    public static getClassAsSound (soundClass: Class): Sound
    {
        return new soundClass() as Sound;
    }

    public static generateTransform (volume: number = 1, pan: number = 0): SoundTransform
    {
        const st: SoundTransform = new SoundTransform();
        st.volume = SoundUtil.wrapVol(volume / 10) * 2 * SoundUtil.globalVolume;
        st.pan = SoundUtil.wrapPan(pan);
        return st;
    }

    public static setNewTransform (soundChannel: SoundChannel, volume: number = 1, pan: number = 0): void
    {
        soundChannel.soundTransform = SoundUtil.generateTransform(volume, pan);
    }

    public static updateTransformAtSprite (soundChannel: SoundChannel, target: DisplayObject = null, volume: number = 1): void
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