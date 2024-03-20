import {Ball} from "../gameobjects/Ball";
import {Block} from "../gameobjects/Block";
import {Event} from "../../../../../flash/events/Event";
export class JuicyEvent extends Event {
    public static BLOCK_DESTROYED: string = "juicyevent_block_destroyed";
    public static BALL_COLLIDE: string = "juicyevent_ball_collide";
    private _ball: Ball;
    private _block: Block;
    public constructor(type: string, ball: Ball = null, block: Block = null) {
        super(type);
        this._ball = ball;
        this._block = block;
    }
    public clone(): Event {
        return new JuicyEvent(this.type);
    }
    public toString(): string {
        return this.formatToString("JuicyEvent", "type", "bubbles", "cancelable", "eventPhase");
    }
    public get ball(): Ball {
        return this._ball;
    }
    public get block(): Block {
        return this._block;
    }
}