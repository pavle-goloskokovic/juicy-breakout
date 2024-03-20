import {Sprite} from "../../../flash/display/Sprite";
import {TextField} from "../../../flash/text/TextField";
import {TextFormat} from "../../../flash/text/TextFormat";
import {TextFieldAutoSize} from "../../../flash/text/TextFieldAutoSize";
import {getTimer} from "../../../flash/utils/getTimer";
import {Event} from "../../../flash/events/Event";
import {System} from "../../../flash/system/System";
import {Timer} from "../../../flash/utils/Timer";
import {TimerEvent} from "../../../flash/events/TimerEvent";
export class MEM extends Sprite {
    private mem_text: TextField;
    private update_timer: Timer;
    public constructor(color: number = 0xffffff) {
        super();
        let textformat: TextFormat = new TextFormat("Arial");
        this.mem_text = new TextField();
        this.mem_text.textColor = color;
        this.mem_text.selectable = false;
        this.mem_text.autoSize = TextFieldAutoSize.LEFT;
        this.mem_text.setTextFormat(textformat);
        this.mem_text.defaultTextFormat = textformat;
        addChild(this.mem_text);
        this.update_timer = new Timer(250);
        this.update_timer.start();
        this.update_timer.addEventListener(TimerEvent.TIMER, this.onTimerCallback);
    }
    private onTimerCallback(event: Event): void {
        this.mem_text.text = "mem: " + Number(System.totalMemory / (1024 * 1024)).toFixed(1) + " MB";
    }
}