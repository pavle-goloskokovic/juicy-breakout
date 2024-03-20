import { GTween } from '../GTween';
import { ColorTransform } from '../../../../flash/geom/ColorTransform';
export class ColorTransformPlugin {
    public static enabled = true;
    protected static installed = false;
    protected static tweenProperties: any[] = ['redMultiplier', 'greenMultiplier', 'blueMultiplier', 'alphaMultiplier', 'redOffset', 'greenOffset', 'blueOffset', 'alphaOffset', 'tint'];
    public static install (): void
    {
        if (ColorTransformPlugin.installed )
        {
            return;
        }
        ColorTransformPlugin.installed = true;
        GTween.installPlugin(ColorTransformPlugin, ColorTransformPlugin.tweenProperties, true);
    }

    public static init (tween: GTween, name: string, value: number): number
    {
        if (!(ColorTransformPlugin.enabled && tween.pluginData.ColorTransformEnabled == null || tween.pluginData.ColorTransformEnabled) )
        {
            return value;
        }
        if (name == 'tint' )
        {
            const ct: ColorTransform = tween.target.transform.colorTransform;
            const a: number = Math.min(1, 1 - ct.redMultiplier);
            const r: number = Math.min(0xFF, ct.redOffset * a);
            const g: number = Math.min(0xFF, ct.greenOffset * a);
            const b: number = Math.min(0xFF, ct.blueOffset * a);
            const tint: number = a * 0xFF << 24 | r << 16 | g << 8 | b;
            return tint;
        }
        else
        {
            return tween.target.transform.colorTransform[name];
        }
    }

    public static tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(tween.pluginData.ColorTransformEnabled == null && ColorTransformPlugin.enabled || tween.pluginData.ColorTransformEnabled) )
        {
            return value;
        }
        const ct: ColorTransform = tween.target.transform.colorTransform;
        if (name == 'tint' )
        {
            const aA: number = initValue >> 24 & 0xFF;
            const rA: number = initValue >> 16 & 0xFF;
            const gA: number = initValue >> 8 & 0xFF;
            const bA: number = initValue & 0xFF;
            const tint: number = initValue + rangeValue >> 0;
            const a: number = aA + ratio * ((tint >> 24 & 0xFF) - aA);
            const r: number = rA + ratio * ((tint >> 16 & 0xFF) - rA);
            const g: number = gA + ratio * ((tint >> 8 & 0xFF) - gA);
            const b: number = bA + ratio * ((tint & 0xFF) - bA);
            const mult: number = 1 - a / 0xFF;
            tween.target.transform.colorTransform = new ColorTransform(mult, mult, mult, ct.alphaMultiplier, r, g, b, ct.alphaOffset);
        }
        else
        {
            ct[name] = value;
            tween.target.transform.colorTransform = ct;
        }
        return NaN;
    }
}