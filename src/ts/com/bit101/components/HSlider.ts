import { Slider } from './Slider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class HSlider extends Slider {
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        super(Slider.HORIZONTAL, parent, xpos, ypos, defaultHandler);
    }
}
