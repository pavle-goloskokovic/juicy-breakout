import {Chart} from "./Chart";
import {Label} from "../components/Label";
import {DisplayObjectContainer} from "../../../flash/display/DisplayObjectContainer";
import {Sprite} from "../../../flash/display/Sprite";
export class PieChart extends Chart {
    protected _sprite: Sprite;
    protected _beginningAngle: number = 0;
    protected _colors: any[] = [0xff9999, 0xffff99, 0x99ff99, 0x99ffff, 0x9999ff, 0xff99ff, 0xffcccc, 0xffffcc, 0xccffcc, 0xccffff, 0xccccff, 0xffccff, 0xff6666, 0xffff66, 0x99ff66, 0x66ffff, 0x6666ff, 0xff66ff, 0xffffff];
    public constructor(parent: DisplayObjectContainer = null, xpos: number = 0, ypos: number = 0, data: any[] = null) {
        super(parent, xpos, ypos, data);
    }
    protected init(): void {
        super.init();
        this.setSize(160, 120);
    }
    protected addChildren(): void {
        super.addChildren();
        this._sprite = new Sprite();
        this._panel.content.addChild(this._sprite);
    }
    protected drawChart(): void {
        let radius: number = Math.min(this.width - 40, this.height - 40) / 2;
        this._sprite.x = this.width / 2;
        this._sprite.y = this.height / 2;
        this._sprite.graphics.clear();
        this._sprite.graphics.lineStyle(0, 0x666666, 1);
        while(this._sprite.numChildren > 0) {
            this._sprite.removeChildAt(0)
        }
        let total: number = this.getDataTotal();
        let startAngle: number = this._beginningAngle * Math.PI / 180;
        for(let i: number = 0; i < this._data.length; i++) {
            let percent: number = this.getValueForData(i) / total;
            let endAngle: number = startAngle + Math.PI * 2 * percent;
            this.drawArc(startAngle, endAngle, radius, this.getColorForData(i));
            this.makeLabel((startAngle + endAngle) * 0.5, radius + 10, this.getLabelForData(i));
            startAngle = endAngle;
        }
    }
    protected makeLabel(angle: number, radius: number, text: string): void {
        let label: Label = new Label(this._sprite, 0, 0, text);
        label.x = Math.cos(angle) * radius;
        label.y = Math.sin(angle) * radius - label.height / 2;
        if(label.x < 0 ) {
            label.x -= label.width;
        } 
    }
    protected drawArc(startAngle: number, endAngle: number, radius: number, color: number): void {
        this._sprite.graphics.beginFill(color);
        this._sprite.graphics.moveTo(0, 0);
        for(let i: number = startAngle; i < endAngle; i += .01) {
            this._sprite.graphics.lineTo(Math.cos(i) * radius, Math.sin(i) * radius);
        }
        this._sprite.graphics.lineTo(Math.cos(endAngle) * radius, Math.sin(endAngle) * radius);
        this._sprite.graphics.lineTo(0, 0);
        this._sprite.graphics.endFill();
    }
    protected getLabelForData(index: number): string {
        if(!(this._data[index] instanceof Number) && this._data[index].label != null ) {
            return this._data[index].label;
        } 
        let value: number = Math.round(this.getValueForData(index) * Math.pow(10, this._labelPrecision)) / Math.pow(10, this._labelPrecision);
        return value.toString();
    }
    protected getColorForData(index: number): number {
        if(!this._data[index] instanceof Number && this._data[index].color != null ) {
            return this._data[index].color;
        } 
        if(index < this._colors.length ) {
            return this._colors[index];
        } 
        return Math.random() * 0xffffff;
    }
    protected getValueForData(index: number): number {
        if(this._data[index] instanceof Number ) {
            return this._data[index];
        } 
        if(this._data[index].value != null ) {
            return this._data[index].value;
        } 
        return NaN;
    }
    protected getDataTotal(): number {
        let total: number = 0;
        for(let i: number = 0; i < this._data.length; i++) {
            total += this.getValueForData(i);
        }
        return total;
    }
    public set colors(value: any[]) {
        this._colors = value;
        this.invalidate();
    }
    public get colors(): any[] {
        return this._colors;
    }
    public set beginningAngle(value: number) {
        this._beginningAngle = value;
        this.invalidate();
    }
    public get beginningAngle(): number {
        return this._beginningAngle;
    }
}