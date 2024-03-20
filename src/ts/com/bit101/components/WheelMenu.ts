import {Component} from "./Component";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
import {DropShadowFilter} from "../../../flash/filters/DropShadowFilter";
[Event(name = "select", type = "flash.events.Event")]
export class WheelMenu extends Component {
    protected _borderColor: number = 0xcccccc;
    protected _buttons: any[];
    protected _color: number = 0xffffff;
    protected _highlightColor: number = 0xeeeeee;
    protected _iconRadius: number;
    protected _innerRadius: number;
    protected _items: any[];
    protected _numButtons: number;
    protected _outerRadius: number;
    protected _selectedIndex: number = -1;
    protected _startingAngle: number = -90;
    public constructor(parent: DisplayObjectContainer, numButtons: number, outerRadius: number = 80, iconRadius: number = 60, innerRadius: number = 10, defaultHandler: Function = null) {
        this._numButtons = numButtons;
        this._outerRadius = outerRadius;
        this._iconRadius = iconRadius;
        this._innerRadius = innerRadius;
        addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
        super(parent);
        if(defaultHandler != null ) {
            addEventListener(Event.SELECT, defaultHandler);
        } 
    }
    protected init(): void {
        super.init();
        this._items = [];
        this.makeButtons();
        filters = [new DropShadowFilter(4, 45, 0, 1, 4, 4, .2, 4)];
    }
    protected makeButtons(): void {
        this._buttons = [];
        for(let i: number = 0; i < this._numButtons; i++) {
            let btn: ArcButton = new ArcButton(Math.PI * 2 / this._numButtons, this._outerRadius, this._iconRadius, this._innerRadius);
            btn.id = i;
            btn.rotation = this._startingAngle + 360 / this._numButtons * i;
            btn.addEventListener(Event.SELECT, this.onSelect);
            addChild(btn);
            this._buttons.push(btn);
        }
    }
    public hide(): void {
        visible = false;
        if(stage != null ) {
            stage.removeEventListener(MouseEvent.MOUSE_UP, this.onStageMouseUp);
        } 
    }
    public setItem(index: number, iconOrLabel: any, data: any = null): void {
        this._buttons[index].setIcon(iconOrLabel);
        this._items[index] = data;
    }
    public show(): void {
        parent.addChild(this);
        this.x = Math.round(parent.mouseX);
        this.y = Math.round(parent.mouseY);
        this._selectedIndex = -1;
        visible = true;
        stage.addEventListener(MouseEvent.MOUSE_UP, this.onStageMouseUp, true);
    }
    protected onAddedToStage(event: Event): void {
        this.hide();
        addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
    }
    protected onRemovedFromStage(event: Event): void {
        stage.removeEventListener(MouseEvent.MOUSE_UP, this.onStageMouseUp);
        removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
    }
    protected onSelect(event: Event): void {
        this._selectedIndex = event.target.id;
        dispatchEvent(new Event(Event.SELECT));
    }
    protected onStageMouseUp(event: MouseEvent): void {
        this.hide();
    }
    public set borderColor(value: number) {
        this._borderColor = value;
        for(let i: number = 0; i < this._numButtons; i++) {
            this._buttons[i].borderColor = this._borderColor;
        }
    }
    public get borderColor(): number {
        return this._borderColor;
    }
    public set color(value: number) {
        this._color = value;
        for(let i: number = 0; i < this._numButtons; i++) {
            this._buttons[i].color = this._color;
        }
    }
    public get color(): number {
        return this._color;
    }
    public set highlightColor(value: number) {
        this._highlightColor = value;
        for(let i: number = 0; i < this._numButtons; i++) {
            this._buttons[i].highlightColor = this._highlightColor;
        }
    }
    public get highlightColor(): number {
        return this._highlightColor;
    }
    public get selectedIndex(): number {
        return this._selectedIndex;
    }
    public get selectedItem(): any {
        return this._items[this._selectedIndex];
    }
}
import {DisplayObject} from "../../../flash/display/DisplayObject";
import {Sprite} from "../../../flash/display/Sprite";
import {Shape} from "../../../flash/display/Shape";
import {Label} from "./Label";
class ArcButton extends Sprite {
    public id: number;
    protected _arc: number;
    protected _bg: Shape;
    protected _borderColor: number = 0xcccccc;
    protected _color: number = 0xffffff;
    protected _highlightColor: number = 0xeeeeee;
    protected _icon: DisplayObject;
    protected _iconHolder: Sprite;
    protected _iconRadius: number;
    protected _innerRadius: number;
    protected _outerRadius: number;
    public constructor(arc: number, outerRadius: number, iconRadius: number, innerRadius: number) {
        super();
        this._arc = arc;
        this._outerRadius = outerRadius;
        this._iconRadius = iconRadius;
        this._innerRadius = innerRadius;
        this._bg = new Shape();
        addChild(this._bg);
        this._iconHolder = new Sprite();
        addChild(this._iconHolder);
        this.drawArc(0xffffff);
        addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
        addEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
        addEventListener(MouseEvent.MOUSE_UP, this.onMouseGoUp);
    }
    protected drawArc(color: number): void {
        this._bg.graphics.clear();
        this._bg.graphics.lineStyle(2, this._borderColor);
        this._bg.graphics.beginFill(color);
        this._bg.graphics.moveTo(this._innerRadius, 0);
        this._bg.graphics.lineTo(this._outerRadius, 0);
        for(let i: number = 0; i < this._arc; i += .05) {
            this._bg.graphics.lineTo(Math.cos(i) * this._outerRadius, Math.sin(i) * this._outerRadius);
        }
        this._bg.graphics.lineTo(Math.cos(this._arc) * this._outerRadius, Math.sin(this._arc) * this._outerRadius);
        this._bg.graphics.lineTo(Math.cos(this._arc) * this._innerRadius, Math.sin(this._arc) * this._innerRadius);
        for(i = this._arc; i > 0; i -= .05) {
            this._bg.graphics.lineTo(Math.cos(i) * this._innerRadius, Math.sin(i) * this._innerRadius);
        }
        this._bg.graphics.lineTo(this._innerRadius, 0);
        graphics.endFill();
    }
    public setIcon(iconOrLabel: any): void {
        if(iconOrLabel == null ) {
            return
        } 
        while(this._iconHolder.numChildren > 0) {
            this._iconHolder.removeChildAt(0)
        }
        if(iconOrLabel instanceof Class ) {
            this._icon = new iconOrLabel as Class() as DisplayObject;
        } else if(iconOrLabel instanceof DisplayObject ) {
            this._icon = iconOrLabel as DisplayObject;
        } else if(iconOrLabel instanceof String ) {
            this._icon = new Label(null, 0, 0, iconOrLabel as string);
            (this._icon as Label).draw();
        } 
        if(this._icon != null ) {
            let angle: number = this._bg.rotation * Math.PI / 180;
            this._icon.x = Math.round(-this._icon.width / 2);
            this._icon.y = Math.round(-this._icon.height / 2);
            this._iconHolder.addChild(this._icon);
            this._iconHolder.x = Math.round(Math.cos(angle + this._arc / 2) * this._iconRadius);
            this._iconHolder.y = Math.round(Math.sin(angle + this._arc / 2) * this._iconRadius);
        } 
    }
    protected onMouseOver(event: MouseEvent): void {
        this.drawArc(this._highlightColor);
    }
    protected onMouseOut(event: MouseEvent): void {
        this.drawArc(this._color);
    }
    protected onMouseGoUp(event: MouseEvent): void {
        dispatchEvent(new Event(Event.SELECT));
    }
    public set borderColor(value: number) {
        this._borderColor = value;
        this.drawArc(this._color);
    }
    public get borderColor(): number {
        return this._borderColor;
    }
    public set color(value: number) {
        this._color = value;
        this.drawArc(this._color);
    }
    public get color(): number {
        return this._color;
    }
    public set highlightColor(value: number) {
        this._highlightColor = value;
    }
    public get highlightColor(): number {
        return this._highlightColor;
    }
    public set rotation(value: number) {
        this._bg.rotation = value;
    }
    public get rotation(): number {
        return this._bg.rotation;
    }
}