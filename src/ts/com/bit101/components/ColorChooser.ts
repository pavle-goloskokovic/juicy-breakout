import {Component} from "./Component";
import {InputText} from "./InputText";
import {Bitmap} from "../../../flash/display/Bitmap";
import {BitmapData} from "../../../flash/display/BitmapData";
import {BlendMode} from "../../../flash/display/BlendMode";
import {DisplayObject} from "../../../flash/display/DisplayObject";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {GradientType} from "../../../flash/display/GradientType";
import {Graphics} from "../../../flash/display/Graphics";
import {InterpolationMethod} from "../../../flash/display/InterpolationMethod";
import {SpreadMethod} from "../../../flash/display/SpreadMethod";
import {Sprite} from "../../../flash/display/Sprite";
import {Stage} from "../../../flash/display/Stage";
import {Event} from "../../../flash/events/Event";
import {MouseEvent} from "../../../flash/events/MouseEvent";
import {Matrix} from "../../../flash/geom/Matrix";
import {Point} from "../../../flash/geom/Point";
[Event(name = "change", type = "flash.events.Event")]
export class ColorChooser extends Component {
    public static TOP: string = "top";
    public static BOTTOM: string = "bottom";
    protected _colors: BitmapData;
    protected _colorsContainer: Sprite;
    protected _defaultModelColors: any[] = [0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0xFF0000, 0xFFFFFF, 0x000000];
    protected _input: InputText;
    protected _model: DisplayObject;
    protected _oldColorChoice: number = _value;
    protected _popupAlign: string = BOTTOM;
    protected _stage: Stage;
    protected _swatch: Sprite;
    protected _tmpColorChoice: number = _value;
    protected _usePopup: boolean = false;
    protected _value: number = 0xff0000;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, value: number = 0xff0000, defaultHandler: Function = null) {
        this._oldColorChoice = (this._tmpColorChoice = (this._value = value));
        super(parent, xpos, ypos);
        if(defaultHandler != null ) {
            addEventListener(Event.CHANGE, defaultHandler);
        } 
    }
    protected init(): void {
        super.init();
        this._width = 65;
        this._height = 15;
        this.value = this._value;
    }
    protected addChildren(): void {
        this._input = new InputText();
        this._input.width = 45;
        this._input.restrict = "0123456789ABCDEFabcdef";
        this._input.maxChars = 6;
        addChild(this._input);
        this._input.addEventListener(Event.CHANGE, this.onChange);
        this._swatch = new Sprite();
        this._swatch.x = 50;
        this._swatch.filters = [this.getShadow(2, true)];
        addChild(this._swatch);
        this._colorsContainer = new Sprite();
        this._colorsContainer.addEventListener(Event.ADDED_TO_STAGE, this.onColorsAddedToStage);
        this._colorsContainer.addEventListener(Event.REMOVED_FROM_STAGE, this.onColorsRemovedFromStage);
        this._model = this.getDefaultModel();
        this.drawColors(this._model);
    }
    public draw(): void {
        super.draw();
        this._swatch.graphics.clear();
        this._swatch.graphics.beginFill(this._value);
        this._swatch.graphics.drawRect(0, 0, 16, 16);
        this._swatch.graphics.endFill();
    }
    protected onChange(event: Event): void {
        event.stopImmediatePropagation();
        this._value = parseInt("0x" + this._input.text, 16);
        this._input.text = this._input.text.toUpperCase();
        this._oldColorChoice = this.value;
        this.invalidate();
        dispatchEvent(new Event(Event.CHANGE));
    }
    public set value(n: number) {
        let str: string = n.toString(16).toUpperCase();
        while(str.length < 6) {
            str = "0" + str;
        }
        this._input.text = str;
        this._value = parseInt("0x" + this._input.text, 16);
        this.invalidate();
    }
    public get value(): number {
        return this._value;
    }
    public get model(): DisplayObject {
        return this._model;
    }
    public set model(value: DisplayObject) {
        this._model = value;
        if(this._model != null ) {
            this.drawColors(this._model);
            if(!this.usePopup ) {
                this.usePopup = true
            } 
        } else {
            this._model = this.getDefaultModel();
            this.drawColors(this._model);
            this.usePopup = false;
        }
    }
    protected drawColors(d: DisplayObject): void {
        this._colors = new BitmapData(d.width, d.height);
        this._colors.draw(d);
        while(this._colorsContainer.numChildren) {
            this._colorsContainer.removeChildAt(0)
        }
        this._colorsContainer.addChild(new Bitmap(this._colors));
        this.placeColors();
    }
    public get popupAlign(): string {
        return this._popupAlign;
    }
    public set popupAlign(value: string) {
        this._popupAlign = value;
        this.placeColors();
    }
    public get usePopup(): boolean {
        return this._usePopup;
    }
    public set usePopup(value: boolean) {
        this._usePopup = value;
        this._swatch.buttonMode = true;
        this._colorsContainer.buttonMode = true;
        this._colorsContainer.addEventListener(MouseEvent.MOUSE_MOVE, this.browseColorChoice);
        this._colorsContainer.addEventListener(MouseEvent.MOUSE_OUT, this.backToColorChoice);
        this._colorsContainer.addEventListener(MouseEvent.CLICK, this.setColorChoice);
        this._swatch.addEventListener(MouseEvent.CLICK, this.onSwatchClick);
        if(!this._usePopup ) {
            this._swatch.buttonMode = false;
            this._colorsContainer.buttonMode = false;
            this._colorsContainer.removeEventListener(MouseEvent.MOUSE_MOVE, this.browseColorChoice);
            this._colorsContainer.removeEventListener(MouseEvent.MOUSE_OUT, this.backToColorChoice);
            this._colorsContainer.removeEventListener(MouseEvent.CLICK, this.setColorChoice);
            this._swatch.removeEventListener(MouseEvent.CLICK, this.onSwatchClick);
        } 
    }
    protected onColorsRemovedFromStage(e: Event): void {
        this._stage.removeEventListener(MouseEvent.CLICK, this.onStageClick);
    }
    protected onColorsAddedToStage(e: Event): void {
        this._stage = stage;
        this._stage.addEventListener(MouseEvent.CLICK, this.onStageClick);
    }
    protected onStageClick(e: MouseEvent): void {
        this.displayColors();
    }
    protected onSwatchClick(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.displayColors();
    }
    protected backToColorChoice(e: MouseEvent): void {
        this.value = this._oldColorChoice;
    }
    protected setColorChoice(e: MouseEvent): void {
        this.value = this._colors.getPixel(this._colorsContainer.mouseX, this._colorsContainer.mouseY);
        this._oldColorChoice = this.value;
        dispatchEvent(new Event(Event.CHANGE));
        this.displayColors();
    }
    protected browseColorChoice(e: MouseEvent): void {
        this._tmpColorChoice = this._colors.getPixel(this._colorsContainer.mouseX, this._colorsContainer.mouseY);
        this.value = this._tmpColorChoice;
    }
    protected displayColors(): void {
        this.placeColors();
        if(this._colorsContainer.parent ) {
            this._colorsContainer.parent.removeChild(this._colorsContainer)
        } else {
            stage.addChild(this._colorsContainer)
        }
    }
    protected placeColors(): void {
        let point: Point = new Point(this.x, this.y);
        if(parent ) {
            point = parent.localToGlobal(point)
        } 
        switch(this._popupAlign) {
            case ColorChooser.TOP:
            {
                this._colorsContainer.x = point.x
                this._colorsContainer.y = point.y - this._colorsContainer.height - 4
            }
            break;
            case ColorChooser.BOTTOM:
            {
                this._colorsContainer.x = point.x
                this._colorsContainer.y = point.y + 22
            }
            break;
            default:
            {
                this._colorsContainer.x = point.x
                this._colorsContainer.y = point.y + 22
            }
            break;
        }
    }
    protected getDefaultModel(): Sprite {
        let w: number = 100;
        let h: number = 100;
        let bmd: BitmapData = new BitmapData(w, h);
        let g1: Sprite = this.getGradientSprite(w, h, this._defaultModelColors);
        bmd.draw(g1);
        let blendmodes: any[] = [BlendMode.MULTIPLY, BlendMode.ADD];
        let nb: number = blendmodes.length;
        let g2: Sprite = this.getGradientSprite(h / nb, w, [0xFFFFFF, 0x000000]);
        for(let i: number = 0; i < nb; i++) {
            let blendmode: string = blendmodes[i];
            let m: Matrix = new Matrix();
            m.rotate(-Math.PI / 2);
            m.translate(0, h / nb * i + h / nb);
            bmd.draw(g2, m, null, blendmode);
        }
        let s: Sprite = new Sprite();
        let bm: Bitmap = new Bitmap(bmd);
        s.addChild(bm);
        return s;
    }
    protected getGradientSprite(w: number, h: number, gc: any[]): Sprite {
        let gs: Sprite = new Sprite();
        let g: Graphics = gs.graphics;
        let gn: number = gc.length;
        let ga: any[] = [];
        let gr: any[] = [];
        let gm: Matrix = new Matrix();
        gm.createGradientBox(w, h, 0, 0, 0);
        for(let i: number = 0; i < gn; i++) {
            ga.push(1);
            gr.push(0x00 + 0xFF / (gn - 1) * i);
        }
        g.beginGradientFill(GradientType.LINEAR, gc, ga, gr, gm, SpreadMethod.PAD, InterpolationMethod.RGB);
        g.drawRect(0, 0, w, h);
        g.endFill();
        return gs;
    }
}