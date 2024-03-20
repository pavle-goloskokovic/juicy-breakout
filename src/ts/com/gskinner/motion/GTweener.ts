import { Dictionary } from '../../../flash/utils/Dictionary';
import { GTween } from './GTween';
export class GTweener {
    protected static tweens: Dictionary;
    protected static instance: GTweener;
    protected static staticInit (): void
    {
        GTweener.tweens = new Dictionary(true);
        GTweener.instance = new GTweener();
        GTween.installPlugin(GTweener.instance, ['*']);
    }

    init (tween: GTween, name: string, value: number): number
    {
        return value;
    }

    tween (tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number
    {
        if (end && tween.pluginData.GTweener )
        {
            GTweener.remove(tween);
        }
        return value;
    }

    static to (target: any = null, duration = 1, values: any = null, props: any = null, pluginData: any = null): GTween
    {
        const tween: GTween = new GTween(target, duration, values, props, pluginData);
        GTweener.add(tween);
        return tween;
    }

    static from (target: any = null, duration = 1, values: any = null, props: any = null, pluginData: any = null): GTween
    {
        const tween: GTween = GTweener.to(target, duration, values, props, pluginData);
        tween.swapValues();
        return tween;
    }

    static add (tween: GTween): void
    {
        const target: any = tween.target;
        let list: any[] = GTweener.tweens[target];
        if (list )
        {
            GTweener.clearValues(target, tween.getValues());
        }
        else
        {
            list = (GTweener.tweens[target] = []);
        }
        list.push(tween);
        tween.pluginData.GTweener = true;
    }

    static getTween (target: any, name: string): GTween
    {
        const list: any[] = GTweener.tweens[target];
        if (list == null )
        {
            return null;
        }
        const l: number = list.length;
        for (let i = 0; i < l; i++)
        {
            const tween: GTween = list[i];
            if (!isNaN(tween.getValue(name)) )
            {
                return tween;
            }
        }
        return null;
    }

    static getTweens (target: any): any[]
    {
        return GTweener.tweens[target] || [];
    }

    static pauseTweens (target: any, paused = true): void
    {
        const list: any[] = GTweener.tweens[target];
        if (list == null )
        {
            return;
        }
        const l: number = list.length;
        for (let i = 0; i < l; i++)
        {
            list[i].paused = paused;
        }
    }

    static resumeTweens (target: any): void
    {
        GTweener.pauseTweens(target, false);
    }

    static remove (tween: GTween): void
    {
        delete tween.pluginData.GTweener;
        const list: any[] = GTweener.tweens[tween.target];
        if (list == null )
        {
            return;
        }
        const l: number = list.length;
        for (let i = 0; i < l; i++)
        {
            if (list[i] == tween )
            {
                list.splice(i, 1);
                return;
            }
        }
    }

    static removeTweens (target: any): void
    {
        GTweener.pauseTweens(target);
        const list: any[] = GTweener.tweens[target];
        if (list == null )
        {
            return;
        }
        const l: number = list.length;
        for (let i = 0; i < l; i++)
        {
            delete list[i].pluginData.GTweener;
        }
        delete GTweener.tweens[target];
    }

    protected static clearValues (target: any, values: any): void
    {
        for (const n in values)
        {
            const tween: GTween = GTweener.getTween(target, n);
            if (tween )
            {
                tween.deleteValue(n);
            }
        }
    }
}
