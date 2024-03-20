import { RangeSlider } from './RangeSlider';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
export class VRangeSlider extends RangeSlider {
    public constructor (parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, defaultHandler: Function = null)
    {
        super(RangeSlider.VERTICAL, parent, xpos, ypos, defaultHandler);
    }
}