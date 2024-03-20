import {Component} from "./Component";
import {DisplayObject} from "../../../flash/display/DisplayObject";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Event} from "../../../flash/events/Event";
[Event(name = "resize", type = "flash.events.Event")]
export class HBox extends Component {
    protected _spacing: number = 5;
    private _alignment: string = NONE;
    public static TOP: string = "top";
    public static BOTTOM: string = "bottom";
    public static MIDDLE: string = "middle";
    public static NONE: string = "none";
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0) {
        super(parent, xpos, ypos);
    }
    public addChild(child: DisplayObject): DisplayObject {
        super.addChild(child);
        child.addEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }
    public addChildAt(child: DisplayObject, index: number): DisplayObject {
        super.addChildAt(child, index);
        child.addEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }
    public removeChild(child: DisplayObject): DisplayObject {
        super.removeChild(child);
        child.removeEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }
    public removeChildAt(index: number): DisplayObject {
        let child: DisplayObject = super.removeChildAt(index);
        child.removeEventListener(Event.RESIZE, this.onResize);
        this.draw();
        return child;
    }
    protected onResize(event: Event): void {
        this.invalidate();
    }
    protected doAlignment(): void {
        if(this._alignment != HBox.NONE ) {
            for(let i: number = 0; i < this.numChildren; i++) {
                let child: DisplayObject = this.getChildAt(i);
                if(this._alignment == HBox.TOP ) {
                    child.y = 0;
                } else if(this._alignment == HBox.BOTTOM ) {
                    child.y = this._height - child.height;
                } else if(this._alignment == HBox.MIDDLE ) {
                    child.y = (this._height - child.height) / 2;
                } 
            }
        } 
    }
    public draw(): void {
        this._width = 0;
        this._height = 0;
        let xpos: number = 0;
        for(let i: number = 0; i < this.numChildren; i++) {
            let child: DisplayObject = this.getChildAt(i);
            child.x = xpos;
            xpos += child.width;
            xpos += this._spacing;
            this._width += child.width;
            this._height = Math.max(this._height, child.height);
        }
        this.doAlignment();
        this._width += this._spacing * (this.numChildren - 1);
        dispatchEvent(new Event(Event.RESIZE));
    }
    public set spacing(s: number) {
        this._spacing = s;
        this.invalidate();
    }
    public get spacing(): number {
        return this._spacing;
    }
    public set alignment(value: string) {
        this._alignment = value;
        this.invalidate();
    }
    public get alignment(): string {
        return this._alignment;
    }
}