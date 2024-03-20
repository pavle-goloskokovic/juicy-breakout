import {Dictionary} from "../../../flash/utils/Dictionary";
import {GTween} from "./GTween";
export class GTweener {
    protected static tweens: Dictionary;
    protected static instance: GTweener;
    protected static staticInit(): void {
        GTweener.tweens = new Dictionary(true);
        GTweener.instance = new GTweener();
        GTween.installPlugin(GTweener.instance, ["*"]);
    }
    public init(tween: GTween, name: string, value: number): number {
        return value;
    }
    public tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number {
        if(end && tween.pluginData.GTweener ) {
            GTweener.remove(tween);
        } 
        return value;
    }
    public static to(target: any = null, duration: number = 1, values: any = null, props: any = null, pluginData: any = null): GTween {
        let tween: GTween = new GTween(target, duration, values, props, pluginData);
        GTweener.add(tween);
        return tween;
    }
    public static from(target: any = null, duration: number = 1, values: any = null, props: any = null, pluginData: any = null): GTween {
        let tween: GTween = GTweener.to(target, duration, values, props, pluginData);
        tween.swapValues();
        return tween;
    }
    public static add(tween: GTween): void {
        let target: any = tween.target;
        let list: any[] = GTweener.tweens[target];
        if(list ) {
            GTweener.clearValues(target, tween.getValues());
        } else {
            list = (GTweener.tweens[target] = []);
        }
        list.push(tween);
        tween.pluginData.GTweener = true;
    }
    public static getTween(target: any, name: string): GTween {
        let list: any[] = GTweener.tweens[target];
        if(list == null ) {
            return null;
        } 
        let l: number = list.length;
        for(let i: number = 0; i < l; i++) {
            let tween: GTween = list[i];
            if(!isNaN(tween.getValue(name)) ) {
                return tween;
            } 
        }
        return null;
    }
    public static getTweens(target: any): any[] {
        return GTweener.tweens[target] || [];
    }
    public static pauseTweens(target: any, paused: boolean = true): void {
        let list: any[] = GTweener.tweens[target];
        if(list == null ) {
            return;
        } 
        let l: number = list.length;
        for(let i: number = 0; i < l; i++) {
            list[i].paused = paused;
        }
    }
    public static resumeTweens(target: any): void {
        GTweener.pauseTweens(target, false);
    }
    public static remove(tween: GTween): void {
        delete tween.pluginData.GTweener;
        let list: any[] = GTweener.tweens[tween.target];
        if(list == null ) {
            return;
        } 
        let l: number = list.length;
        for(let i: number = 0; i < l; i++) {
            if(list[i] == tween ) {
                list.splice(i, 1);
                return;
            } 
        }
    }
    public static removeTweens(target: any): void {
        GTweener.pauseTweens(target);
        let list: any[] = GTweener.tweens[target];
        if(list == null ) {
            return;
        } 
        let l: number = list.length;
        for(let i: number = 0; i < l; i++) {
            delete list[i].pluginData.GTweener;
        }
        delete GTweener.tweens[target];
    }
    protected static clearValues(target: any, values: any): void {
        for(let n in values) {
            let tween: GTween = GTweener.getTween(target, n);
            if(tween ) {
                tween.deleteValue(n);
            } 
        }
    }
}