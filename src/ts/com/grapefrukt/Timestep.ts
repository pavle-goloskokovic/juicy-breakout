import { getTimer } from '../../flash/utils/getTimer';
export class Timestep {
    private _game_speed: number = 1;
    private _target_frametime: number = 0.6;
    private _max_speed: number = 3;
    private _smoothing: number = .5;
    private _real_speed: number = 0.0;
    private _last_frame_time: number = 0.0;
    private _delta: number = 0.0;
    public constructor (fps: number = 60, gameSpeed: number = 1.0, maxSpeed: number = 3.0, smoothing: number = 0.5)
    {
        this._target_frametime = 1000 / fps;
        this._smoothing = smoothing;
        this.gameSpeed = gameSpeed;
        this.maxSpeed = maxSpeed;
    }

    public tick (): number
    {
        this._real_speed = (getTimer() - this._last_frame_time) / this._target_frametime;
        this._last_frame_time = getTimer();
        if (this._real_speed > this._max_speed )
        {
            this._real_speed = this._max_speed;
        }
        this._delta -= (this._delta - this._real_speed) * (1 - this._smoothing);
        return this._delta * this._game_speed;
    }

    public get timeDelta (): number
    {
        return this._delta * this._game_speed;
    }

    public get maxSpeed (): number
    {
        return this._max_speed;
    }

    public set maxSpeed (value: number)
    {
        this._max_speed = value;
    }

    public get gameSpeed (): number
    {
        return this._game_speed;
    }

    public set gameSpeed (value: number)
    {
        this._game_speed = value;
    }

    public get smoothing (): number
    {
        return this._smoothing;
    }

    public set smoothing (value: number)
    {
        if (value > 1 )
        {
            value = 1;
        }
        if (value < 0 )
        {
            value = 0;
        }
        this._smoothing = value;
    }
}