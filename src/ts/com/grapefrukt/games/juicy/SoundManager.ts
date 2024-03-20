import {SoundControl} from "../../../../de/pixelate/pelikan/sound/SoundControl";
import {Event} from "../../../../flash/events/Event";
import {ProgressEvent} from "../../../../flash/events/ProgressEvent";
export class SoundManager {
    private static _sound_control: SoundControl;
    public static init(): void {
        SoundManager._sound_control = new SoundControl();
        SoundManager._sound_control.basePath = "sfx/";
        SoundManager._sound_control.addEventListener(Event.INIT, SoundManager.handleSoundControlInit);
        SoundManager._sound_control.loadXMLConfig("sound.xml");
    }
    public static play(id: string): void {
        SoundManager._sound_control.play(id);
    }
    public static playSoundId(id: string, sound_id: number): void {
        SoundManager._sound_control.playSoundId(id, sound_id);
    }
    private static handleSoundControlInit(e: Event): void {
        SoundManager._sound_control.removeEventListener(Event.INIT, SoundManager.handleSoundControlInit);
    }
    public static get mute(): boolean {
        return SoundManager._sound_control.mute;
    }
    public static set mute(value: boolean) {
        SoundManager._sound_control.mute = value;
    }
    public static get bytesTotal(): number {
        return SoundManager._sound_control.bytesTotal;
    }
    public static get bytesLoaded(): number {
        return SoundManager._sound_control.bytesLoaded;
    }
    public static get soundControl(): SoundControl {
        return SoundManager._sound_control;
    }
}