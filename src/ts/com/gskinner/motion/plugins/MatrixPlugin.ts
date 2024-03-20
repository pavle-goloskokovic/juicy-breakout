import { GTween } from '../GTween';
import { IGTweenPlugin } from './IGTweenPlugin';
import type { Matrix } from '../../../../flash/geom/Matrix';
export class MatrixPlugin {
    public static enabled: boolean = true;
    protected static instance: MatrixPlugin;
    protected static tweenProperties: any[] = ['a', 'b', 'c', 'd', 'tx', 'ty'];
    public static install (): void
    {
        if (MatrixPlugin.instance )
        {
            return;
        }
        MatrixPlugin.instance = new MatrixPlugin();
        GTween.installPlugin(MatrixPlugin.instance, MatrixPlugin.tweenProperties, true);
    }

    public init (tween: GTween, name: string, value: number): number
    {
        if (!(MatrixPlugin.enabled && tween.pluginData.MatrixEnabled == null || tween.pluginData.MatrixEnabled) )
        {
            return value;
        }
        return tween.target.transform.matrix[name];
    }

    public tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (!(MatrixPlugin.enabled && tween.pluginData.MatrixEnabled == null || tween.pluginData.MatrixEnabled) )
        {
            return value;
        }
        const matrix: Matrix = tween.target.transform.matrix;
        matrix[name] = value;
        tween.target.transform.matrix = matrix;
        return NaN;
    }
}