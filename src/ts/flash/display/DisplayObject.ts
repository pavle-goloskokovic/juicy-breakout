import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {EventDispatcher} from "../events/EventDispatcher";
export class DisplayObject extends EventDispatcher {
    public localToGlobal(point: Point): Point {
        
    }
    public globalToLocal(point: Point): Point {
        
    }
    public getBounds(targetCoordinateSpace: DisplayObject): Rectangle {
        
    }
    public hitTestPoint(x: number, y: number, shapeFlag: boolean = false): boolean {
        
    }
    public stage: Stage;
    public parent: DisplayObjectContainer;
    public visible: boolean;
    public transform: Transform;
    public graphics: Graphics;
    public mask: DisplayObject;
    public filters: any[];
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public scaleX: number;
    public scaleY: number;
    public rotation: number;
    public alpha: number;
    public cacheAsBitmap: boolean;
    public mouseX: number;
    public mouseY: number;
}