package flash.display
{
    import flash.events.EventDispatcher;

    public class DisplayObject extends EventDispatcher
    {
        public function localToGlobal(point:Point):Point {}
        public function globalToLocal(point:Point):Point {}

        public function getBounds(targetCoordinateSpace:DisplayObject):Rectangle {}

        public function hitTestPoint(x:Number, y:Number, shapeFlag:Boolean = false):Boolean {}

        public var stage : Stage;
        public var parent : DisplayObjectContainer;
        public var visible : Boolean;
        public var transform : Transform;

        public var graphics : Graphics;

        public var mask : DisplayObject;
        public var filters : Array;

        public var width : Number;
        public var height : Number;

        public var x : Number;
        public var y : Number;

        public var scaleX : Number;
        public var scaleY : Number;

        public var rotation : Number;

        public var alpha : Number;
        public var cacheAsBitmap : Boolean;

        public var mouseX : Number;
        public var mouseY : Number;
    }
}
