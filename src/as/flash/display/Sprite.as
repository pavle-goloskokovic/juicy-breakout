package flash.display
{
    import flash.display.DisplayObjectContainer;

    public class Sprite extends DisplayObjectContainer
    {
        public function startDrag(lockCenter:Boolean = false, bounds:Rectangle = null):void {}
        public function stopDrag():void {}

        public var buttonMode : Boolean;
        public var useHandCursor : Boolean;
    }
}
