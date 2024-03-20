package flash.events
{
    public class Event
    {
        public function Event(type:String, bubbles:Boolean = false, cancelable:Boolean = false) {}

        public function formatToString(className:String, ... arguments):String {}

        public var type : String;
        public var target : Object;
    }
}
