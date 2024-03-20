import { Component } from './Component';
import { VBox } from './VBox';
import { Window } from './Window';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
export class Accordion extends Component {
    protected _windows: any[];
    protected _winWidth = 100;
    protected _winHeight = 100;
    protected _vbox: VBox;
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0)
    {
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 120);
    }

    protected addChildren (): void
    {
        this._vbox = new VBox(this);
        this._vbox.spacing = 0;
        this._windows = [];
    }

    public addWindow (title: string): void
    {
        this.addWindowAt(title, this._windows.length);
    }

    public addWindowAt (title: string, index: number): void
    {
        index = Math.min(index, this._windows.length);
        index = Math.max(index, 0);
        const window: Window = new Window(null, 0, 0, title);
        this._vbox.addChildAt(window, index);
        window.minimized = true;
        window.draggable = false;
        window.grips.visible = false;
        window.addEventListener(Event.SELECT, this.onWindowSelect);
        this._windows.splice(index, 0, window);
        this._winHeight = this._height - (this._windows.length - 1) * 20;
        this.setSize(this._winWidth, this._winHeight);
    }

    public setSize (w: number, h: number): void
    {
        super.setSize(w, h);
        this._winWidth = w;
        this._winHeight = h - (this._windows.length - 1) * 20;
        this.draw();
    }

    public draw (): void
    {
        this._winHeight = Math.max(this._winHeight, 40);
        for (let i = 0; i < this._windows.length; i++)
        {
            this._windows[i].setSize(this._winWidth, this._winHeight);
            this._vbox.draw();
        }
    }

    public getWindowAt (index: number): Window
    {
        return this._windows[index];
    }

    protected onWindowSelect (event: Event): void
    {
        const window: Window = event.target as Window;
        if (window.minimized )
        {
            for (let i = 0; i < this._windows.length; i++)
            {
                this._windows[i].minimized = true;
            }
            window.minimized = false;
        }
        this._vbox.draw();
    }

    public set width (w: number)
    {
        this._winWidth = w;
        super.width = w;
    }

    public set height (h: number)
    {
        this._winHeight = h - (this._windows.length - 1) * 20;
        super.height = h;
    }

    public get numWindows (): number
    {
        return this._windows.length;
    }
}