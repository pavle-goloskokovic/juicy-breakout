export class Event {
    constructor (type: string, bubbles = false, cancelable = false)
    {

    }

    formatToString (className: string, ...arguments): string
    {

    }

    type: string;
    target: any;
}
