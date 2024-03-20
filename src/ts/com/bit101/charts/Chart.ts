import { Component } from '../components/Component';
import { Label } from '../components/Label';
import { Panel } from '../components/Panel';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Shape } from '../../../flash/display/Shape';
export class Chart extends Component {
    protected _data: any[];
    protected _chartHolder: Shape;
    protected _maximum = 100;
    protected _minimum = 0;
    protected _autoScale = true;
    protected _maxLabel: Label;
    protected _minLabel: Label;
    protected _showScaleLabels = false;
    protected _labelPrecision = 0;
    protected _panel: Panel;
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, data: any[] = null)
    {
        this._data = data;
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(200, 100);
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._panel = new Panel(this);
        this._chartHolder = new Shape();
        this._panel.content.addChild(this._chartHolder);
        this._maxLabel = new Label();
        this._minLabel = new Label();
    }

    protected drawChart (): void
    {

    }

    protected getMaxValue (): number
    {
        if (!this._autoScale )
        {
            return this._maximum;
        }
        let maxValue: number = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this._data.length; i++)
        {
            if (this._data[i] != null )
            {
                maxValue = Math.max(this._data[i], maxValue);
            }
        }
        return maxValue;
    }

    protected getMinValue (): number
    {
        if (!this._autoScale )
        {
            return this._minimum;
        }
        let minValue: number = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this._data.length; i++)
        {
            if (this._data[i] != null )
            {
                minValue = Math.min(this._data[i], minValue);
            }
        }
        return minValue;
    }

    public draw (): void
    {
        super.draw();
        this._panel.setSize(this.width, this.height);
        this._panel.draw();
        this._chartHolder.graphics.clear();
        if (this._data != null )
        {
            this.drawChart();
            const mult: number = Math.pow(10, this._labelPrecision);
            const maxVal: number = Math.round(this.maximum * mult) / mult;
            this._maxLabel.text = maxVal.toString();
            this._maxLabel.draw();
            this._maxLabel.x = -this._maxLabel.width - 5;
            this._maxLabel.y = -this._maxLabel.height * 0.5;
            const minVal: number = Math.round(this.minimum * mult) / mult;
            this._minLabel.text = minVal.toString();
            this._minLabel.draw();
            this._minLabel.x = -this._minLabel.width - 5;
            this._minLabel.y = this.height - this._minLabel.height * 0.5;
        }
    }

    public set data (value: any[])
    {
        this._data = value;
        this.invalidate();
    }

    public get data (): any[]
    {
        return this._data;
    }

    public set maximum (value: number)
    {
        this._maximum = value;
        this.invalidate();
    }

    public get maximum (): number
    {
        if (this._autoScale )
        {
            return this.getMaxValue();
        }
        return this._maximum;
    }

    public set minimum (value: number)
    {
        this._minimum = value;
        this.invalidate();
    }

    public get minimum (): number
    {
        if (this._autoScale )
        {
            return this.getMinValue();
        }
        return this._minimum;
    }

    public set autoScale (value: boolean)
    {
        this._autoScale = value;
        this.invalidate();
    }

    public get autoScale (): boolean
    {
        return this._autoScale;
    }

    public set showScaleLabels (value: boolean)
    {
        this._showScaleLabels = value;
        if (this._showScaleLabels )
        {
            this.addChild(this._maxLabel);
            this.addChild(this._minLabel);
        }
        else
        {
            if (this.contains(this._maxLabel) )
            {
                this.removeChild(this._maxLabel);
            }
            if (this.contains(this._minLabel) )
            {
                this.removeChild(this._minLabel);
            }
        }
    }

    public get showScaleLabels (): boolean
    {
        return this._showScaleLabels;
    }

    public set labelPrecision (value: number)
    {
        this._labelPrecision = value;
        this.invalidate();
    }

    public get labelPrecision (): number
    {
        return this._labelPrecision;
    }

    public set gridSize (value: number)
    {
        this._panel.gridSize = value;
        this.invalidate();
    }

    public get gridSize (): number
    {
        return this._panel.gridSize;
    }

    public set showGrid (value: boolean)
    {
        this._panel.showGrid = value;
        this.invalidate();
    }

    public get showGrid (): boolean
    {
        return this._panel.showGrid;
    }

    public set gridColor (value: number)
    {
        this._panel.gridColor = value;
        this.invalidate();
    }

    public get gridColor (): number
    {
        return this._panel.gridColor;
    }
}