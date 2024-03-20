import type { Stage } from '../../../flash/display/Stage';
import { KeyboardEvent } from '../../../flash/events/KeyboardEvent';
import { Keyboard } from '../../../flash/ui/Keyboard';
export class LazyKeyboard {
    private _keys: any;
    public constructor (stage: Stage)
    {
        this._keys = {};
        stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKey);
        stage.addEventListener(KeyboardEvent.KEY_UP, this.handleKey);
    }

    private handleKey (e: KeyboardEvent): void
    {
        let keyState: boolean = false;
        if (e.type == KeyboardEvent.KEY_DOWN )
        {
            keyState = true;
        }
        this._keys[e.keyCode] = keyState;
    }

    public keyIsDown (keyCode: number): boolean
    {
        return this._keys[keyCode];
    }
}