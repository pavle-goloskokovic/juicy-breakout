import {Component} from "./Component";
import {Panel} from "./Panel";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Event} from "../../../flash/events/Event";
import {TextField} from "../../../flash/text/TextField";
import {TextFieldType} from "../../../flash/text/TextFieldType";
import {TextFormat} from "../../../flash/text/TextFormat";
[Event(name = "change", type = "flash.events.Event")]
export class Text extends Component {
    protected _tf: TextField;
    protected _text: string = "";
    protected _editable: boolean = true;
    protected _panel: Panel;
    protected _selectable: boolean = true;
    protected _html: boolean = false;
    protected _format: TextFormat;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, text: string = "") {
        this.text = text;
        super(parent, xpos, ypos);
        this.setSize(200, 100);
    }
    protected init(): void {
        super.init();
    }
    protected addChildren(): void {
        this._panel = new Panel(this);
        this._panel.color = Style.TEXT_BACKGROUND;
        this._format = new TextFormat(Style.fontName, Style.fontSize, Style.LABEL_TEXT);
        this._tf = new TextField();
        this._tf.x = 2;
        this._tf.y = 2;
        this._tf.height = this._height;
        this._tf.embedFonts = Style.embedFonts;
        this._tf.multiline = true;
        this._tf.wordWrap = true;
        this._tf.selectable = true;
        this._tf.type = TextFieldType.INPUT;
        this._tf.defaultTextFormat = this._format;
        this._tf.addEventListener(Event.CHANGE, this.onChange);
        addChild(this._tf);
    }
    public draw(): void {
        super.draw();
        this._panel.setSize(this._width, this._height);
        this._panel.draw();
        this._tf.width = this._width - 4;
        this._tf.height = this._height - 4;
        if(this._html ) {
            this._tf.htmlText = this._text;
        } else {
            this._tf.text = this._text;
        }
        if(this._editable ) {
            this._tf.mouseEnabled = true;
            this._tf.selectable = true;
            this._tf.type = TextFieldType.INPUT;
        } else {
            this._tf.mouseEnabled = this._selectable;
            this._tf.selectable = this._selectable;
            this._tf.type = TextFieldType.DYNAMIC;
        }
        this._tf.setTextFormat(this._format);
    }
    protected onChange(event: Event): void {
        this._text = this._tf.text;
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
    public set editable(b: boolean) {
        this._editable = b;
        this.invalidate();
    }
    public get editable(): boolean {
        return this._editable;
    }
    public set selectable(b: boolean) {
        this._selectable = b;
        this.invalidate();
    }
    public get selectable(): boolean {
        return this._selectable;
    }
    public set html(b: boolean) {
        this._html = b;
        this.invalidate();
    }
    public get html(): boolean {
        return this._html;
    }
    public set enabled(value: boolean) {
        super.enabled = value;
        this._tf.tabEnabled = value;
    }
}