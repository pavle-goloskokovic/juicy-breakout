import {GTween} from "../GTween";
import {ColorTransform} from "../../../../flash/geom/ColorTransform";
export class ColorTransformPlugin {
    public static enabled: boolean = true;
    protected static installed: boolean = false;
    protected static tweenProperties: any[] = ["redMultiplier", "greenMultiplier", "blueMultiplier", "alphaMultiplier", "redOffset", "greenOffset", "blueOffset", "alphaOffset", "tint"];
    public static install(): void {
        if(ColorTransformPlugin.installed ) {
            return;
        } 
        ColorTransformPlugin.installed = true;
        GTween.installPlugin(ColorTransformPlugin, ColorTransformPlugin.tweenProperties, true);
    }
    public static init(tween: GTween, name: string, value: number): number {
        if(!(ColorTransformPlugin.enabled && tween.pluginData.ColorTransformEnabled == null || tween.pluginData.ColorTransformEnabled) ) {
            return value;
        } 
        if(name == "tint" ) {
            let ct: ColorTransform = tween.target.transform.colorTransform;
            let a: number = Math.min(1, 1 - ct.redMultiplier);
            let r: number = Math.min(0xFF, ct.redOffset * a);
            let g: number = Math.min(0xFF, ct.greenOffset * a);
            let b: number = Math.min(0xFF, ct.blueOffset * a);
            let tint: number = a * 0xFF << 24 | r << 16 | g << 8 | b;
            return tint;
        } else {
            return tween.target.transform.colorTransform[name];
        }
    }
    public static tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number {
        if(!(tween.pluginData.ColorTransformEnabled == null && ColorTransformPlugin.enabled || tween.pluginData.ColorTransformEnabled) ) {
            return value;
        } 
        let ct: ColorTransform = tween.target.transform.colorTransform;
        if(name == "tint" ) {
            let aA: number = initValue >> 24 & 0xFF;
            let rA: number = initValue >> 16 & 0xFF;
            let gA: number = initValue >> 8 & 0xFF;
            let bA: number = initValue & 0xFF;
            let tint: number = initValue + rangeValue >> 0;
            let a: number = aA + ratio * ((tint >> 24 & 0xFF) - aA);
            let r: number = rA + ratio * ((tint >> 16 & 0xFF) - rA);
            let g: number = gA + ratio * ((tint >> 8 & 0xFF) - gA);
            let b: number = bA + ratio * ((tint & 0xFF) - bA);
            let mult: number = 1 - a / 0xFF;
            tween.target.transform.colorTransform = new ColorTransform(mult, mult, mult, ct.alphaMultiplier, r, g, b, ct.alphaOffset);
        } else {
            ct[name] = value;
            tween.target.transform.colorTransform = ct;
        }
        return NaN;
    }
}