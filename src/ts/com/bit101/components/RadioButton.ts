import {Component} from "./Component";
import {Label} from "./Label";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../flash/display/Sprite";
import {MouseEvent} from "../../../flash/events/MouseEvent";
export class RadioButton extends Component {
    protected _back: Sprite;
    protected _button: Sprite;
    protected _selected: boolean = false;
    protected _label: Label;
    protected _labelText: string = "";
    protected _groupName: string = "defaultRadioGroup";
    protected static buttons: any[];
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, label: string = "", checked: boolean = false, defaultHandler: Function = null) {
        RadioButton.addButton(this);
        this._selected = checked;
        this._labelText = label;
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            this.addEventListener(MouseEvent.CLICK, defaultHandler);
        } 
    }
    protected static addButton(rb: RadioButton): void {
        if(RadioButton.buttons == null ) {
            RadioButton.buttons = [];
        } 
        RadioButton.buttons.push(rb);
    }
    protected static clear(rb: RadioButton): void {
        for(let i: number = 0; i < RadioButton.buttons.length; i++) {
            if(RadioButton.buttons[i] != rb && RadioButton.buttons[i].groupName == rb.groupName ) {
                RadioButton.buttons[i].selected = false;
            } 
        }
    }
    protected init(): void {
        super.init();
        this.buttonMode = true;
        this.useHandCursor = true;
        this.addEventListener(MouseEvent.CLICK, this.onClick, false, 1);
        this.selected = this._selected;
    }
    protected addChildren(): void {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._button = new Sprite();
        this._button.filters = [this.getShadow(1)];
        this._button.visible = false;
        this.addChild(this._button);
        this._label = new Label(this, 0, 0, this._labelText);
        this.draw();
        this.mouseChildren = false;
    }
    public draw(): void {
        super.draw();
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawCircle(5, 5, 5);
        this._back.graphics.endFill();
        this._button.graphics.clear();
        this._button.graphics.beginFill(Style.BUTTON_FACE);
        this._button.graphics.drawCircle(5, 5, 3);
        this._label.x = 12;
        this._label.y = (10 - this._label.height) / 2;
        this._label.text = this._labelText;
        this._label.draw();
        this._width = this._label.width + 12;
        this._height = 10;
    }
    protected onClick(event: MouseEvent): void {
        this.selected = true;
    }
    public set selected(s: boolean) {
        this._selected = s;
        this._button.visible = this._selected;
        if(this._selected ) {
            RadioButton.clear(this);
        } 
    }
    public get selected(): boolean {
        return this._selected;
    }
    public set label(str: string) {
        this._labelText = str;
        this.invalidate();
    }
    public get label(): string {
        return this._labelText;
    }
    public get groupName(): string {
        return this._groupName;
    }
    public set groupName(value: string) {
        this._groupName = value;
    }
}