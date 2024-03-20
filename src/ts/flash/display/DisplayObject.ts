import type { DisplayObjectContainer } from './DisplayObjectContainer';
import { EventDispatcher } from '../events/EventDispatcher';
export class DisplayObject extends EventDispatcher {
    localToGlobal (point: Point): Point
    {

    }

    globalToLocal (point: Point): Point
    {

    }

    getBounds (targetCoordinateSpace: DisplayObject): Rectangle
    {

    }

    hitTestPoint (x: number, y: number, shapeFlag = false): boolean
    {

    }

    stage: Stage;
    parent: DisplayObjectContainer;
    visible: boolean;
    transform: Transform;
    graphics: Graphics;
    mask: DisplayObject;
    filters: any[];
    width: number;
    height: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    alpha: number;
    cacheAsBitmap: boolean;
    mouseX: number;
    mouseY: number;
}
