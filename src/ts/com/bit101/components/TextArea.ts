import {Text} from "./Text";
import {VScrollBar} from "./VScrollBar";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
export class TextArea extends Text {
    protected _scrollbar: VScrollBar;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, text: string = "") {
        super(parent, xpos, ypos, text);
    }
    protected init(): void {
        super.init();
        this.addEventListener(MouseEvent.MOUSE_WHEEL, this.onMouseWheel);
    }
    protected addChildren(): void {
        super.addChildren();
        this._scrollbar = new VScrollBar(this, 0, 0, this.onScrollbarScroll);
        this._tf.addEventListener(Event.SCROLL, this.onTextScroll);
    }
    protected updateScrollbar(): void {
        let visibleLines: number = this._tf.numLines - this._tf.maxScrollV + 1;
        let percent: number = visibleLines / this._tf.numLines;
        this._scrollbar.setSliderParams(1, this._tf.maxScrollV, this._tf.scrollV);
        this._scrollbar.setThumbPercent(percent);
        this._scrollbar.pageSize = visibleLines;
    }
    public draw(): void {
        super.draw();
        this._tf.width = this._width - this._scrollbar.width - 4;
        this._scrollbar.x = this._width - this._scrollbar.width;
        this._scrollbar.height = this._height;
        this._scrollbar.draw();
        this.addEventListener(Event.ENTER_FRAME, this.onTextScrollDelay);
    }
    protected onTextScrollDelay(event: Event): void {
        this.removeEventListener(Event.ENTER_FRAME, this.onTextScrollDelay);
        this.updateScrollbar();
    }
    protected onChange(event: Event): void {
        super.onChange(event);
        this.updateScrollbar();
    }
    protected onScrollbarScroll(event: Event): void {
        this._tf.scrollV = Math.round(this._scrollbar.value);
    }
    protected onTextScroll(event: Event): void {
        this._scrollbar.value = this._tf.scrollV;
        this.updateScrollbar();
    }
    protected onMouseWheel(event: MouseEvent): void {
        this._scrollbar.value -= event.delta;
        this._tf.scrollV = Math.round(this._scrollbar.value);
    }
    public set enabled(value: boolean) {
        super.enabled = value;
        this._tf.tabEnabled = value;
    }
    public set autoHideScrollBar(value: boolean) {
        this._scrollbar.autoHide = value;
    }
    public get autoHideScrollBar(): boolean {
        return this._scrollbar.autoHide;
    }
}