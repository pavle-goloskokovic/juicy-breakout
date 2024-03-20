import { GTween } from '../GTween';
import { ColorMatrix } from '../../geom/ColorMatrix';
import { ColorMatrixFilter } from '../../../../flash/filters/ColorMatrixFilter';
import type { IGTweenPlugin } from './IGTweenPlugin';
export class ColorAdjustPlugin implements IGTweenPlugin {
    static enabled = true;
    protected static instance: ColorAdjustPlugin;
    protected static tweenProperties: any[] = ['brightness', 'contrast', 'hue', 'saturation'];
    static install (): void
    {
        if (ColorAdjustPlugin.instance )
        {
            return;
        }
        ColorAdjustPlugin.instance = new ColorAdjustPlugin();
        GTween.installPlugin(ColorAdjustPlugin.instance, ColorAdjustPlugin.tweenProperties);
    }

    init (tween: GTween, name: string, value: number): number
    {
        if (!(tween.pluginData.ColorAdjustEnabled == null && ColorAdjustPlugin.enabled || tween.pluginData.ColorAdjustEnabled) )
        {
            return value;
        }
        if (tween.pluginData.ColorAdjustData == null )
        {
            const f: any[] = tween.target.filters;
            for (let i = 0; i < f.length; i++)
            {
                if (f[i] instanceof ColorMatrixFilter )
                {
                    const cmF: ColorMatrixFilter = f[i];
                    const o: any = { index: i, ratio: NaN };
                    o.initMatrix = cmF.matrix;
                    o.matrix = this.getMatrix(tween);
                    tween.pluginData.ColorAdjustData = o;
                }
            }
        }
        return tween.getValue(name) - 1;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(tween.pluginData.ColorAdjustEnabled == null && ColorAdjustPlugin.enabled || tween.pluginData.ColorAdjustEnabled) )
        {
            return value;
        }
        let data: any = tween.pluginData.ColorAdjustData;
        if (data == null )
        {
            data = this.initTarget(tween);
        }
        if (ratio == data.ratio )
        {
            return value;
        }
        data.ratio = ratio;
        ratio = value - initValue;
        const f: any[] = tween.target.filters;
        const cmF: ColorMatrixFilter = f[data.index] as ColorMatrixFilter;
        if (cmF == null )
        {
            return value;
        }
        let initMatrix: any[] = data.initMatrix;
        let targMatrix: any[] = data.matrix;
        if (rangeValue < 0 )
        {
            initMatrix = targMatrix;
            targMatrix = data.initMatrix;
            ratio *= -1;
        }
        const matrix: any[] = cmF.matrix;
        const l: number = matrix.length;
        for (let i = 0; i < l; i++)
        {
            matrix[i] = initMatrix[i] + (targMatrix[i] - initMatrix[i]) * ratio;
        }
        cmF.matrix = matrix;
        tween.target.filters = f;
        if (end )
        {
            delete tween.pluginData.ColorAdjustData;
        }
        return NaN;
    }

    protected getMatrix (tween: GTween): ColorMatrix
    {
        const brightness: number = this.fixValue(tween.getValue('brightness'));
        const contrast: number = this.fixValue(tween.getValue('contrast'));
        const saturation: number = this.fixValue(tween.getValue('saturation'));
        const hue: number = this.fixValue(tween.getValue('hue'));
        const mtx: ColorMatrix = new ColorMatrix();
        mtx.adjustColor(brightness, contrast, saturation, hue);
        return mtx;
    }

    protected initTarget (tween: GTween): any
    {
        const f: any[] = tween.target.filters;
        const mtx: ColorMatrix = new ColorMatrix();
        f.push(new ColorMatrixFilter(mtx));
        tween.target.filters = f;
        const o: any = { index: f.length - 1, ratio: NaN };
        o.initMatrix = mtx;
        o.matrix = this.getMatrix(tween);
        return tween.pluginData.ColorAdjustData = o;
    }

    protected fixValue (value: number): number
    {
        return isNaN(value) ? 0 : value;
    }
}
