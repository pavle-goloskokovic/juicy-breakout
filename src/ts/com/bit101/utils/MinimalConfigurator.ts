import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Event } from '../../../flash/events/Event';
import { EventDispatcher } from '../../../flash/events/EventDispatcher';
import { URLLoader } from '../../../flash/net/URLLoader';
import { URLRequest } from '../../../flash/net/URLRequest';
import { getDefinitionByName } from '../../../flash/utils/getDefinitionByName';
export class MinimalConfigurator extends EventDispatcher {
    protected loader: URLLoader;
    protected parent: DisplayObjectContainer;
    protected idMap: any;
    public constructor (parent: DisplayObjectContainer)
    {
        super();
        this.parent = parent;
        this.idMap = new Object();
    }

    public loadXML (url: string): void
    {
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.onLoadComplete);
        this.loader.load(new URLRequest(url));
    }

    private onLoadComplete (event: Event): void
    {
        this.parseXMLString(this.loader.data as string);
    }

    public parseXMLString (string: string): void
    {
        try
        {
            const xml: XML = new XML(string);
            this.parseXML(xml);
        }
        catch (e)
        {

        }

        dispatchEvent(new Event(Event.COMPLETE));
    }

    public parseXML (xml: XML): void
    {
        for (let i: number = 0; i < xml.children().length(); i++)
        {
            const comp: XML = xml.children()[i];
            const compInst: Component = this.parseComp(comp);
            if (compInst != null )
            {
                this.parent.addChild(compInst);
            }
        }
    }

    private parseComp (xml: XML): Component
    {
        let compInst: any;
        const specialProps: any = {};
        try
        {
            const classRef: Class = getDefinitionByName('com.bit101.components.' + xml.name()) as Class;
            compInst = new classRef();
            const id: string = this.trim(xml.id.toString());
            if (id != '' )
            {
                compInst.name = id;
                this.idMap[id] = compInst;
                if (this.parent.hasOwnProperty(id) )
                {
                    this.parent[id] = compInst;
                }
            }
            if (xml.event.toString() != '' )
            {
                const parts: any[] = xml.event.split(':');
                const eventName: string = this.trim(parts[0]);
                const handler: string = this.trim(parts[1]);
                if (this.parent.hasOwnProperty(handler) )
                {
                    compInst.addEventListener(eventName, this.parent[handler]);
                }
            }
            for (const attrib of xml.attributes())
            {
                const prop: string = attrib.name().toString();
                if (compInst.hasOwnProperty(prop) )
                {
                    if (compInst[prop] instanceof Boolean )
                    {
                        compInst[prop] = attrib == 'true';
                    }
                    else if (((prop == 'value' || prop == 'lowValue') || prop == 'highValue') || prop == 'choice' )
                    {
                        specialProps[prop] = attrib;
                    }
                    else
                    {
                        compInst[prop] = attrib;
                    }
                }
            }
            for (prop in specialProps)
            {
                compInst[prop] = specialProps[prop];
            }
            for (let j: number = 0; j < xml.children().length(); j++)
            {
                const child: Component = this.parseComp(xml.children()[j]);
                if (child != null )
                {
                    compInst.addChild(child);
                }
            }
        }
        catch (e)
        {

        }

        return compInst as Component;
    }

    public getCompById (id: string): Component
    {
        return this.idMap[id];
    }

    private trim (s: string): string
    {
        return s.replace(/^\s+|\s+$/gs, '');
    }

    Accordion;
    Calendar;
    CheckBox;
    ColorChooser;
    ComboBox;
    FPSMeter;
    HBox;
    HRangeSlider;
    HScrollBar;
    HSlider;
    HUISlider;
    IndicatorLight;
    InputText;
    Knob;
    Label;
    List;
    ListItem;
    Meter;
    NumericStepper;
    Panel;
    ProgressBar;
    PushButton;
    RadioButton;
    RangeSlider;
    RotarySelector;
    ScrollBar;
    ScrollPane;
    Slider;
    Style;
    Text;
    TextArea;
    UISlider;
    VBox;
    VRangeSlider;
    VScrollBar;
    VSlider;
    VUISlider;
    WheelMenu;
    Window;
}