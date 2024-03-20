import {Component} from "./Component";
import {PushButton} from "./PushButton";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Shape} from "../../../flash/display/Shape";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
import {TimerEvent} from "../../../flash/events/TimerEvent";
import {Timer} from "../../../flash/utils/Timer";
[Event(name = "change", type = "flash.events.Event")]
export class ScrollBar extends Component {
    protected DELAY_TIME: number = 500;
    protected REPEAT_TIME: number = 100;
    protected UP: string = "up";
    protected DOWN: string = "down";
    protected _autoHide: boolean = false;
    protected _upButton: PushButton;
    protected _downButton: PushButton;
    protected _scrollSlider: ScrollSlider;
    protected _orientation: string;
    protected _lineSize: number = 1;
    protected _delayTimer: Timer;
    protected _repeatTimer: Timer;
    protected _direction: string;
    protected _shouldRepeat: boolean = false;
    public constructor(orientation: string, parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, defaultHandler: Function = null) {
        this._orientation = orientation;
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            addEventListener(Event.CHANGE, defaultHandler);
        } 
    }
    protected addChildren(): void {
        this._scrollSlider = new ScrollSlider(this._orientation, this, 0, 10, this.onChange);
        this._upButton = new PushButton(this, 0, 0, "");
        this._upButton.addEventListener(MouseEvent.MOUSE_DOWN, this.onUpClick);
        this._upButton.setSize(10, 10);
        let upArrow: Shape = new Shape();
        this._upButton.addChild(upArrow);
        this._downButton = new PushButton(this, 0, 0, "");
        this._downButton.addEventListener(MouseEvent.MOUSE_DOWN, this.onDownClick);
        this._downButton.setSize(10, 10);
        let downArrow: Shape = new Shape();
        this._downButton.addChild(downArrow);
        if(this._orientation == Slider.VERTICAL ) {
            upArrow.graphics.beginFill(Style.DROPSHADOW, 0.5);
            upArrow.graphics.moveTo(5, 3);
            upArrow.graphics.lineTo(7, 6);
            upArrow.graphics.lineTo(3, 6);
            upArrow.graphics.endFill();
            downArrow.graphics.beginFill(Style.DROPSHADOW, 0.5);
            downArrow.graphics.moveTo(5, 7);
            downArrow.graphics.lineTo(7, 4);
            downArrow.graphics.lineTo(3, 4);
            downArrow.graphics.endFill();
        } else {
            upArrow.graphics.beginFill(Style.DROPSHADOW, 0.5);
            upArrow.graphics.moveTo(3, 5);
            upArrow.graphics.lineTo(6, 7);
            upArrow.graphics.lineTo(6, 3);
            upArrow.graphics.endFill();
            downArrow.graphics.beginFill(Style.DROPSHADOW, 0.5);
            downArrow.graphics.moveTo(7, 5);
            downArrow.graphics.lineTo(4, 7);
            downArrow.graphics.lineTo(4, 3);
            downArrow.graphics.endFill();
        }
    }
    protected init(): void {
        super.init();
        if(this._orientation == Slider.HORIZONTAL ) {
            this.setSize(100, 10);
        } else {
            this.setSize(10, 100);
        }
        this._delayTimer = new Timer(this.DELAY_TIME, 1);
        this._delayTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this.onDelayComplete);
        this._repeatTimer = new Timer(this.REPEAT_TIME);
        this._repeatTimer.addEventListener(TimerEvent.TIMER, this.onRepeat);
    }
    public setSliderParams(min: number, max: number, value: number): void {
        this._scrollSlider.setSliderParams(min, max, value);
    }
    public setThumbPercent(value: number): void {
        this._scrollSlider.setThumbPercent(value);
    }
    public draw(): void {
        super.draw();
        if(this._orientation == Slider.VERTICAL ) {
            this._scrollSlider.x = 0;
            this._scrollSlider.y = 10;
            this._scrollSlider.width = 10;
            this._scrollSlider.height = this._height - 20;
            this._downButton.x = 0;
            this._downButton.y = this._height - 10;
        } else {
            this._scrollSlider.x = 10;
            this._scrollSlider.y = 0;
            this._scrollSlider.width = this._width - 20;
            this._scrollSlider.height = 10;
            this._downButton.x = this._width - 10;
            this._downButton.y = 0;
        }
        this._scrollSlider.draw();
        if(this._autoHide ) {
            visible = this._scrollSlider.thumbPercent < 1.0;
        } else {
            visible = true;
        }
    }
    public set autoHide(value: boolean) {
        this._autoHide = this.value;
        this.invalidate();
    }
    public get autoHide(): boolean {
        return this._autoHide;
    }
    public set value(v: number) {
        this._scrollSlider.value = v;
    }
    public get value(): number {
        return this._scrollSlider.value;
    }
    public set minimum(v: number) {
        this._scrollSlider.minimum = v;
    }
    public get minimum(): number {
        return this._scrollSlider.minimum;
    }
    public set maximum(v: number) {
        this._scrollSlider.maximum = v;
    }
    public get maximum(): number {
        return this._scrollSlider.maximum;
    }
    public set lineSize(value: number) {
        this._lineSize = this.value;
    }
    public get lineSize(): number {
        return this._lineSize;
    }
    public set pageSize(value: number) {
        this._scrollSlider.pageSize = this.value;
        this.invalidate();
    }
    public get pageSize(): number {
        return this._scrollSlider.pageSize;
    }
    protected onUpClick(event: MouseEvent): void {
        this.goUp();
        this._shouldRepeat = true;
        this._direction = this.UP;
        this._delayTimer.start();
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected goUp(): void {
        this._scrollSlider.value -= this._lineSize;
        dispatchEvent(new Event(Event.CHANGE));
    }
    protected onDownClick(event: MouseEvent): void {
        this.goDown();
        this._shouldRepeat = true;
        this._direction = this.DOWN;
        this._delayTimer.start();
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected goDown(): void {
        this._scrollSlider.value += this._lineSize;
        dispatchEvent(new Event(Event.CHANGE));
    }
    protected onMouseGoUp(event: MouseEvent): void {
        this._delayTimer.stop();
        this._repeatTimer.stop();
        this._shouldRepeat = false;
    }
    protected onChange(event: Event): void {
        dispatchEvent(event);
    }
    protected onDelayComplete(event: TimerEvent): void {
        if(this._shouldRepeat ) {
            this._repeatTimer.start();
        } 
    }
    protected onRepeat(event: TimerEvent): void {
        if(this._direction == this.UP ) {
            this.goUp();
        } else {
            this.goDown();
        }
    }
}
import {Rectangle} from "../../../flash/geom/Rectangle";
import {Slider} from "./Slider";
import {Style} from "./Style";
class ScrollSlider extends Slider {
    protected _thumbPercent: number = 1.0;
    protected _pageSize: number = 1;
    public constructor(orientation: string, parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, defaultHandler: Function = null) {
        super(orientation, parent, xpos, ypos);
        if(defaultHandler != null ) {
            addEventListener(Event.CHANGE, defaultHandler);
        } 
    }
    protected init(): void {
        super.init();
        this.setSliderParams(1, 1, 0);
        this.backClick = true;
    }
    protected drawHandle(): void {
        let size: number;
        this._handle.graphics.clear();
        if(this._orientation == Slider.HORIZONTAL ) {
            size = Math.round(this._width * this._thumbPercent);
            size = Math.max(this._height, size);
            this._handle.graphics.beginFill(0, 0);
            this._handle.graphics.drawRect(0, 0, size, this._height);
            this._handle.graphics.endFill();
            this._handle.graphics.beginFill(Style.BUTTON_FACE);
            this._handle.graphics.drawRect(1, 1, size - 2, this._height - 2);
        } else {
            size = Math.round(this._height * this._thumbPercent);
            size = Math.max(this._width, size);
            this._handle.graphics.beginFill(0, 0);
            this._handle.graphics.drawRect(0, 0, this._width - 2, size);
            this._handle.graphics.endFill();
            this._handle.graphics.beginFill(Style.BUTTON_FACE);
            this._handle.graphics.drawRect(1, 1, this._width - 2, size - 2);
        }
        this._handle.graphics.endFill();
        this.positionHandle();
    }
    protected positionHandle(): void {
        let range: number;
        if(this._orientation == Slider.HORIZONTAL ) {
            range = this.width - this._handle.width;
            this._handle.x = (this._value - this._min) / (this._max - this._min) * range;
        } else {
            range = this.height - this._handle.height;
            this._handle.y = (this._value - this._min) / (this._max - this._min) * range;
        }
    }
    public setThumbPercent(value: number): void {
        this._thumbPercent = Math.min(value, 1.0);
        this.invalidate();
    }
    protected onBackClick(event: MouseEvent): void {
        if(this._orientation == Slider.HORIZONTAL ) {
            if(mouseX < this._handle.x ) {
                if(this._max > this._min ) {
                    this._value -= this._pageSize;
                } else {
                    this._value += this._pageSize;
                }
                this.correctValue();
            } else {
                if(this._max > this._min ) {
                    this._value += this._pageSize;
                } else {
                    this._value -= this._pageSize;
                }
                this.correctValue();
            }
            this.positionHandle();
        } else {
            if(mouseY < this._handle.y ) {
                if(this._max > this._min ) {
                    this._value -= this._pageSize;
                } else {
                    this._value += this._pageSize;
                }
                this.correctValue();
            } else {
                if(this._max > this._min ) {
                    this._value += this._pageSize;
                } else {
                    this._value -= this._pageSize;
                }
                this.correctValue();
            }
            this.positionHandle();
        }
        dispatchEvent(new Event(Event.CHANGE));
    }
    protected onDrag(event: MouseEvent): void {
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onDrop);
        stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onSlide);
        if(this._orientation == Slider.HORIZONTAL ) {
            this._handle.startDrag(false, new Rectangle(0, 0, this._width - this._handle.width, 0));
        } else {
            this._handle.startDrag(false, new Rectangle(0, 0, 0, this._height - this._handle.height));
        }
    }
    protected onSlide(event: MouseEvent): void {
        let oldValue: number = this._value;
        if(this._orientation == Slider.HORIZONTAL ) {
            if(this._width == this._handle.width ) {
                this._value = this._min;
            } else {
                this._value = this._handle.x / (this._width - this._handle.width) * (this._max - this._min) + this._min;
            }
        } else {
            if(this._height == this._handle.height ) {
                this._value = this._min;
            } else {
                this._value = this._handle.y / (this._height - this._handle.height) * (this._max - this._min) + this._min;
            }
        }
        if(this._value != oldValue ) {
            dispatchEvent(new Event(Event.CHANGE));
        } 
    }
    public set pageSize(value: number) {
        this._pageSize = this.value;
        this.invalidate();
    }
    public get pageSize(): number {
        return this._pageSize;
    }
    public get thumbPercent(): number {
        return this._thumbPercent;
    }
}