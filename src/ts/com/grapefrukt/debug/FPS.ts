import { Sprite } from '../../../flash/display/Sprite';
import { TextField } from '../../../flash/text/TextField';
import { TextFormat } from '../../../flash/text/TextFormat';
import { TextFieldAutoSize } from '../../../flash/text/TextFieldAutoSize';
import { getTimer } from '../../../flash/utils/getTimer';
import { Event } from '../../../flash/events/Event';
export class FPS extends Sprite {
    private frametimes: any[];
    private last_tick: number = 0;
    private fps_text: TextField;
    private target_fps: number = 0;
    private manual_update: boolean = false;
    private fps_label: string = 'FPS';
    private _t: number = 0;
    private _sum: number = 0;
    private _average: number = 0;
    private insert_pos: number = 0;
    private BUFFER_SIZE: number = 0;
    public speedFraction: number = 1;
    public constructor (_target_fps: number, _label: string = 'fps', _manual_update: boolean = false, textColor: number = 0xffffff)
    {
        super();
        this.target_fps = _target_fps;
        this.BUFFER_SIZE = this.target_fps;
        this.fps_label = _label;
        this.manual_update = _manual_update;
        this.frametimes = [];
        for (let i: number = 0; i < this.BUFFER_SIZE; i++)
        {
            this.frametimes.push(0);
        }
        this.last_tick = getTimer();
        const textformat: TextFormat = new TextFormat('Arial');
        this.fps_text = new TextField();
        this.fps_text.textColor = textColor;
        this.fps_text.selectable = false;
        this.fps_text.autoSize = TextFieldAutoSize.LEFT;
        this.fps_text.setTextFormat(textformat);
        this.fps_text.defaultTextFormat = textformat;
        this.addChild(this.fps_text);
        if (this.manual_update == false )
        {
            this.addEventListener(Event.ENTER_FRAME, this.tick);
        }
    }

    public tick (event: Event = null): void
    {
        this._t = getTimer() - this.last_tick;
        this.last_tick = getTimer();
        this.frametimes[this.insert_pos] = this._t;
        this.insert_pos++;
        if (this.insert_pos > this.BUFFER_SIZE )
        {
            this.insert_pos = 0;
        }
        this._sum = 0;
        for (const i of this.frametimes)
        {
            this._sum += i;
        }
        this._average = this._sum / this.BUFFER_SIZE;
        this.speedFraction = 1000 / this.target_fps / this._average;
        this.fps_text.text = this.fps_label + ': ' + Number(1000 / this._average).toFixed(1) + ' (' + Number(this.speedFraction * 100).toFixed(0) + '%)';
    }

    public get average (): number
    {
        return this._average;
    }
}