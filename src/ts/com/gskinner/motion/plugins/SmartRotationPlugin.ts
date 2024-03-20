import { GTween } from '../GTween';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class SmartRotationPlugin implements IGTweenPlugin {
    public static enabled: boolean = true;
    protected static instance: SmartRotationPlugin;
    protected static tweenProperties: any[] = ['rotation', 'rotationX', 'rotationY', 'rotationZ'];
    public static install (properties: any[] = null): void
    {
        if (SmartRotationPlugin.instance )
        {
            return;
        }
        SmartRotationPlugin.instance = new SmartRotationPlugin();
        GTween.installPlugin(SmartRotationPlugin.instance, properties || SmartRotationPlugin.tweenProperties, true);
    }

    public init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    public tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(SmartRotationPlugin.enabled && tween.pluginData.SmartRotationEnabled == null || tween.pluginData.SmartRotationEnabled) )
        {
            return value;
        }
        rangeValue %= 360;
        if (rangeValue > 180 )
        {
            rangeValue -= 360;
        }
        else if (rangeValue < -180 )
        {
            rangeValue += 360;
        }
        return initValue + rangeValue * ratio;
    }
}