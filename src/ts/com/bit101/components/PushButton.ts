import {Component} from "./Component";
import {Label} from "./Label";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../flash/display/Sprite";
import {MouseEvent} from "../../../flash/events/MouseEvent";
export class PushButton extends Component {
    protected _back: Sprite;
    protected _face: Sprite;
    protected _label: Label;
    protected _labelText: string = "";
    protected _over: boolean = false;
    protected _down: boolean = false;
    protected _selected: boolean = false;
    protected _toggle: boolean = false;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, label: string = "", defaultHandler: Function = null) {
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            this.addEventListener(MouseEvent.CLICK, defaultHandler);
        } 
        this.label = label;
    }
    protected init(): void {
        super.init();
        this.buttonMode = true;
        this.useHandCursor = true;
        this.setSize(100, 20);
    }
    protected addChildren(): void {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this._back.mouseEnabled = false;
        this.addChild(this._back);
        this._face = new Sprite();
        this._face.mouseEnabled = false;
        this._face.filters = [this.getShadow(1)];
        this._face.x = 1;
        this._face.y = 1;
        this.addChild(this._face);
        this._label = new Label();
        this.addChild(this._label);
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
        this.addEventListener(MouseEvent.ROLL_OVER, this.onMouseOver);
    }
    protected drawFace(): void {
        this._face.graphics.clear();
        if(this._down ) {
            this._face.graphics.beginFill(Style.BUTTON_DOWN);
        } else {
            this._face.graphics.beginFill(Style.BUTTON_FACE);
        }
        this._face.graphics.drawRect(0, 0, this._width - 2, this._height - 2);
        this._face.graphics.endFill();
    }
    public draw(): void {
        super.draw();
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, this._width, this._height);
        this._back.graphics.endFill();
        this.drawFace();
        this._label.text = this._labelText;
        this._label.autoSize = true;
        this._label.draw();
        if(this._label.width > this._width - 4 ) {
            this._label.autoSize = false;
            this._label.width = this._width - 4;
        } else {
            this._label.autoSize = true;
        }
        this._label.draw();
        this._label.move(this._width / 2 - this._label.width / 2, this._height / 2 - this._label.height / 2);
    }
    protected onMouseOver(event: MouseEvent): void {
        this._over = true;
        this.addEventListener(MouseEvent.ROLL_OUT, this.onMouseOut);
    }
    protected onMouseOut(event: MouseEvent): void {
        this._over = false;
        if(!this._down ) {
            this._face.filters = [this.getShadow(1)];
        } 
        this.removeEventListener(MouseEvent.ROLL_OUT, this.onMouseOut);
    }
    protected onMouseGoDown(event: MouseEvent): void {
        this._down = true;
        this.drawFace();
        this._face.filters = [this.getShadow(1, true)];
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected onMouseGoUp(event: MouseEvent): void {
        if(this._toggle && this._over ) {
            this._selected = !this._selected;
        } 
        this._down = this._selected;
        this.drawFace();
        this._face.filters = [this.getShadow(1, this._selected)];
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    public set label(str: string) {
        this._labelText = str;
        this.draw();
    }
    public get label(): string {
        return this._labelText;
    }
    public set selected(value: boolean) {
        if(!this._toggle ) {
            value = false;
        } 
        this._selected = value;
        this._down = this._selected;
        this._face.filters = [this.getShadow(1, this._selected)];
        this.drawFace();
    }
    public get selected(): boolean {
        return this._selected;
    }
    public set toggle(value: boolean) {
        this._toggle = value;
    }
    public get toggle(): boolean {
        return this._toggle;
    }
}