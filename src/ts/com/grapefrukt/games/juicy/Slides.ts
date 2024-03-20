import {Settings} from "./Settings";
import {MovieClip} from "../../../../flash/display/MovieClip";
import {Sprite} from "../../../../flash/display/Sprite";
import {Event} from "../../../../flash/events/Event";
import {KeyboardEvent} from "../../../../flash/events/KeyboardEvent";
import {Keyboard} from "../../../../flash/ui/Keyboard";
export class Slides extends Sprite {
    private _slides: SlidesClip;
    public constructor() {
        super();
        this._slides = new SlidesClip();
        this._slides.gotoAndStop(1);
        addChild(this._slides);
        this._slides.x = Settings.STAGE_W / 2;
        this._slides.y = Settings.STAGE_H / 2;
        addEventListener(Event.ADDED_TO_STAGE, this.handleAddedToStage);
    }
    private handleAddedToStage(e: Event): void {
        removeEventListener(Event.ADDED_TO_STAGE, this.handleAddedToStage);
        stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKeyDown);
    }
    private handleKeyDown(e: KeyboardEvent): void {
        if(e.keyCode == Keyboard.S ) {
            visible = !visible
        } 
        if(e.keyCode == Keyboard.TAB ) {
            visible = false
        } 
        if(!visible && this._slides.currentFrame == 7 ) {
            this._slides.gotoAndStop(6)
        } 
        if(!visible ) {
            return
        } 
        if(e.keyCode == Keyboard.LEFT ) {
            this._slides.gotoAndStop(this._slides.currentFrame - 1)
        } 
        if(e.keyCode == Keyboard.RIGHT ) {
            this._slides.gotoAndStop(this._slides.currentFrame + 1)
        } 
    }
}