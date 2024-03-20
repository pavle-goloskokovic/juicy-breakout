import {GTween} from "../GTween";
import {ColorMatrix} from "../../geom/ColorMatrix";
import {ColorMatrixFilter} from "../../../../flash/filters/ColorMatrixFilter";
import {IGTweenPlugin} from "./IGTweenPlugin";
export class ColorAdjustPlugin implements IGTweenPlugin {
    public static enabled: boolean = true;
    protected static instance: ColorAdjustPlugin;
    protected static tweenProperties: any[] = ["brightness", "contrast", "hue", "saturation"];
    public static install(): void {
        if(ColorAdjustPlugin.instance ) {
            return;
        } 
        ColorAdjustPlugin.instance = new ColorAdjustPlugin();
        GTween.installPlugin(ColorAdjustPlugin.instance, ColorAdjustPlugin.tweenProperties);
    }
    public init(tween: GTween, name: string, value: number): number {
        if(!(tween.pluginData.ColorAdjustEnabled == null && ColorAdjustPlugin.enabled || tween.pluginData.ColorAdjustEnabled) ) {
            return value;
        } 
        if(tween.pluginData.ColorAdjustData == null ) {
            let f: any[] = tween.target.filters;
            for(let i: number = 0; i < f.length; i++) {
                if(f[i] instanceof ColorMatrixFilter ) {
                    let cmF: ColorMatrixFilter = f[i];
                    let o: any = {index: i, ratio: NaN};
                    o.initMatrix = cmF.matrix;
                    o.matrix = this.getMatrix(tween);
                    tween.pluginData.ColorAdjustData = o;
                } 
            }
        } 
        return tween.getValue(name) - 1;
    }
    public tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number {
        if(!(tween.pluginData.ColorAdjustEnabled == null && ColorAdjustPlugin.enabled || tween.pluginData.ColorAdjustEnabled) ) {
            return value;
        } 
        let data: any = tween.pluginData.ColorAdjustData;
        if(data == null ) {
            data = this.initTarget(tween);
        } 
        if(ratio == data.ratio ) {
            return value;
        } 
        data.ratio = ratio;
        ratio = value - initValue;
        let f: any[] = tween.target.filters;
        let cmF: ColorMatrixFilter = f[data.index] as ColorMatrixFilter;
        if(cmF == null ) {
            return value;
        } 
        let initMatrix: any[] = data.initMatrix;
        let targMatrix: any[] = data.matrix;
        if(rangeValue < 0 ) {
            initMatrix = targMatrix;
            targMatrix = data.initMatrix;
            ratio *= -1;
        } 
        let matrix: any[] = cmF.matrix;
        let l: number = matrix.length;
        for(let i: number = 0; i < l; i++) {
            matrix[i] = initMatrix[i] + (targMatrix[i] - initMatrix[i]) * ratio;
        }
        cmF.matrix = matrix;
        tween.target.filters = f;
        if(end ) {
            delete tween.pluginData.ColorAdjustData;
        } 
        return NaN;
    }
    protected getMatrix(tween: GTween): ColorMatrix {
        let brightness: number = this.fixValue(tween.getValue("brightness"));
        let contrast: number = this.fixValue(tween.getValue("contrast"));
        let saturation: number = this.fixValue(tween.getValue("saturation"));
        let hue: number = this.fixValue(tween.getValue("hue"));
        let mtx: ColorMatrix = new ColorMatrix();
        mtx.adjustColor(brightness, contrast, saturation, hue);
        return mtx;
    }
    protected initTarget(tween: GTween): any {
        let f: any[] = tween.target.filters;
        let mtx: ColorMatrix = new ColorMatrix();
        f.push(new ColorMatrixFilter(mtx));
        tween.target.filters = f;
        let o: any = {index: f.length - 1, ratio: NaN};
        o.initMatrix = mtx;
        o.matrix = this.getMatrix(tween);
        return tween.pluginData.ColorAdjustData = o;
    }
    protected fixValue(value: number): number {
        return isNaN(value) ? 0 : value;
    }
}