import { GTween } from './GTween';
import { Dictionary } from '../../../flash/utils/Dictionary';
export class GTweenTimeline extends GTween {
    public static setPropertyValue (target: any, propertyName: string, value: any): void
    {
        target[propertyName] = value;
    }

    public suppressCallbacks: boolean;
    protected callbacks: any[];
    protected labels: any;
    protected tweens: any[];
    protected tweenStartPositions: any[];
    public constructor (target: any = null, duration: number = 1, values: any = null, props: any = null, pluginData: any = null, tweens: any[] = null)
    {
        this.tweens = [];
        this.tweenStartPositions = [];
        this.callbacks = [];
        this.labels = {};
        this.addTweens(tweens);
        super(target, duration, values, props, pluginData);
        if (this.autoPlay )
        {
            this.paused = false;
        }
    }

    public set position (value: number)
    {
        const tmpSuppressEvents: boolean = this.suppressEvents;
        this.suppressEvents = true;
        super.position = value;
        const repeatIndex: number = this._position / this.duration >> 0;
        const rev: boolean = this.reflect && repeatIndex % 2 >= 1;
        let i: number;
        const l: number = this.tweens.length;
        if (rev )
        {
            for (i = 0; i < l; i++)
            {
                this.tweens[i].position = Math.max(0, this.calculatedPosition - this.tweenStartPositions[i]);
            }
        }
        else
        {
            for (i = l - 1; i >= 0; i--)
            {
                this.tweens[i].position = Math.max(0, this.calculatedPosition - this.tweenStartPositions[i]);
            }
        }
        if (!this.suppressCallbacks )
        {
            this.checkCallbacks();
        }
        this.suppressEvents = tmpSuppressEvents;
        if (this.onChange != null && !this.suppressEvents )
        {
            this.onChange(this);
        }
        if (((this.onComplete != null && !this.suppressEvents) && value >= this.repeatCount * this.duration) && this.repeatCount > 0 )
        {
            this.onComplete(this);
        }
    }

    public addTween (position: number, tween: GTween): void
    {
        if (tween == null || isNaN(position) )
        {
            return;
        }
        tween.autoPlay = false;
        tween.paused = true;
        let index: number = -1;
        while (++index < this.tweens.length && this.tweenStartPositions[index] < position)
        {

        }
        this.tweens.splice(index, 0, tween);
        this.tweenStartPositions.splice(index, 0, position);
        tween.position = this.calculatedPosition - position;
    }

    public addTweens (tweens: any[]): void
    {
        if (tweens == null )
        {
            return;
        }
        for (let i: number = 0; i < tweens.length; i += 2)
        {
            this.addTween(tweens[i], tweens[i + 1] as GTween);
        }
    }

    public removeTween (tween: GTween): void
    {
        for (let i: number = this.tweens.length; i >= 0; i--)
        {
            if (this.tweens[i] == tween )
            {
                this.tweens.splice(i, 1);
                this.tweenStartPositions.splice(i, 1);
            }
        }
    }

    public addLabel (position: number, label: string): void
    {
        this.labels[label] = position;
    }

    public removeLabel (label: string): void
    {
        delete this.labels[label];
    }

    public addCallback (labelOrPosition: any, forwardCallback: Function, forwardParameters: any[] = null, reverseCallback: Function = null, reverseParameters: any[] = null): void
    {
        const position: number = this.resolveLabelOrPosition(labelOrPosition);
        if (isNaN(position) )
        {
            return;
        }
        const callback: Callback = new Callback(position, forwardCallback, forwardParameters, reverseCallback, reverseParameters);
        const l: number = this.callbacks.length;
        for (let i: number = l - 1; i >= 0; i--)
        {
            if (position == this.callbacks[i].position )
            {
                this.callbacks[i] = callback;
                return;
            }
            if (position > this.callbacks[i].position )
            {
                break;
            }
        }
        this.callbacks.splice(i + 1, 0, callback);
    }

    public removeCallback (labelOrPosition: any): void
    {
        const position: number = this.resolveLabelOrPosition(labelOrPosition);
        if (isNaN(position) )
        {
            return;
        }
        const l: number = this.callbacks.length;
        for (let i: number = 0; i < l; i++)
        {
            if (position == this.callbacks[i].position )
            {
                this.callbacks.splice(i, 1);
                return;
            }
        }
    }

    public gotoAndPlay (labelOrPosition: any): void
    {
        this.goto(labelOrPosition);
        this.paused = false;
    }

    public gotoAndStop (labelOrPosition: any): void
    {
        this.goto(labelOrPosition);
        this.paused = true;
    }

    public goto (labelOrPosition: any): void
    {
        const pos: number = this.resolveLabelOrPosition(labelOrPosition);
        if (!isNaN(pos) )
        {
            this.position = pos;
        }
    }

    public resolveLabelOrPosition (labelOrPosition: any): number
    {
        return isNaN(labelOrPosition) ? this.labels[String(labelOrPosition)] : labelOrPosition;
    }

    public calculateDuration (): void
    {
        let d: number = 0;
        if (this.callbacks.length > 0 )
        {
            d = this.callbacks[this.callbacks.length - 1].position;
        }
        for (let i: number = 0; i < this.tweens.length; i++)
        {
            if (this.tweens[i].duration + this.tweenStartPositions[i] > d )
            {
                d = this.tweens[i].duration + this.tweenStartPositions[i];
            }
        }
        this.duration = d;
    }

    protected checkCallbacks (): void
    {
        if (this.callbacks.length == 0 )
        {
            return;
        }
        const repeatIndex: number = this._position / this.duration >> 0;
        const previousRepeatIndex: number = this.positionOld / this.duration >> 0;
        if (repeatIndex == previousRepeatIndex || this.repeatCount > 0 && this._position > this.duration * this.repeatCount )
        {
            this.checkCallbackRange(this.calculatedPositionOld, this.calculatedPosition);
        }
        else
        {
            let rev: boolean = this.reflect && previousRepeatIndex % 2 >= 1;
            this.checkCallbackRange(this.calculatedPositionOld, rev ? 0 : this.duration);
            rev = this.reflect && repeatIndex % 2 >= 1;
            this.checkCallbackRange(rev ? this.duration : 0, this.calculatedPosition, !this.reflect);
        }
    }

    protected checkCallbackRange (startPos: number, endPos: number, includeStart: boolean = false): void
    {
        let sPos: number = startPos;
        let ePos: number = endPos;
        let i: number = -1;
        let j: number = this.callbacks.length;
        let k: number = 1;
        if (startPos > endPos )
        {
            sPos = endPos;
            ePos = startPos;
            i = j;
            j = (k = -1);
        }
        while ((i += k) != j)
        {
            const callback: Callback = this.callbacks[i];
            const pos: number = callback.position;
            if ((pos > sPos && pos < ePos || pos == endPos) || includeStart && pos == startPos )
            {
                if (k == 1 )
                {
                    if (callback.forward != null )
                    {
                        callback.forward.apply(this, callback.forwardParams);
                    }
                }
                else
                {
                    if (callback.reverse != null )
                    {
                        callback.reverse.apply(this, callback.reverseParams);
                    }
                }
            }
        }
    }
}
class Callback {
    public position: number;
    public forward: Function;
    public reverse: Function;
    public forwardParams: any[];
    public reverseParams: any[];
    public constructor (position: number, forward: Function, forwardParams: any[], reverse: Function, reverseParams: any[])
    {
        this.position = position;
        this.forward = forward;
        this.reverse = reverse;
        this.forwardParams = forwardParams;
        this.reverseParams = reverseParams;
    }
}