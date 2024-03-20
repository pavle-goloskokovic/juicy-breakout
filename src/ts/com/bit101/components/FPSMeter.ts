import {Component} from "./Component";
import {Label} from "./Label";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Event} from "../../../flash/events/Event";
import {getTimer} from "../../../flash/utils/getTimer";
export class FPSMeter extends Component {
    protected _label: Label;
    protected _startTime: number;
    protected _frames: number;
    protected _prefix: string = "";
    protected _fps: number = 0;
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, prefix: string = "FPS:") {
        super(parent, xpos, ypos);
        this._prefix = prefix;
        this._frames = 0;
        this._startTime = getTimer();
        this.setSize(50, 20);
        if(stage != null ) {
            addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        } 
        addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
    }
    protected addChildren(): void {
        super.addChildren();
        this._label = new Label(this, 0, 0);
    }
    public draw(): void {
        this._label.text = this._prefix + this._fps.toString();
    }
    protected onEnterFrame(event: Event): void {
        this._frames++;
        let time: number = getTimer();
        let elapsed: number = time - this._startTime;
        if(elapsed >= 1000 ) {
            this._fps = Math.round(this._frames * 1000 / elapsed);
            this._frames = 0;
            this._startTime = time;
            this.draw();
        } 
    }
    protected onRemovedFromStage(event: Event): void {
        this.stop();
    }
    public stop(): void {
        removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }
    public start(): void {
        addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }
    public set prefix(value: string) {
        this._prefix = value;
    }
    public get prefix(): string {
        return this._prefix;
    }
    public get fps(): number {
        return this._fps;
    }
}