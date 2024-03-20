import {Component} from "./Component";
import {Label} from "./Label";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../flash/display/Sprite";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
[Event(name = "change", type = "flash.events.Event")]
export class Knob extends Component {
    public static VERTICAL: string = "vertical";
    public static HORIZONTAL: string = "horizontal";
    public static ROTATE: string = "rotate";
    protected _knob: Sprite;
    protected _label: Label;
    protected _labelText: string = "";
    protected _max: number = 100;
    protected _min: number = 0;
    protected _mode: string = VERTICAL;
    protected _mouseRange: number = 100;
    protected _precision: number = 1;
    protected _radius: number = 20;
    protected _startX: number;
    protected _startY: number;
    protected _value: number = 0;
    protected _valueLabel: Label;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, label: string = "", defaultHandler: Function = null) {
        this._labelText = label;
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            addEventListener(Event.CHANGE, defaultHandler);
        } 
    }
    protected init(): void {
        super.init();
    }
    protected addChildren(): void {
        this._knob = new Sprite();
        this._knob.buttonMode = true;
        this._knob.useHandCursor = true;
        this._knob.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
        addChild(this._knob);
        this._label = new Label();
        this._label.autoSize = true;
        addChild(this._label);
        this._valueLabel = new Label();
        this._valueLabel.autoSize = true;
        addChild(this._valueLabel);
        this._width = this._radius * 2;
        this._height = this._radius * 2 + 40;
    }
    protected drawKnob(): void {
        this._knob.graphics.clear();
        this._knob.graphics.beginFill(Style.BACKGROUND);
        this._knob.graphics.drawCircle(0, 0, this._radius);
        this._knob.graphics.endFill();
        this._knob.graphics.beginFill(Style.BUTTON_FACE);
        this._knob.graphics.drawCircle(0, 0, this._radius - 2);
        this._knob.graphics.endFill();
        this._knob.graphics.beginFill(Style.BACKGROUND);
        let s: number = this._radius * .1;
        this._knob.graphics.drawRect(this._radius, -s, s * 1.5, s * 2);
        this._knob.graphics.endFill();
        this._knob.x = this._radius;
        this._knob.y = this._radius + 20;
        this.updateKnob();
    }
    protected updateKnob(): void {
        this._knob.rotation = -225 + (this._value - this._min) / (this._max - this._min) * 270;
        this.formatValueLabel();
    }
    protected correctValue(): void {
        if(this._max > this._min ) {
            this._value = Math.min(this._value, this._max);
            this._value = Math.max(this._value, this._min);
        } else {
            this._value = Math.max(this._value, this._max);
            this._value = Math.min(this._value, this._min);
        }
    }
    protected formatValueLabel(): void {
        let mult: number = Math.pow(10, this._precision);
        let val: string = (Math.round(this._value * mult) / mult).toString();
        let parts: any[] = val.split(".");
        if(parts[1] == null ) {
            if(this._precision > 0 ) {
                val += ".";
            } 
            for(let i: number = 0; i < this._precision; i++) {
                val += "0";
            }
        } else if(parts[1].length < this._precision ) {
            for(i = 0; i < this._precision - parts[1].length; i++) {
                val += "0";
            }
        } 
        this._valueLabel.text = val;
        this._valueLabel.draw();
        this._valueLabel.x = this.width / 2 - this._valueLabel.width / 2;
    }
    public draw(): void {
        super.draw();
        this.drawKnob();
        this._label.text = this._labelText;
        this._label.draw();
        this._label.x = this._radius - this._label.width / 2;
        this._label.y = 0;
        this.formatValueLabel();
        this._valueLabel.x = this._radius - this._valueLabel.width / 2;
        this._valueLabel.y = this._radius * 2 + 20;
        this._width = this._radius * 2;
        this._height = this._radius * 2 + 40;
    }
    protected onMouseGoDown(event: MouseEvent): void {
        this._startX = mouseX;
        this._startY = mouseY;
        stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMoved);
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected onMouseMoved(event: MouseEvent): void {
        let oldValue: number = this._value;
        if(this._mode == Knob.ROTATE ) {
            let angle: number = Math.atan2(mouseY - this._knob.y, mouseX - this._knob.x);
            let rot: number = angle * 180 / Math.PI - 135;
            while(rot > 360) {
                rot -= 360
            }
            while(rot < 0) {
                rot += 360
            }
            if(rot > 270 && rot < 315 ) {
                rot = 270
            } 
            if(rot >= 315 && rot <= 360 ) {
                rot = 0
            } 
            this._value = rot / 270 * (this._max - this._min) + this._min;
            if(this._value != oldValue ) {
                dispatchEvent(new Event(Event.CHANGE));
            } 
            this._knob.rotation = rot + 135;
            this.formatValueLabel();
        } else if(this._mode == Knob.VERTICAL ) {
            let diff: number = this._startY - mouseY;
            let range: number = this._max - this._min;
            let percent: number = range / this._mouseRange;
            this._value += percent * diff;
            this.correctValue();
            if(this._value != oldValue ) {
                this.updateKnob();
                dispatchEvent(new Event(Event.CHANGE));
            } 
            this._startY = mouseY;
        } else if(this._mode == Knob.HORIZONTAL ) {
            diff = this._startX - mouseX;
            range = this._max - this._min;
            percent = range / this._mouseRange;
            this._value -= percent * diff;
            this.correctValue();
            if(this._value != oldValue ) {
                this.updateKnob();
                dispatchEvent(new Event(Event.CHANGE));
            } 
            this._startX = mouseX;
        } 
    }
    protected onMouseGoUp(event: MouseEvent): void {
        stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMoved);
        stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    public set maximum(m: number) {
        this._max = m;
        this.correctValue();
        this.updateKnob();
    }
    public get maximum(): number {
        return this._max;
    }
    public set minimum(m: number) {
        this._min = m;
        this.correctValue();
        this.updateKnob();
    }
    public get minimum(): number {
        return this._min;
    }
    public set value(v: number) {
        this._value = v;
        this.correctValue();
        this.updateKnob();
    }
    public get value(): number {
        return this._value;
    }
    public set mouseRange(value: number) {
        this._mouseRange = this.value;
    }
    public get mouseRange(): number {
        return this._mouseRange;
    }
    public set labelPrecision(decimals: number) {
        this._precision = decimals;
    }
    public get labelPrecision(): number {
        return this._precision;
    }
    public set showValue(value: boolean) {
        this._valueLabel.visible = this.value;
    }
    public get showValue(): boolean {
        return this._valueLabel.visible;
    }
    public set label(str: string) {
        this._labelText = str;
        this.draw();
    }
    public get label(): string {
        return this._labelText;
    }
    public set mode(value: string) {
        this._mode = this.value;
    }
    public get mode(): string {
        return this._mode;
    }
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this._width = this._radius * 2;
        this._height = this._radius * 2 + 40;
        this.invalidate();
    }
}