import { UISlider } from './UISlider';
import { HSlider } from './HSlider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class HUISlider extends UISlider {
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, label = '', defaultHandler: Function = null)
    {
        this._sliderClass = HSlider;
        super(parent, xpos, ypos, label, defaultHandler);
    }

    protected init (): void
    {
        super.init();
        this.setSize(200, 18);
    }

    protected positionLabel (): void
    {
        this._valueLabel.x = this._slider.x + this._slider.width + 5;
    }

    draw (): void
    {
        super.draw();
        this._slider.x = this._label.width + 5;
        this._slider.y = this.height / 2 - this._slider.height / 2;
        this._slider.width = this.width - this._label.width - 50 - 10;
        this._valueLabel.x = this._slider.x + this._slider.width + 5;
    }
}
