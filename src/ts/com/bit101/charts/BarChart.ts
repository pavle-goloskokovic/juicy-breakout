import {Chart} from "./Chart";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
export class BarChart extends Chart {
    protected _spacing: number = 2;
    protected _barColor: number = 0x999999;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, data: any[] = null) {
        super(parent, xpos, ypos, data);
    }
    protected drawChart(): void {
        let border: number = 2;
        let totalSpace: number = this._spacing * this._data.length;
        let barWidth: number = (this._width - border - totalSpace) / this._data.length;
        let chartHeight: number = this._height - border;
        this._chartHolder.x = 0;
        this._chartHolder.y = this._height;
        let xpos: number = border;
        let max: number = this.getMaxValue();
        let min: number = this.getMinValue();
        let scale: number = chartHeight / (max - min);
        for(let i: number = 0; i < this._data.length; i++) {
            if(this._data[i] != null ) {
                this._chartHolder.graphics.beginFill(this._barColor);
                this._chartHolder.graphics.drawRect(xpos, 0, barWidth, (this._data[i] - min) * -scale);
                this._chartHolder.graphics.endFill();
            } 
            xpos += barWidth + this._spacing;
        }
    }
    public set spacing(value: number) {
        this._spacing = value;
        this.invalidate();
    }
    public get spacing(): number {
        return this._spacing;
    }
    public set barColor(value: number) {
        this._barColor = value;
        this.invalidate();
    }
    public get barColor(): number {
        return this._barColor;
    }
}