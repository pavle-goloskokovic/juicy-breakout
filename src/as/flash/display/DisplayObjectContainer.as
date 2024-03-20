package flash.display
{
    import flash.display.InteractiveObject;

    public class DisplayObjectContainer extends InteractiveObject
    {
        public function addChild(child:DisplayObject):DisplayObject {}
        public function addChildAt(child:DisplayObject, index:int):DisplayObject {}
        public function removeChild(child:DisplayObject):DisplayObject {}
        public function removeChildAt(index:int):DisplayObject {}
        public function getChildAt(index:int):DisplayObject {}

        public function contains(child:DisplayObject):Boolean {}

        public var numChildren : int;
        public var tabChildren : Boolean;
    }
}
