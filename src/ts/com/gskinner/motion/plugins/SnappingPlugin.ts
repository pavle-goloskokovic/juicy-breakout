import { GTween } from '../GTween';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class SnappingPlugin implements IGTweenPlugin {
    static enabled = true;
    protected static instance: SnappingPlugin;
    protected static tweenProperties: any[] = ['x', 'y'];
    static install (properties: any[] = null): void
    {
        if (SnappingPlugin.instance )
        {
            return;
        }
        SnappingPlugin.instance = new SnappingPlugin();
        GTween.installPlugin(SnappingPlugin.instance, properties || SnappingPlugin.tweenProperties, true);
    }

    init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(SnappingPlugin.enabled && tween.pluginData.SnappingEnabled == null || tween.pluginData.SnappingEnabled) )
        {
            return value;
        }
        return Math.round(value);
    }
}
