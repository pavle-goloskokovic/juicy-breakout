import {ColorConverter} from "./utilities/ColorConverter";
import {GradientType} from "../../../flash/display/GradientType";
import {Shape} from "../../../flash/display/Shape";
import {SpreadMethod} from "../../../flash/display/SpreadMethod";
import {Sprite} from "../../../flash/display/Sprite";
import {Event} from "../../../flash/events/Event";
import {Matrix} from "../../../flash/geom/Matrix";
export class FadedBackground extends Sprite {
    private _base_color: number = 0x619928;
    private _faded_color: number;
    private _gfx: Shape;
    private _baseWidth: number = 0;
    private _baseHeight: number = 0;
    private _stageNormalWidth: number = 0;
    private _stageNormalHeight: number = 0;
    private _ratios: any[];
    public constructor(newColor: number, stageNormalWidth: number, stageNormalHeight: number, fadedColor: number = 0x000000, ratios: any[] = null) {
        super();
        this._base_color = newColor;
        this._stageNormalWidth = stageNormalWidth;
        this._stageNormalHeight = stageNormalHeight;
        if(fadedColor == 0x000000 ) {
            let fadedColorHSB: any[] = ColorConverter.UINTtoHSB(this._base_color);
            fadedColorHSB[2] *= 0.3;
            fadedColor = ColorConverter.HSBtoUINT(fadedColorHSB[0], fadedColorHSB[1], fadedColorHSB[2]);
        } 
        this._faded_color = fadedColor;
        if(!ratios ) {
            ratios = [0x00, 0xFF]
        } 
        this._ratios = ratios;
        this._gfx = new Shape();
        this.addChild(this._gfx);
        this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStageHandler);
    }
    private resizeHandler(event: Event): void {
        let stageRatio: number = this.stage.stageWidth / this.stage.stageHeight;
        let bkgRatio: number = this._baseWidth / this._baseWidth;
        if(stageRatio >= bkgRatio ) {
            this.width = this.stage.stageWidth;
            this.height = this.width / this._baseWidth * this._baseWidth;
        } else {
            this.height = this.stage.stageHeight;
            this.width = this.height / this._baseWidth * this._baseWidth;
        }
    }
    private addedToStageHandler(event: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.addedToStageHandler);
        this.redraw();
        this.resizeHandler(null);
        this.stage.addEventListener(Event.RESIZE, this.resizeHandler);
    }
    public redraw(newColor: number = -1): void {
        if(newColor >= 0 ) {
            this._base_color = newColor
        } 
        this.graphics.clear();
        let fillType: string = GradientType.RADIAL;
        let colors: any[] = [this._base_color, this._faded_color];
        let alphas: any[] = [1, 1];
        let ratios: any[] = this._ratios;
        let matr: Matrix = new Matrix();
        matr.createGradientBox(300, 300, 0, -50, -50);
        let spreadMethod: string = SpreadMethod.PAD;
        this._gfx.graphics.beginGradientFill(fillType, colors, alphas, ratios, matr, spreadMethod, null);
        this._gfx.graphics.drawRect(0, 0, 200, 200);
        this._baseWidth = this._gfx.width;
        this._baseWidth = this._gfx.height;
        this._gfx.x = -this._baseWidth / 2;
        this._gfx.y = -this._baseWidth / 2;
        this.x = this._stageNormalWidth / 2;
        this.y = this._stageNormalHeight / 2;
    }
}