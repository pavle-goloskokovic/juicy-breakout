import type { Stage } from '../../../flash/display/Stage';
import { Event } from '../../../flash/events/Event';
import { EventDispatcher } from '../../../flash/events/EventDispatcher';
import { KeyboardEvent } from '../../../flash/events/KeyboardEvent';
import { MouseEvent } from '../../../flash/events/MouseEvent';
import { Keyboard } from '../../../flash/ui/Keyboard';
export class OneButtonInput extends EventDispatcher {
    private _keyCode = 32;
    private _resetChangedOnReadout = true;
    private _keyState = false;
    private _changedSinceLastReadout = false;
    private _last_was_keyboard = true;
    constructor (stage: Stage, keyCode = 32, resetChangedOnReadout = true)
    {
        super();
        this._keyCode = keyCode;
        this._resetChangedOnReadout = resetChangedOnReadout;
        stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKey);
        stage.addEventListener(KeyboardEvent.KEY_UP, this.handleKey);
        stage.addEventListener(MouseEvent.MOUSE_DOWN, this.handleMouse);
        stage.addEventListener(MouseEvent.MOUSE_UP, this.handleMouse);
    }

    private handleMouse (e: MouseEvent): void
    {
        const oldKeyState: boolean = this._keyState;
        this._keyState = false;
        if (e.type == MouseEvent.MOUSE_DOWN )
        {
            this._keyState = true;
        }
        this._last_was_keyboard = false;
        if (this._keyState != oldKeyState )
        {
            dispatchEvent(new Event(Event.CHANGE, false, true));
            this._changedSinceLastReadout = true;
        }
    }

    private handleKey (e: KeyboardEvent): void
    {
        if (e.keyCode != this._keyCode )
        {
            return;
        }
        const oldKeyState: boolean = this._keyState;
        this._keyState = false;
        if (e.type == KeyboardEvent.KEY_DOWN )
        {
            this._keyState = true;
        }
        this._last_was_keyboard = true;
        if (this._keyState != oldKeyState )
        {
            dispatchEvent(new Event(Event.CHANGE, false, true));
            this._changedSinceLastReadout = true;
        }
    }

    get isChanged (): boolean
    {
        const tmp: boolean = this._changedSinceLastReadout;
        if (this._resetChangedOnReadout )
        {
            this._changedSinceLastReadout = false;
        }
        return tmp;
    }

    get isDown (): boolean
    {
        return this._keyState;
    }

    get lastWasKeyboard (): boolean
    {
        return this._last_was_keyboard;
    }

    resetChanged (): void
    {
        this._changedSinceLastReadout = false;
    }
}
