import { UISlider } from './UISlider';
import { VSlider } from './VSlider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class VUISlider extends UISlider {
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
    {
        this._sliderClass = VSlider;
        super(parent, xpos, ypos, label, defaultHandler);
    }

    protected init (): void
    {
        super.init();
        this.setSize(20, 146);
    }

    public draw (): void
    {
        super.draw();
        this._label.x = this.width / 2 - this._label.width / 2;
        this._slider.x = this.width / 2 - this._slider.width / 2;
        this._slider.y = this._label.height + 5;
        this._slider.height = this.height - this._label.height - this._valueLabel.height - 10;
        this._valueLabel.x = this.width / 2 - this._valueLabel.width / 2;
        this._valueLabel.y = this._slider.y + this._slider.height + 5;
    }

    protected positionLabel (): void
    {
        this._valueLabel.x = this.width / 2 - this._valueLabel.width / 2;
    }

    public get width (): number
    {
        if (this._label == null )
        {
            return this._width;
        }
        return Math.max(this._width, this._label.width);
    }
}