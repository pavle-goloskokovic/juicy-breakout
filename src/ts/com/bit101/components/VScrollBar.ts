import {ScrollBar} from "./ScrollBar";
import {Slider} from "./Slider";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
export class VScrollBar extends ScrollBar {
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, defaultHandler: Function = null) {
        super(Slider.VERTICAL, parent, xpos, ypos, defaultHandler);
    }
}