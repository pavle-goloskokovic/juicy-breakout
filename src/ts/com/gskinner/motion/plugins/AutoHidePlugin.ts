import {GTween} from "../GTween";
import {IGTweenPlugin} from "./IGTweenPlugin";
export class AutoHidePlugin implements IGTweenPlugin {
    public static enabled: boolean = true;
    protected static instance: AutoHidePlugin;
    protected static tweenProperties: any[] = ["alpha"];
    public static install(): void {
        if(AutoHidePlugin.instance ) {
            return;
        } 
        AutoHidePlugin.instance = new AutoHidePlugin();
        GTween.installPlugin(AutoHidePlugin.instance, AutoHidePlugin.tweenProperties);
    }
    public init(tween: GTween, name: string, value: number): number {
        return value;
    }
    public tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number {
        if(tween.pluginData.AutoHideEnabled == null && AutoHidePlugin.enabled || tween.pluginData.AutoHideEnabled ) {
            if(tween.target.visible != value > 0 ) {
                tween.target.visible = value > 0;
            } 
        } 
        return value;
    }
}