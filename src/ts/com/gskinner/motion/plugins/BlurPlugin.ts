import { GTween } from '../GTween';
import { BlurFilter } from '../../../../flash/filters/BlurFilter';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class BlurPlugin implements IGTweenPlugin {
    public static enabled = true;
    protected static instance: BlurPlugin;
    protected static tweenProperties: any[] = ['blurX', 'blurY', 'blur'];
    public static install (): void
    {
        if (BlurPlugin.instance )
        {
            return;
        }
        BlurPlugin.instance = new BlurPlugin();
        GTween.installPlugin(BlurPlugin.instance, BlurPlugin.tweenProperties);
    }

    public init (tween: GTween, name: string, value: number): number
    {
        if (!(tween.pluginData.BlurEnabled == null && BlurPlugin.enabled || tween.pluginData.BlurEnabled) )
        {
            return value;
        }
        const f: any[] = tween.target.filters;
        for (let i = 0; i < f.length; i++)
        {
            if (f[i] instanceof BlurFilter )
            {
                const blurF: BlurFilter = f[i];
                tween.pluginData.BlurData = { index: i };
                if (name == 'blur' )
                {
                    return (blurF.blurX + blurF.blurY) / 2;
                }
                else
                {
                    return blurF[name];
                }
            }
        }
        return 0;
    }

    public tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(tween.pluginData.BlurEnabled == null && BlurPlugin.enabled || tween.pluginData.BlurEnabled) )
        {
            return value;
        }
        let data: any = tween.pluginData.BlurData;
        if (data == null )
        {
            data = this.initTarget(tween);
        }
        const f: any[] = tween.target.filters;
        const blurF: BlurFilter = f[data.index] as BlurFilter;
        if (blurF == null )
        {
            return value;
        }
        if (name == 'blur' )
        {
            blurF.blurX = (blurF.blurY = value);
        }
        else
        {
            blurF[name] = value;
        }
        tween.target.filters = f;
        if (end )
        {
            delete tween.pluginData.BlurData;
        }
        return NaN;
    }

    protected initTarget (tween: GTween): any
    {
        const f: any[] = tween.target.filters;
        f.push(new BlurFilter(0, 0, 1));
        tween.target.filters = f;
        return tween.pluginData.BlurData = { index: f.length - 1 };
    }
}