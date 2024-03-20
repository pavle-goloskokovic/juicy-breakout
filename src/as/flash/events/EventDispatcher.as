package flash.events
{
    public class EventDispatcher
    {
        public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void {}
        public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void {}
    }
}
