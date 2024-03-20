import { RangeSlider } from './RangeSlider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class VRangeSlider extends RangeSlider {
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultHandler: Function = null)
    {
        super(RangeSlider.VERTICAL, parent, xpos, ypos, defaultHandler);
    }
}