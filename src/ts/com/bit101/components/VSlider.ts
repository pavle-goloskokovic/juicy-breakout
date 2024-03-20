import { Slider } from './Slider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class VSlider extends Slider {
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, defaultHandler: Function = null)
    {
        super(Slider.VERTICAL, parent, xpos, ypos, defaultHandler);
    }
}