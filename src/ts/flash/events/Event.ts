export class Event {
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        
    }
    public formatToString(className: string, ...arguments): string {
        
    }
    public type: string;
    public target: any;
}