import {DisplayObject} from "./DisplayObject";
export class InteractiveObject extends DisplayObject {
    public mouseEnabled: boolean;
    public mouseChildren: boolean;
    public tabEnabled: boolean;
}