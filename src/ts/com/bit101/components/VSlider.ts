import { Slider } from './Slider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class VSlider extends Slider {
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        super(Slider.VERTICAL, parent, xpos, ypos, defaultHandler);
    }
}
