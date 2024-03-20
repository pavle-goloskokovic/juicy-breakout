import { getTimer } from '../../flash/utils/getTimer';
export class Timestep {
    private _game_speed = 1;
    private _target_frametime = 0.6;
    private _max_speed = 3;
    private _smoothing = .5;
    private _real_speed = 0.0;
    private _last_frame_time = 0.0;
    private _delta = 0.0;
    constructor (fps = 60, gameSpeed = 1.0, maxSpeed = 3.0, smoothing = 0.5)
    {
        this._target_frametime = 1000 / fps;
        this._smoothing = smoothing;
        this.gameSpeed = gameSpeed;
        this.maxSpeed = maxSpeed;
    }

    tick (): number
    {
        this._real_speed = (getTimer() - this._last_frame_time) / this._target_frametime;
        this._last_frame_time = getTimer();
        if (this._real_speed > this._max_speed)
        {
            this._real_speed = this._max_speed;
        }
        this._delta -= (this._delta - this._real_speed) * (1 - this._smoothing);
        return this._delta * this._game_speed;
    }

    get timeDelta (): number
    {
        return this._delta * this._game_speed;
    }

    get maxSpeed (): number
    {
        return this._max_speed;
    }

    set maxSpeed (value: number)
    {
        this._max_speed = value;
    }

    get gameSpeed (): number
    {
        return this._game_speed;
    }

    set gameSpeed (value: number)
    {
        this._game_speed = value;
    }

    get smoothing (): number
    {
        return this._smoothing;
    }

    set smoothing (value: number)
    {
        if (value > 1)
        {
            value = 1;
        }
        if (value < 0)
        {
            value = 0;
        }
        this._smoothing = value;
    }
}
