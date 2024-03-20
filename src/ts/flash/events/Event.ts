export class Event {
    public constructor (type: string, bubbles = false, cancelable = false)
    {

    }

    public formatToString (className: string, ...arguments): string
    {

    }

    public type: string;
    public target: any;
}