import type { Ball } from '../gameobjects/Ball';
import type { Block } from '../gameobjects/Block';
import { Event } from '../../../../../flash/events/Event';
export class JuicyEvent extends Event {
    static BLOCK_DESTROYED = 'juicyevent_block_destroyed';
    static BALL_COLLIDE = 'juicyevent_ball_collide';
    private _ball: Ball;
    private _block: Block;
    constructor (type: string, ball: Ball = null, block: Block = null)
    {
        super(type);
        this._ball = ball;
        this._block = block;
    }

    clone (): Event
    {
        return new JuicyEvent(this.type);
    }

    toString (): string
    {
        return this.formatToString('JuicyEvent', 'type', 'bubbles', 'cancelable', 'eventPhase');
    }

    get ball (): Ball
    {
        return this._ball;
    }

    get block (): Block
    {
        return this._block;
    }
}
