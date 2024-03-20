import {Panel} from "./Panel";
import {VScrollBar} from "./VScrollBar";
import {HScrollBar} from "./HScrollBar";
import {Style} from "./Style";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Shape} from "../../../flash/display/Shape";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
import {Rectangle} from "../../../flash/geom/Rectangle";
export class ScrollPane extends Panel {
    protected _vScrollbar: VScrollBar;
    protected _hScrollbar: HScrollBar;
    protected _corner: Shape;
    protected _dragContent: boolean = true;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0) {
        super(parent, xpos, ypos);
    }
    protected init(): void {
        super.init();
        addEventListener(Event.RESIZE, this.onResize);
        this._background.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
        this._background.useHandCursor = true;
        this._background.buttonMode = true;
        this.setSize(100, 100);
    }
    protected addChildren(): void {
        super.addChildren();
        this._vScrollbar = new VScrollBar(null, this.width - 10, 0, this.onScroll);
        this._hScrollbar = new HScrollBar(null, 0, this.height - 10, this.onScroll);
        this.addRawChild(this._vScrollbar);
        this.addRawChild(this._hScrollbar);
        this._corner = new Shape();
        this._corner.graphics.beginFill(Style.BUTTON_FACE);
        this._corner.graphics.drawRect(0, 0, 10, 10);
        this._corner.graphics.endFill();
        this.addRawChild(this._corner);
    }
    public draw(): void {
        super.draw();
        let vPercent: number = (this._height - 10) / this.content.height;
        let hPercent: number = (this._width - 10) / this.content.width;
        this._vScrollbar.x = this.width - 10;
        this._hScrollbar.y = this.height - 10;
        if(hPercent >= 1 ) {
            this._vScrollbar.height = this.height;
            this._mask.height = this.height;
        } else {
            this._vScrollbar.height = this.height - 10;
            this._mask.height = this.height - 10;
        }
        if(vPercent >= 1 ) {
            this._hScrollbar.width = this.width;
            this._mask.width = this.width;
        } else {
            this._hScrollbar.width = this.width - 10;
            this._mask.width = this.width - 10;
        }
        this._vScrollbar.setThumbPercent(vPercent);
        this._vScrollbar.maximum = Math.max(0, this.content.height - this._height + 10);
        this._vScrollbar.pageSize = this._height - 10;
        this._hScrollbar.setThumbPercent(hPercent);
        this._hScrollbar.maximum = Math.max(0, this.content.width - this._width + 10);
        this._hScrollbar.pageSize = this._width - 10;
        this._corner.x = this.width - 10;
        this._corner.y = this.height - 10;
        this._corner.visible = hPercent < 1 && vPercent < 1;
        this.content.x = -this._hScrollbar.value;
        this.content.y = -this._vScrollbar.value;
    }
    public update(): void {
        this.invalidate();
    }
    protected onScroll(event: Event): void {
        this.content.x = -this._hScrollbar.value;
        this.content.y = -this._vScrollbar.value;
    }
    protected onResize(event: Event): void {
        this.invalidate();
    }
    protected onMouseGoDown(event: MouseEvent): void {
        this.content.startDrag(false, new Rectangle(0, 0, Math.min(0, this._width - this.content.width - 10), Math.min(0, this._height - this.content.height - 10)));
        stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove);
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected onMouseMove(event: MouseEvent): void {
        this._hScrollbar.value = -this.content.x;
        this._vScrollbar.value = -this.content.y;
    }
    protected onMouseGoUp(event: MouseEvent): void {
        this.content.stopDrag();
        stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove);
        stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    public set dragContent(value: boolean) {
        this._dragContent = value;
        if(this._dragContent ) {
            this._background.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
            this._background.useHandCursor = true;
            this._background.buttonMode = true;
        } else {
            this._background.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseGoDown);
            this._background.useHandCursor = false;
            this._background.buttonMode = false;
        }
    }
    public get dragContent(): boolean {
        return this._dragContent;
    }
    public set autoHideScrollBar(value: boolean) {
        this._vScrollbar.autoHide = value;
        this._hScrollbar.autoHide = value;
    }
    public get autoHideScrollBar(): boolean {
        return this._vScrollbar.autoHide;
    }
}