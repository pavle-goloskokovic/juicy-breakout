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
    width = 0;
    height = 0;
    x = 0;
    y = 0;
    scaleX = 0;
    scaleY = 0;
    rotation = 0;
    alpha = 0;
    cacheAsBitmap: boolean;
    mouseX = 0;
    mouseY = 0;
}
