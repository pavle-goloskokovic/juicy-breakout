import { GTween } from '../GTween';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class AutoHidePlugin implements IGTweenPlugin {
    static enabled = true;
    protected static instance: AutoHidePlugin;
    protected static tweenProperties: any[] = ['alpha'];
    static install (): void
    {
        if (AutoHidePlugin.instance )
        {
            return;
        }
        AutoHidePlugin.instance = new AutoHidePlugin();
        GTween.installPlugin(AutoHidePlugin.instance, AutoHidePlugin.tweenProperties);
    }

    init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (tween.pluginData.AutoHideEnabled == null && AutoHidePlugin.enabled || tween.pluginData.AutoHideEnabled )
        {
            if (tween.target.visible != value > 0 )
            {
                tween.target.visible = value > 0;
            }
        }
        return value;
    }
}
