import {Settings} from "../Settings";
import {Shape} from "../../../../../flash/display/Shape";
export class Rainbow extends Shape {
    private _segments: Array<Segment>;
    private _verts: Array<number>;
    private _indices: Array<number>;
    public constructor() {
        super();
        this._segments = [];
        this._verts = [];
        this._indices = [];
    }
    public addSegment(x: number, y: number): void {
        let seg: Segment;
        while(this._segments.length > Settings.EFFECT_BALL_TRAIL_LENGTH) {
            seg = this._segments.shift()
        }
        if(!seg ) {
            seg = new Segment()
        } 
        seg.x = x;
        seg.y = y;
        this._segments.push(seg);
    }
    public redrawSegments(offsetX: number = 0, offsetY: number = 0): void {
        graphics.clear();
        if(!Settings.EFFECT_BALL_TRAIL ) {
            return
        } 
        let s1: Segment;
        let s2: Segment;
        let vertIndex: number = 0;
        let offset: number;
        let ang: number;
        let sin: number = 0;
        let cos: number = 0;
        if(this._verts.length != (this._segments.length - 1) * 4 ) {
            this._verts.length = 0;
        } 
        for(let j: number = 0; j < this._segments.length; ++j) {
            s1 = this._segments[j];
            if(s2 ) {
                ang = Math.atan2(s1.y - s2.y, s1.x - s2.x) + Math.PI / 2;
                sin = Math.sin(ang);
                cos = Math.cos(ang);
                for(let i: number = 0; i < 2; ++i) {
                    offset = (-.5 + i / 1) * 9.0;
                    if(Settings.EFFECT_BALL_TRAIL_SCALE ) {
                        offset *= j / this._segments.length;
                    } 
                    this._verts[vertIndex++] = s1.x + cos * offset - offsetX;
                    this._verts[vertIndex++] = s1.y + sin * offset - offsetY;
                }
            } 
            s2 = s1;
        }
        if(this._verts.length >= 8 ) {
            for(let k: number = 0; k < this._verts.length / 2; k++) {
                this._indices[k * 6 + 0] = k * 2 + 0;
                this._indices[k * 6 + 1] = k * 2 + 1;
                this._indices[k * 6 + 2] = k * 2 + 2;
                this._indices[k * 6 + 3] = k * 2 + 1;
                this._indices[k * 6 + 4] = k * 2 + 2;
                this._indices[k * 6 + 5] = k * 2 + 3;
            }
            graphics.beginFill(Settings.COLOR_TRAIL);
            graphics.drawTriangles(this._verts, this._indices);
        } 
    }
    private get head(): Segment {
        return this._segments.length ? this._segments[int(this._segments.length - 1)] : null;
    }
    private get tail(): Segment {
        return this._segments.length ? this._segments[0] : null;
    }
}
class Segment {
    public x: number = 0.0;
    public y: number = 0.0;
}