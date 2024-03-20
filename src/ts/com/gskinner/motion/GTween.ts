import {Shape} from "../../../flash/display/Shape";
import {Event} from "../../../flash/events/Event";
import {Dictionary} from "../../../flash/utils/Dictionary";
import {getTimer} from "../../../flash/utils/getTimer";
import {IEventDispatcher} from "../../../flash/events/IEventDispatcher";
export class GTween {
    public static pauseAll: boolean = false;
    public static defaultEase: Function = linearEase;
    public static timeScaleAll: number = 1;
    protected static hasStarPlugins: boolean = false;
    protected static plugins: any = {};
    protected static shape: Shape;
    protected static time: number;
    protected static tickList: Dictionary = new Dictionary(true);
    protected static gcLockList: Dictionary = new Dictionary(false);
    public static installPlugin(plugin: any, propertyNames: any[], highPriority: boolean = false): void {
        for(let i: number = 0; i < propertyNames.length; i++) {
            let propertyName: string = propertyNames[i];
            if(propertyName == "*" ) {
                GTween.hasStarPlugins = true;
            } 
            if(GTween.plugins[propertyName] == null ) {
                GTween.plugins[propertyName] = [plugin];
                continue;;
            } 
            if(highPriority ) {
                GTween.plugins[propertyName].unshift(plugin);
            } else {
                GTween.plugins[propertyName].push(plugin);
            }
        }
    }
    public static linearEase(a: number, b: number, c: number, d: number): number {
        return a;
    }
    protected static staticInit(): void {
        (GTween.shape = new Shape()).addEventListener(Event.ENTER_FRAME, GTween.staticTick);
        GTween.time = getTimer() / 1000;
    }
    protected static staticTick(evt: Event): void {
        let t: number = GTween.time;
        GTween.time = getTimer() / 1000;
        if(GTween.pauseAll ) {
            return;
        } 
        let dt: number = (GTween.time - t) * GTween.timeScaleAll;
        for(let o in GTween.tickList) {
            let tween: GTween = o as GTween;
            tween.position = tween._position + (tween.useFrames ? GTween.timeScaleAll : dt) * tween.timeScale;
        }
    }
    protected _delay: number = 0;
    protected _values: any;
    protected _paused: boolean = true;
    protected _position: number = 0;
    protected _inited: boolean;
    protected _initValues: any;
    protected _rangeValues: any;
    protected _referenceTime: number;
    protected _proxy: TargetProxy;
    public autoPlay: boolean = true;
    public data: any;
    public duration: number;
    public ease: Function;
    public nextTween: GTween;
    public pluginData: any;
    public reflect: boolean;
    public repeatCount: number = 1;
    public target: any;
    public useFrames: boolean;
    public timeScale: number = 1;
    public positionOld: number;
    public ratio: number;
    public ratioOld: number;
    public calculatedPosition: number;
    public calculatedPositionOld: number;
    public suppressEvents: boolean;
    public onComplete: Function;
    public onChange: Function;
    public onInit: Function;
    public constructor(target: any = null, duration: number = 1, values: any = null, props: any = null, pluginData: any = null) {
        this.ease = GTween.defaultEase;
        this.target = target;
        this.duration = duration;
        this.pluginData = this.copy(pluginData, {});
        if(props ) {
            let swap: boolean = props.swapValues;
            delete props.swapValues;
        } 
        this.copy(props, this);
        this.resetValues(values);
        if(swap ) {
            this.swapValues();
        } 
        if((this.duration == 0 && this.delay == 0) && this.autoPlay ) {
            this.position = 0;
        } 
    }
    public get paused(): boolean {
        return this._paused;
    }
    public set paused(value: boolean) {
        if(value == this._paused ) {
            return;
        } 
        this._paused = value;
        if(this._paused ) {
            delete GTween.tickList[this];
            this.setGCLock(false);
        } else {
            if(this.repeatCount != 0 && this._position >= this.repeatCount * this.duration ) {
                this._inited = false;
                this._position = -this.delay;
            } 
            GTween.tickList[this] = true;
            this.setGCLock(true);
        }
    }
    public get position(): number {
        return this._position;
    }
    public set position(value: number) {
        this.positionOld = this._position;
        this.ratioOld = this.ratio;
        this.calculatedPositionOld = this.calculatedPosition;
        let maxPosition: number = this.repeatCount * this.duration;
        let end: boolean = value >= maxPosition && this.repeatCount > 0;
        if(end ) {
            if(this.calculatedPositionOld == maxPosition ) {
                return;
            } 
            this._position = maxPosition;
            this.calculatedPosition = this.reflect && !(this.repeatCount & 1) ? 0 : this.duration;
        } else {
            this._position = value < -this._delay ? -this._delay : value;
            this.calculatedPosition = this._position < 0 ? 0 : this._position % this.duration;
            if(this.reflect && this._position / this.duration & 1 ) {
                this.calculatedPosition = this.duration - this.calculatedPosition;
            } 
        }
        this.ratio = this.duration == 0 && this._position >= 0 ? 1 : this.ease(this.calculatedPosition / this.duration, 0, 1, 1);
        if((this.target && (this._position >= 0 || this.positionOld >= 0)) && this._position != this.positionOld ) {
            if(!this._inited ) {
                this.init();
            } 
            for(let n in this._values) {
                let initVal: number = this._initValues[n];
                let rangeVal: number = this._rangeValues[n];
                let val: number = initVal + rangeVal * this.ratio;
                let pluginArr: any[] = GTween.plugins[n];
                if(pluginArr ) {
                    let l: number = pluginArr.length;
                    for(let i: number = 0; i < l; i++) {
                        val = pluginArr[i].tween(this, n, val, initVal, rangeVal, this.ratio, end);
                    }
                    if(!isNaN(val) ) {
                        this.target[n] = val;
                    } 
                } else {
                    this.target[n] = val;
                }
            }
        } 
        if(GTween.hasStarPlugins ) {
            pluginArr = GTween.plugins["*"];
            l = pluginArr.length;
            for(i = 0; i < l; i++) {
                pluginArr[i].tween(this, "*", NaN, NaN, NaN, this.ratio, end);
            }
        } 
        if(this.onChange != null && !this.suppressEvents ) {
            this.onChange(this);
        } 
        if(end ) {
            this.paused = true;
            if(this.nextTween ) {
                this.nextTween.paused = false;
            } 
            if(this.onComplete != null && !this.suppressEvents ) {
                this.onComplete(this);
            } 
        } 
    }
    public get delay(): number {
        return this._delay;
    }
    public set delay(value: number) {
        if(this._position <= 0 ) {
            this._position = -value;
        } 
        this._delay = value;
    }
    public get proxy(): TargetProxy {
        if(this._proxy == null ) {
            this._proxy = new TargetProxy(this);
        } 
        return this._proxy;
    }
    public setValue(name: string, value: number): void {
        this._values[name] = value;
        this.invalidate();
    }
    public getValue(name: string): number {
        return this._values[name];
    }
    public deleteValue(name: string): boolean {
        delete this._rangeValues[name];
        delete this._initValues[name];
        return delete this._values[name];
    }
    public setValues(values: any): void {
        this.copy(values, this._values, true);
        this.invalidate();
    }
    public resetValues(values: any = null): void {
        this._values = {};
        this.setValues(values);
    }
    public getValues(): any {
        return this.copy(this._values, {});
    }
    public getInitValue(name: string): number {
        return this._initValues[name];
    }
    public swapValues(): void {
        if(!this._inited ) {
            this.init();
        } 
        let o: any = this._values;
        this._values = this._initValues;
        this._initValues = o;
        for(let n in this._rangeValues) {
            this._rangeValues[n] *= -1;
        }
        if(this._position < 0 ) {
            let pos: number = this.positionOld;
            this.position = 0;
            this._position = this.positionOld;
            this.positionOld = pos;
        } else {
            this.position = this._position;
        }
    }
    public init(): void {
        this._inited = true;
        this._initValues = {};
        this._rangeValues = {};
        for(let n in this._values) {
            if(GTween.plugins[n] ) {
                let pluginArr: any[] = GTween.plugins[n];
                let l: number = pluginArr.length;
                let value: number = n in this.target ? this.target[n] : NaN;
                for(let i: number = 0; i < l; i++) {
                    value = pluginArr[i].init(this, n, value);
                }
                if(!isNaN(value) ) {
                    this._rangeValues[n] = this._values[n] - (this._initValues[n] = value);
                } 
            } else {
                this._rangeValues[n] = this._values[n] - (this._initValues[n] = this.target[n]);
            }
        }
        if(GTween.hasStarPlugins ) {
            pluginArr = GTween.plugins["*"];
            l = pluginArr.length;
            for(i = 0; i < l; i++) {
                pluginArr[i].init(this, "*", NaN);
            }
        } 
        if(this.onInit != null && !this.suppressEvents ) {
            this.onInit(this);
        } 
    }
    public beginning(): void {
        this.position = 0;
        this.paused = true;
    }
    public end(): void {
        this.position = this.repeatCount > 0 ? this.repeatCount * this.duration : this.duration;
    }
    protected invalidate(): void {
        this._inited = false;
        if(this._position > 0 ) {
            this._position = 0;
        } 
        if(this.autoPlay ) {
            this.paused = false;
        } 
    }
    protected setGCLock(value: boolean): void {
        if(value ) {
            if(this.target instanceof IEventDispatcher ) {
                this.target.addEventListener("_", this.setGCLock);
            } else {
                GTween.gcLockList[this] = true;
            }
        } else {
            if(this.target instanceof IEventDispatcher ) {
                this.target.removeEventListener("_", this.setGCLock);
            } 
            delete GTween.gcLockList[this];
        }
    }
    protected copy(o1: any, o2: any, smart: boolean = false): any {
        for(let n in o1) {
            if(smart && o1[n] == null ) {
                delete o2[n];
            } else {
                o2[n] = o1[n];
            }
        }
        return o2;
    }
}
import {Proxy} from "../../../flash/utils/Proxy";
import {flash_proxy} from "../../../flash/utils/flash_proxy";
class TargetProxy extends Proxy {
    private tween: GTween;
    public constructor(tween: GTween) {
        super();
        this.tween = tween;
    }
    callProperty(methodName: any, ...args): any {
        return this.tween.target[methodName].apply(null, args);
    }
    getProperty(prop: any): any {
        let value: number = this.tween.getValue(prop);
        return isNaN(value) ? this.tween.target[prop] : value;
    }
    setProperty(prop: any, value: any): void {
        if((value instanceof Boolean || value instanceof String) || isNaN(value) ) {
            this.tween.target[prop] = value;
        } else {
            this.tween.setValue(String(prop), Number(value));
        }
    }
    deleteProperty(prop: any): boolean {
        this.tween.deleteValue(prop);
        return true;
    }
}