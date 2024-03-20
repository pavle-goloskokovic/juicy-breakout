import { GTween } from '../GTween';
import { BlurFilter } from '../../../../flash/filters/BlurFilter';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class MotionBlurPlugin implements IGTweenPlugin {
    static enabled = false;
    static strength = 0.6;
    protected static instance: MotionBlurPlugin;
    static install (): void
    {
        if (MotionBlurPlugin.instance)
        {
            return;
        }
        MotionBlurPlugin.instance = new MotionBlurPlugin();
        GTween.installPlugin(MotionBlurPlugin.instance, ['x', 'y']);
    }

    init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(MotionBlurPlugin.enabled && tween.pluginData.MotionBlurEnabled == null || tween.pluginData.MotionBlurEnabled))
        {
            return value;
        }
        let data: any = tween.pluginData.MotionBlurData;
        if (data == null)
        {
            data = this.initTarget(tween);
        }
        const f: any[] = tween.target.filters;
        const blurF: BlurFilter = f[data.index] as BlurFilter;
        if (blurF == null)
        {
            return value;
        }
        if (end)
        {
            f.splice(data.index, 1);
            delete tween.pluginData.MotionBlurData;
        }
        else
        {
            const blur: number = Math.abs((tween.ratioOld - ratio) * rangeValue * MotionBlurPlugin.strength);
            if (name == 'x')
            {
                blurF.blurX = blur;
            }
            else
            {
                blurF.blurY = blur;
            }
        }
        tween.target.filters = f;
        return value;
    }

    protected initTarget (tween: GTween): any
    {
        const f: any[] = tween.target.filters;
        f.push(new BlurFilter(0, 0, 1));
        tween.target.filters = f;
        return tween.pluginData.MotionBlurData = { index: f.length - 1 };
    }
}
