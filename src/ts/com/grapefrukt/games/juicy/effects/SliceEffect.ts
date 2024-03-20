import {BitmapData} from "../../../../../flash/display/BitmapData";
import {DisplayObject} from "../../../../../flash/display/DisplayObject";
import {Shape} from "../../../../../flash/display/Shape";
import {Sprite} from "../../../../../flash/display/Sprite";
import {StageScaleMode} from "../../../../../flash/display/StageScaleMode";
import {Event} from "../../../../../flash/events/Event";
import {KeyboardEvent} from "../../../../../flash/events/KeyboardEvent";
import {MouseEvent} from "../../../../../flash/events/MouseEvent";
import {Matrix} from "../../../../../flash/geom/Matrix";
import {Point} from "../../../../../flash/geom/Point";
import {Rectangle} from "../../../../../flash/geom/Rectangle";
import {Keyboard} from "../../../../../flash/ui/Keyboard";
export class SliceEffect extends Sprite {
    private _container: Sprite;
    private _slices: Array<LineSliceObject>;
    public constructor(source: DisplayObject, bounds: Rectangle = null) {
        super();
        let bounds: Rectangle = source.getBounds(source.parent);
        let rp: Point = source.getBounds(source).topLeft;
        rp.x *= -1;
        rp.y *= -1;
        let matrix: Matrix = new Matrix();
        matrix.scale(source.scaleX, source.scaleY);
        matrix.rotate(source.rotation / 180 * Math.PI);
        matrix.translate(source.x - bounds.topLeft.x, source.y - bounds.topLeft.y);
        let bmp: BitmapData = new BitmapData(bounds.width, bounds.height, true, 0x00000000);
        bmp.draw(source, matrix);
        this._container = new Sprite();
        addChild(this._container);
        this._slices = [];
        this._container.addEventListener(Event.ADDED, this.handleAdded);
        this._container.addEventListener(Event.REMOVED, this.handleRemoved);
        this.x = source.x;
        this.y = source.y;
        let points: Array<Point> = [new Point(0, 0), new Point(bmp.width, 0), new Point(bmp.width, bmp.height), new Point(0, bmp.height)];
        let offset: Point = new Point(bounds.topLeft.x - source.x, bounds.topLeft.y - source.y);
        for(let i: number = 0; i < points.length; i++) {
            points[i] = points[i].add(offset);
        }
        let lso: LineSliceObject = new LineSliceObject(points, bmp, offset);
        this._container.addChild(lso);
    }
    public update(timeDelta: number): void {
        for(let slice of this._slices) {
            slice.x += slice.velocity.x * timeDelta;
            slice.y += slice.velocity.y * timeDelta;
            slice.rotation += slice.velocityR * timeDelta;
            slice.velocity.x -= slice.velocity.x * 0.01 * timeDelta;
            slice.velocity.y -= slice.velocity.y * 0.01 * timeDelta;
            slice.velocityR -= slice.velocityR * 0.01 * timeDelta;
        }
    }
    public slice(p1: Point, p2: Point): void {
        let toSlice: Array<LineSliceObject> = this._slices.concat();
        for(let slice of toSlice) {
            slice.slice(p1, p2);
        }
    }
    private handleAdded(e: Event): void {
        if(!(e.target instanceof LineSliceObject) ) {
            return
        } 
        this._slices.push(e.target);
    }
    private handleRemoved(e: Event): void {
        if(!(e.target instanceof LineSliceObject) ) {
            return
        } 
        this._slices.splice(this._slices.indexOf(e.target), 1);
    }
    public get slices(): Array<LineSliceObject> {
        return this._slices;
    }
}
import {Settings} from "../Settings";
class LineSliceObject extends Shape {
    private _points: Array<Point>;
    private _point1: Point;
    private _point2: Point;
    private _length: number;
    private _texture: BitmapData;
    private _textureOffset: Point;
    public velocity: Point;
    public velocityR: number = 0;
    public constructor(points: Array<Point>, texture: BitmapData, textureOffset: Point) {
        super();
        this._textureOffset = textureOffset;
        this._texture = texture;
        this._points = points;
        this.velocity = new Point();
        this.render();
    }
    private render(): void {
        graphics.beginBitmapFill(this._texture, new Matrix(1, 0, 0, 1, this._textureOffset.x, this._textureOffset.y), false, true);
        graphics.moveTo(this._points[0].x, this._points[0].y);
        this._length = this._points.length;
        for(let i: number = 1; i < this._length; i++) {
            graphics.lineTo(this._points[i].x, this._points[i].y);
        }
        graphics.endFill();
    }
    public slice(point1: Point, point2: Point): void {
        let _pt1: Point = globalToLocal(parent.localToGlobal(point1));
        let _pt2: Point = globalToLocal(parent.localToGlobal(point2));
        let newPoints: Array<Array<Point>> = [] < Array < Point >> [[], []];
        let _numCross: number = 0;
        for(let i: number = 0; i < this._length; i++) {
            let _pt3: Point = this._points[i];
            let _pt4: Point = this._points.length > i + 1 ? this._points[i + 1] : this._points[0];
            let _crossPt: Point = this.crossPoint(_pt1, _pt2, _pt3, _pt4);
            newPoints[0].push(_pt3);
            if(_crossPt ) {
                newPoints[0].push(_crossPt);
                newPoints[1].push(_crossPt);
                newPoints.reverse();
                _numCross++;
            } 
        }
        if(_numCross == 2 ) {
            let slice1: LineSliceObject = new LineSliceObject(newPoints[0], this._texture, this._textureOffset);
            let slice2: LineSliceObject = new LineSliceObject(newPoints[1], this._texture, this._textureOffset);
            slice1.x = (slice2.x = this.x);
            slice1.y = (slice2.y = this.y);
            slice1.rotation = (slice2.rotation = this.rotation);
            parent.addChild(slice1);
            parent.addChild(slice2);
            parent.removeChild(this);
            let vector: Point = _pt2.subtract(_pt1);
            let angle: number = Math.atan2(vector.y, vector.x);
            let force: number = Settings.EFFECT_BLOCK_SHATTER_FORCE;
            let fx: number = Math.abs(Math.sin(angle));
            let fy: number = Math.abs(Math.cos(angle));
            let fx1: number = newPoints[0][0].x < newPoints[1][0].x ? -fx : fx;
            let fx2: number = newPoints[1][0].x < newPoints[0][0].x ? -fx : fx;
            let fy1: number = newPoints[0][0].y < newPoints[1][0].y ? -fy : fy;
            let fy2: number = newPoints[1][0].y < newPoints[0][0].y ? -fy : fy;
            slice1.velocity = this.velocity.clone();
            slice2.velocity = this.velocity.clone();
            slice1.velocityR = this.velocityR + Math.random() * Settings.EFFECT_BLOCK_SHATTER_ROTATION - Settings.EFFECT_BLOCK_SHATTER_ROTATION / 2;
            slice2.velocityR = this.velocityR + Math.random() * Settings.EFFECT_BLOCK_SHATTER_ROTATION - Settings.EFFECT_BLOCK_SHATTER_ROTATION / 2;
            slice1.velocity.x += fx1 * force;
            slice1.velocity.y += fy1 * force;
            slice2.velocity.x += fx2 * force;
            slice2.velocity.y += fy2 * force;
        } 
    }
    private crossPoint(pt1: Point, pt2: Point, pt3: Point, pt4: Point): Point {
        let _vector1: Point = pt2.subtract(pt1);
        let _vector2: Point = pt4.subtract(pt3);
        if(this.cross(_vector1, _vector2) == 0.0 ) {
            return null
        } 
        let _s: number = this.cross(_vector2, pt3.subtract(pt1)) / this.cross(_vector2, _vector1);
        let _t: number = this.cross(_vector1, pt1.subtract(pt3)) / this.cross(_vector1, _vector2);
        if(LineSliceObject.isCross(_s) && LineSliceObject.isCross(_t) ) {
            _vector1.x *= _s;
            _vector1.y *= _s;
            return pt1.add(_vector1);
        } else {
            return null
        }
    }
    private cross(vector1: Point, vector2: Point): number {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }
    public static isCross(n: number): boolean {
        return 0 <= n && n <= 1;
    }
}