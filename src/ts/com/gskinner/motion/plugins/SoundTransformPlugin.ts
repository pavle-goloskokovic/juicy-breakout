import { GTween } from '../GTween';
import type { IGTweenPlugin } from './IGTweenPlugin';
import { Sound } from '../../../../flash/media/Sound';
import { SoundChannel } from '../../../../flash/media/SoundChannel';
import type { SoundTransform } from '../../../../flash/media/SoundTransform';
export class SoundTransformPlugin implements IGTweenPlugin {
    static enabled = true;
    protected static instance: SoundTransformPlugin;
    protected static tweenProperties: any[] = ['leftToLeft', 'leftToRight', 'pan', 'rightToLeft', 'rightToRight', 'volume'];
    static install (): void
    {
        if (SoundTransformPlugin.instance)
        {
            return;
        }
        SoundTransformPlugin.instance = new SoundTransformPlugin();
        GTween.installPlugin(SoundTransformPlugin.instance, SoundTransformPlugin.tweenProperties, true);
    }

    init (tween: GTween, name: string, value: number): number
    {
        if (!(SoundTransformPlugin.enabled && tween.pluginData.SoundTransformEnabled == null || tween.pluginData.SoundTransformEnabled))
        {
            return value;
        }
        return tween.target.soundTransform[name];
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(SoundTransformPlugin.enabled && tween.pluginData.SoundTransformEnabled == null || tween.pluginData.SoundTransformEnabled))
        {
            return value;
        }
        const soundTransform: SoundTransform = tween.target.soundTransform;
        soundTransform[name] = value;
        tween.target.soundTransform = soundTransform;
        return NaN;
    }
}
