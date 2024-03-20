import {Chart} from "./Chart";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
export class LineChart extends Chart {
    protected _lineWidth: number = 1;
    protected _lineColor: number = 0x999999;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, data: any[] = null) {
        super(parent, xpos, ypos, data);
    }
    protected drawChart(): void {
        let border: number = 2;
        let lineWidth: number = (this._width - border) / (this._data.length - 1);
        let chartHeight: number = this._height - border;
        this._chartHolder.x = 0;
        this._chartHolder.y = this._height;
        let xpos: number = border;
        let max: number = this.getMaxValue();
        let min: number = this.getMinValue();
        let scale: number = chartHeight / (max - min);
        this._chartHolder.graphics.lineStyle(this._lineWidth, this._lineColor);
        this._chartHolder.graphics.moveTo(xpos, (this._data[0] - min) * -scale);
        xpos += lineWidth;
        for(let i: number = 1; i < this._data.length; i++) {
            if(this._data[i] != null ) {
                this._chartHolder.graphics.lineTo(xpos, (this._data[i] - min) * -scale);
            } 
            xpos += lineWidth;
        }
    }
    public set lineWidth(value: number) {
        this._lineWidth = value;
        this.invalidate();
    }
    public get lineWidth(): number {
        return this._lineWidth;
    }
    public set lineColor(value: number) {
        this._lineColor = value;
        this.invalidate();
    }
    public get lineColor(): number {
        return this._lineColor;
    }
}