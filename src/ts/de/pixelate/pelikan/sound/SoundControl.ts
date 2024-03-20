import { SoundObject } from './SoundObject';
import { Event } from '../../../../flash/events/Event';
import { EventDispatcher } from '../../../../flash/events/EventDispatcher';
import { ProgressEvent } from '../../../../flash/events/ProgressEvent';
import { URLLoader } from '../../../../flash/net/URLLoader';
import { URLRequest } from '../../../../flash/net/URLRequest';
import { Dictionary } from '../../../../flash/utils/Dictionary';
export class SoundControl extends EventDispatcher {
    public VERSION = '1.0.1-grapefrukt';
    private _sounds: Dictionary;
    private _groups: any;
    private _xml_config: XML;
    private _xml_config_loader: URLLoader;
    private _sounds_total = 0;
    private _sounds_loaded = 0;
    private _bytes_total = 0;
    private _bytes_loaded = 0;
    private _embed_class: Class;
    private _basePath = '';
    private _mute = false;
    public constructor ()
    {
        super();
        this._sounds = new Dictionary();
        this._groups = new Object();
    }

    public loadXMLConfig (url: string): void
    {
        this._xml_config_loader = new URLLoader();
        this._xml_config_loader.addEventListener(Event.COMPLETE, this.onXMLConfigLoaded);
        this._xml_config_loader.load(new URLRequest(this._basePath + url));
    }

    public play (id: string): void
    {
        if (this._mute || !this.loaded )
        {
            return;
        }
        const group: any[] = this._groups[id];
        if (group )
        {
            id = group[int(Math.random() * group.length)].id;
        }
        const sound: SoundObject = this.getSound(id);
        sound.play();
    }

    public playSoundId (id: string, sound_id: number): void
    {
        if (this._mute || !this.loaded )
        {
            return;
        }
        const group: any[] = this._groups[id];
        if (group )
        {
            id = group[int(sound_id % group.length)].id;
        }
        const sound: SoundObject = this.getSound(id);
        sound.play();
    }

    public stopSound (id: string): void
    {
        const sound: SoundObject = this.getSound(id);
        sound.stop();
    }

    private parseXML (): void
    {
        if (this._xml_config.embedSounds == 'false' )
        {
            this._embed_class = null;
        }
        for (const group of this._xml_config.sound)
        {
            this.registerGroup(group);
        }
    }

    private registerSound (id: string, file: string, data: XML): SoundObject
    {
        const volume: number = data.volume || 1;
        const pan: number = data.pan || 0;
        const startTime: number = data.startTime || 0;
        const loops: number = data.loops || 0;
        const soundObject: SoundObject = new SoundObject(id, file, volume, pan, startTime, loops, this._embed_class);
        this._sounds[soundObject.id] = soundObject;
        soundObject.addEventListener(Event.COMPLETE, this.handleSoundLoaded);
        soundObject.addEventListener(ProgressEvent.PROGRESS, this.handleSoundLoadProgress);
        soundObject.load(this._basePath);
        this._sounds_total++;
        return soundObject;
    }

    private registerGroup (group: XML): void
    {
        let i = 0;
        for (const file of group.file)
        {
            const soundObject: SoundObject = this.registerSound(group.id + '-' + i.toString(), file, group);
            if (this._groups[group.id] == null )
            {
                this._groups[group.id] = [];
            }
            this._groups[group.id].push(soundObject);
            i++;
        }
    }

    public getSound (id: string): SoundObject
    {
        if (this._sounds[id] == null )
        {
            throw new Error('Sound with id "' + id + '" does not exist.');
        }
        return SoundObject(this._sounds[id]);
    }

    private onXMLConfigLoaded (event: Event): void
    {
        this._xml_config_loader.removeEventListener(Event.COMPLETE, this.onXMLConfigLoaded);
        this._xml_config = new XML(event.target.data);
        this.parseXML();
    }

    private handleSoundLoadProgress (e: ProgressEvent): void
    {
        this._bytes_loaded = 0;
        this._bytes_total = 0;
        for (const so of this._sounds)
        {
            this._bytes_loaded += so.bytesLoaded;
            this._bytes_total += so.bytesTotal;
        }
    }

    private handleSoundLoaded (event: Event): void
    {
        this._sounds_loaded++;
        dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, this._sounds_loaded, this._sounds_total));
        if (this._sounds_loaded == this._sounds_total )
        {
            dispatchEvent(new Event(Event.INIT));
        }
    }

    public setXMLConfig (xml: XML): void
    {
        this._xml_config = xml;
        this.parseXML();
    }

    public get soundsLoaded (): number
    {
        return this._sounds_loaded;
    }

    public get soundsTotal (): number
    {
        return this._sounds_total;
    }

    public set basePath (path: string)
    {
        this._basePath = path;
    }

    public get basePath (): string
    {
        return this._basePath;
    }

    public set embedSoundsClass (value: Class)
    {
        this._embed_class = value;
    }

    public get embedSoundsClass (): Class
    {
        return this._embed_class;
    }

    public get bytesTotal (): number
    {
        return this._bytes_total;
    }

    public get bytesLoaded (): number
    {
        return this._bytes_loaded;
    }

    public get loaded (): boolean
    {
        return this._bytes_loaded == this._bytes_total;
    }

    public get mute (): boolean
    {
        return this._mute;
    }

    public set mute (value: boolean)
    {
        this._mute = value;
    }
}