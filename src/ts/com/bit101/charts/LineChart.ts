import { Chart } from './Chart';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class LineChart extends Chart {
    protected _lineWidth = 1;
    protected _lineColor = 0x999999;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, data: any[] = null)
    {
        super(parent, xpos, ypos, data);
    }

    protected drawChart (): void
    {
        const border = 2;
        const lineWidth: number = (this._width - border) / (this._data.length - 1);
        const chartHeight: number = this._height - border;
        this._chartHolder.x = 0;
        this._chartHolder.y = this._height;
        let xpos: number = border;
        const max: number = this.getMaxValue();
        const min: number = this.getMinValue();
        const scale: number = chartHeight / (max - min);
        this._chartHolder.graphics.lineStyle(this._lineWidth, this._lineColor);
        this._chartHolder.graphics.moveTo(xpos, (this._data[0] - min) * -scale);
        xpos += lineWidth;
        for (let i = 1; i < this._data.length; i++)
        {
            if (this._data[i] != null )
            {
                this._chartHolder.graphics.lineTo(xpos, (this._data[i] - min) * -scale);
            }
            xpos += lineWidth;
        }
    }

    set lineWidth (value: number)
    {
        this._lineWidth = value;
        this.invalidate();
    }

    get lineWidth (): number
    {
        return this._lineWidth;
    }

    set lineColor (value: number)
    {
        this._lineColor = value;
        this.invalidate();
    }

    get lineColor (): number
    {
        return this._lineColor;
    }
}
