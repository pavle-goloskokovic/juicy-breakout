import {Component} from "./Component";
import {Label} from "./Label";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {MouseEvent} from "../../../flash/events/MouseEvent";
export class ListItem extends Component {
    protected _data: any;
    protected _label: Label;
    protected _defaultColor: number = 0xffffff;
    protected _selectedColor: number = 0xdddddd;
    protected _rolloverColor: number = 0xeeeeee;
    protected _selected: boolean;
    protected _mouseOver: boolean = false;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, data: any = null) {
        this._data = data;
        super(parent, xpos, ypos);
    }
    protected init(): void {
        super.init();
        addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
        this.setSize(100, 20);
    }
    protected addChildren(): void {
        super.addChildren();
        this._label = new Label(this, 5, 0);
        this._label.draw();
    }
    public draw(): void {
        super.draw();
        graphics.clear();
        if(this._selected ) {
            graphics.beginFill(this._selectedColor);
        } else if(this._mouseOver ) {
            graphics.beginFill(this._rolloverColor);
        } else {
            graphics.beginFill(this._defaultColor);
        }
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();
        if(this._data == null ) {
            return
        } 
        if(this._data instanceof String ) {
            this._label.text = this._data as string;
        } else if(this._data.hasOwnProperty("label") && this._data.label instanceof String ) {
            this._label.text = this._data.label;
        } else {
            this._label.text = this._data.toString();
        }
    }
    protected onMouseOver(event: MouseEvent): void {
        addEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        this._mouseOver = true;
        this.invalidate();
    }
    protected onMouseOut(event: MouseEvent): void {
        removeEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        this._mouseOver = false;
        this.invalidate();
    }
    public set data(value: any) {
        this._data = value;
        this.invalidate();
    }
    public get data(): any {
        return this._data;
    }
    public set selected(value: boolean) {
        this._selected = value;
        this.invalidate();
    }
    public get selected(): boolean {
        return this._selected;
    }
    public set defaultColor(value: number) {
        this._defaultColor = value;
        this.invalidate();
    }
    public get defaultColor(): number {
        return this._defaultColor;
    }
    public set selectedColor(value: number) {
        this._selectedColor = value;
        this.invalidate();
    }
    public get selectedColor(): number {
        return this._selectedColor;
    }
    public set rolloverColor(value: number) {
        this._rolloverColor = value;
        this.invalidate();
    }
    public get rolloverColor(): number {
        return this._rolloverColor;
    }
}