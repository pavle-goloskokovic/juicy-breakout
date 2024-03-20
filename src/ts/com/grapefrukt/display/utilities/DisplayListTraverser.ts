import {StringUtil} from "../../string/StringUtil";
import {DisplayObject} from "../../../../flash/display/DisplayObject";
import {DisplayObjectContainer} from "../../../../flash/display/DisplayObjectContainer";
export class DisplayListTraverser {
    public static explore(root: DisplayObjectContainer): void {
        DisplayListTraverser.traverse(root);
    }
    private static traverse(node: DisplayObjectContainer, level: number = 0, childCount: number = 0): number {
        let displayObject: DisplayObject;
        let displayObjectContainer: DisplayObjectContainer;
        for(let i: number = 0; i < node.numChildren; i++) {
            displayObject = node.getChildAt(i) as DisplayObject;
            displayObjectContainer = node.getChildAt(i) as DisplayObjectContainer;
            console.log(StringUtil.padStart("", level, "\t") + node.getChildAt(i).name + "\t" + node.getChildAt(i) + "\t" + node.getChildAt(i).alpha + "\t" + node.getChildAt(i).visible);
            if(displayObjectContainer ) {
                childCount += DisplayListTraverser.traverse(displayObjectContainer, level + 1);
            } else {
                childCount++;
            }
        }
        return childCount;
    }
}