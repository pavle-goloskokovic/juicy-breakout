import {Settings} from "./Settings";
import {Accordion} from "../../../bit101/components/Accordion";
import {CheckBox} from "../../../bit101/components/CheckBox";
import {HBox} from "../../../bit101/components/HBox";
import {HSlider} from "../../../bit101/components/HSlider";
import {HUISlider} from "../../../bit101/components/HUISlider";
import {Label} from "../../../bit101/components/Label";
import {Panel} from "../../../bit101/components/Panel";
import {VBox} from "../../../bit101/components/VBox";
import {Window} from "../../../bit101/components/Window";
import {DisplayObjectContainer} from "../../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../../flash/display/Sprite";
import {Event} from "../../../../flash/events/Event";
import {KeyboardEvent} from "../../../../flash/events/KeyboardEvent";
import {Keyboard} from "../../../../flash/ui/Keyboard";
import {describeType} from "../../../../flash/utils/describeType";
export class Toggler extends Sprite {
    private _targetClass: Class;
    private _properties: Array<Property>;
    public constructor(targetClass: Class, visible: boolean = false) {
        super();
        this._targetClass = targetClass;
        this.visible = visible;
        this.reset();
        this.addEventListener(Event.ADDED_TO_STAGE, this.handleAddedToStage);
    }
    private reset(): void {
        let typeXML: XML = describeType(this._targetClass);
        this._properties = [];
        let property: Property;
        let tag: XML;
        for(let variable of typeXML.variable) {
            property = new Property();
            property.name = variable.name.toString();
            property.value = this._targetClass[variable.name];
            property.type = variable.type.toString();
            if(property.type == "Number" || property.type == "int" ) {
                property.min = property.value / 2;
                property.max = property.value * 2;
            } 
            for(tag of variable.metadata.comment) {
                property.comment = tag.arg.value
            }
            for(tag of variable.metadata.max) {
                property.max = tag.arg.value
            }
            for(tag of variable.metadata.min) {
                property.min = tag.arg.value
            }
            for(tag of variable.metadata.o) {
                property.order = tag.arg.value
            }
            for(tag of variable.metadata.header) {
                property.header = tag.arg.value
            }
            this._properties.push(property);
        }
        this._properties.sort(this._sort);
        while(this.numChildren) {
            this.removeChildAt(0)
        }
        let settingWindow: Window = new Window(this, 10, 10);
        settingWindow.title = "JUICEATRON 5002 XX";
        settingWindow.width = 250;
        settingWindow.height = Settings.STAGE_H - 50;
        let accordion: Accordion = new Accordion(settingWindow);
        let window: Window;
        for(property of this._properties) {
            if(!window || window.title != property.header && property.header != "" ) {
                if(window ) {
                    window.content.getChildAt(0).height = DisplayObjectContainer(window.content.getChildAt(0)).numChildren * 30;
                } 
                accordion.addWindowAt(property.header, accordion.numWindows);
                window = accordion.getWindowAt(accordion.numWindows - 1);
                let container: VBox = new VBox(window.content, 10, 10);
            } 
            let row: HBox = new HBox(DisplayObjectContainer(window.content.getChildAt(0)));
            let label: Label = new Label(row, 0, 0, this.prettify(property.name));
            label.autoSize = false;
            label.width = 120;
            switch(property.type) {
                case "Boolean":
                {
                    let checkbox: CheckBox = new CheckBox(row, 0, 0, "", this.getToggleClosure(property.name))
                    checkbox.selected = property.value
                }
                break;
                case "Number":
                break;
                case "int":
                {
                    let slider: HUISlider = new HUISlider(row, 0, 0, "", this.getSliderClosure(property.name))
                    slider.width = 130
                    slider.minimum = property.min
                    slider.maximum = property.max
                    slider.value = property.value
                    if(property.type == "int" ) {
                        slider.tick = 1
                    } 
                }
                break;
            }
        }
        accordion.height = Settings.STAGE_H - 50 - 20;
        accordion.width = 250;
    }
    public setAll(value: boolean): void {
        for(let property of this._properties) {
            if(property.name == "EFFECT_SCREEN_COLORS" ) {
                continue;
            } 
            if(property.name == "EFFECT_PADDLE_SMILE" ) {
                if(value ) {
                    this._targetClass[property.name] = 100;
                } else {
                    this._targetClass[property.name] = 0;
                }
            } 
            if(property.type == "Boolean" ) {
                this._targetClass[property.name] = value
            } 
        }
        this.reset();
    }
    private prettify(name: string): string {
        return name.replace("EFFECT_", "").replace(/_/g, " ");
    }
    private getGroupName(name: string): string {
        name = name.replace("EFFECT_", "");
        return name.replace(/_[A-Z].*/, "");
    }
    private getToggleClosure(field: string): Function {
        return function(e: Event): void {
            this._targetClass[field] = CheckBox(e.target).selected;
        };
    }
    private getSliderClosure(field: string): Function {
        return function(e: Event): void {
            this._targetClass[field] = HUISlider(e.target).value;
        };
    }
    private handleAddedToStage(e: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.handleAddedToStage);
        this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKeyDown);
    }
    private handleKeyDown(e: KeyboardEvent): void {
        if(e.keyCode == Keyboard.TAB ) {
            this.visible = !this.visible
        } 
    }
    private _sort(p1: Property, p2: Property): number {
        if(p1.order == "" && p2.order != "" ) {
            return 1
        } 
        if(p1.order != "" && p2.order == "" ) {
            return -1
        } 
        if(p1.order < p2.order ) {
            return -1
        } 
        if(p1.order > p2.order ) {
            return 1
        } 
        if(p1.name < p2.name ) {
            return -1
        } 
        if(p1.name > p2.name ) {
            return 1
        } 
        return 0;
    }
}
class Property {
    public name: string;
    public comment: string;
    public type: string;
    public value: any;
    public max: number;
    public min: number;
    public order: string = "";
    public header: string = "";
}