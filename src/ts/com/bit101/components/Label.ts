import { Component } from './Component';
import { Style } from './Style';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
import { TextField } from '../../../flash/text/TextField';
import { TextFieldAutoSize } from '../../../flash/text/TextFieldAutoSize';
import { TextFormat } from '../../../flash/text/TextFormat';
[Event(name = 'resize', type = 'flash.events.Event')];
export class Label extends Component {
    protected _autoSize: boolean = true;
    protected _text: string = '';
    protected _tf: TextField;
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, text: string = '')
    {
        this.text = text;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    protected addChildren (): void
    {
        this._height = 18;
        this._tf = new TextField();
        this._tf.height = this._height;
        this._tf.embedFonts = Style.embedFonts;
        this._tf.selectable = false;
        this._tf.mouseEnabled = false;
        this._tf.defaultTextFormat = new TextFormat(Style.fontName, Style.fontSize, Style.LABEL_TEXT);
        this._tf.text = this._text;
        this.addChild(this._tf);
        this.draw();
    }

    public draw (): void
    {
        super.draw();
        this._tf.text = this._text;
        if (this._autoSize )
        {
            this._tf.autoSize = TextFieldAutoSize.LEFT;
            this._width = this._tf.width;
            dispatchEvent(new Event(Event.RESIZE));
        }
        else
        {
            this._tf.autoSize = TextFieldAutoSize.NONE;
            this._tf.width = this._width;
        }
        this._height = (this._tf.height = 18);
    }

    public set text (t: string)
    {
        this._text = t;
        if (this._text == null )
        {
            this._text = '';
        }
        this.invalidate();
    }

    public get text (): string
    {
        return this._text;
    }

    public set autoSize (b: boolean)
    {
        this._autoSize = b;
    }

    public get autoSize (): boolean
    {
        return this._autoSize;
    }

    public get textField (): TextField
    {
        return this._tf;
    }
}