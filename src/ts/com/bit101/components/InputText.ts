import {Component} from "./Component";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../flash/display/Sprite";
import {Event} from "../../../flash/events/Event";
import {TextField} from "../../../flash/text/TextField";
import {TextFieldType} from "../../../flash/text/TextFieldType";
import {TextFormat} from "../../../flash/text/TextFormat";
export class InputText extends Component {
    protected _back: Sprite;
    protected _password: boolean = false;
    protected _text: string = "";
    protected _tf: TextField;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, text: string = "", defaultHandler: Function = null) {
        this.text = text;
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            this.addEventListener(Event.CHANGE, defaultHandler);
        } 
    }
    protected init(): void {
        super.init();
        this.setSize(100, 16);
    }
    protected addChildren(): void {
        this._back = new Sprite();
        this._back.filters = [this.getShadow(2, true)];
        this.addChild(this._back);
        this._tf = new TextField();
        this._tf.embedFonts = Style.embedFonts;
        this._tf.selectable = true;
        this._tf.type = TextFieldType.INPUT;
        this._tf.defaultTextFormat = new TextFormat(Style.fontName, Style.fontSize, Style.INPUT_TEXT);
        this.addChild(this._tf);
        this._tf.addEventListener(Event.CHANGE, this.onChange);
    }
    public draw(): void {
        super.draw();
        this._back.graphics.clear();
        this._back.graphics.beginFill(Style.BACKGROUND);
        this._back.graphics.drawRect(0, 0, this._width, this._height);
        this._back.graphics.endFill();
        this._tf.displayAsPassword = this._password;
        if(this._text != null ) {
            this._tf.text = this._text;
        } else {
            this._tf.text = "";
        }
        this._tf.width = this._width - 4;
        if(this._tf.text == "" ) {
            this._tf.text = "X";
            this._tf.height = Math.min(this._tf.textHeight + 4, this._height);
            this._tf.text = "";
        } else {
            this._tf.height = Math.min(this._tf.textHeight + 4, this._height);
        }
        this._tf.x = 2;
        this._tf.y = Math.round(this._height / 2 - this._tf.height / 2);
    }
    protected onChange(event: Event): void {
        this._text = this._tf.text;
        event.stopImmediatePropagation();
        dispatchEvent(event);
    }
    public set text(t: string) {
        this._text = t;
        if(this._text == null ) {
            this._text = ""
        } 
        this.invalidate();
    }
    public get text(): string {
        return this._text;
    }
    public get textField(): TextField {
        return this._tf;
    }
    public set restrict(str: string) {
        this._tf.restrict = str;
    }
    public get restrict(): string {
        return this._tf.restrict;
    }
    public set maxChars(max: number) {
        this._tf.maxChars = max;
    }
    public get maxChars(): number {
        return this._tf.maxChars;
    }
    public set password(b: boolean) {
        this._password = b;
        this.invalidate();
    }
    public get password(): boolean {
        return this._password;
    }
    public set enabled(value: boolean) {
        super.enabled = value;
        this._tf.tabEnabled = value;
    }
}