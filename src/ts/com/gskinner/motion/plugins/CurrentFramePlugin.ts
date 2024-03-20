import { GTween } from '../GTween';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class CurrentFramePlugin implements IGTweenPlugin {
    static enabled = true;
    protected static instance: CurrentFramePlugin;
    static install (): void
    {
        if (CurrentFramePlugin.instance)
        {
            return;
        }
        CurrentFramePlugin.instance = new CurrentFramePlugin();
        GTween.installPlugin(CurrentFramePlugin.instance, ['currentFrame']);
    }

    init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(tween.pluginData.CurrentFrameEnabled == null && CurrentFramePlugin.enabled || tween.pluginData.CurrentFrameEnabled))
        {
            return value;
        }
        const frame: number = Math.round(initValue + rangeValue * ratio);
        if (tween.target.currentFrame != frame)
        {
            tween.target.gotoAndStop(frame);
        }
        return NaN;
    }
}
