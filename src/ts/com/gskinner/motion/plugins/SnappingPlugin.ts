import {GTween} from "../GTween";
import {IGTweenPlugin} from "./IGTweenPlugin";
export class SnappingPlugin implements IGTweenPlugin {
    public static enabled: boolean = true;
    protected static instance: SnappingPlugin;
    protected static tweenProperties: any[] = ["x", "y"];
    public static install(properties: any[] = null): void {
        if(SnappingPlugin.instance ) {
            return;
        } 
        SnappingPlugin.instance = new SnappingPlugin();
        GTween.installPlugin(SnappingPlugin.instance, properties || SnappingPlugin.tweenProperties, true);
    }
    public init(tween: GTween, name: string, value: number): number {
        return value;
    }
    public tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number {
        if(!(SnappingPlugin.enabled && tween.pluginData.SnappingEnabled == null || tween.pluginData.SnappingEnabled) ) {
            return value;
        } 
        return Math.round(value);
    }
}