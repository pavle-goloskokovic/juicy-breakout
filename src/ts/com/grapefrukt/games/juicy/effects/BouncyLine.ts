import { BarChart } from '../../../../bit101/charts/BarChart';
import { GameObject } from '../../general/gameobjects/GameObject';
import type { Ball } from '../gameobjects/Ball';
import { Settings } from '../Settings';
import { CapsStyle } from '../../../../../flash/display/CapsStyle';
import { Shape } from '../../../../../flash/display/Shape';
import { Point } from '../../../../../flash/geom/Point';
export class BouncyLine extends GameObject {
    public constructor (x1 = 0, y1 = 0, x2 = 0, y2 = 0)
    {
        super();
        this.set(x1, y1, x2, y2);
    }

    public set (x1: number, y1: number, x2: number, y2: number): void
    {
        this.pos1.x = x1;
        this.pos1.y = y1;
        this.pos2.x = x2;
        this.pos2.y = y2;
        let delta: Point;
        delta = this.pos2.clone();
        delta = delta.subtract(this.pos1);
        this.length = delta.length;
        delta.normalize(1);
        this.line_rotation = Math.atan2(delta.y, delta.x);
        delta.normalize(this.length * 0.5);
        this.pos_middle = this.pos1.clone();
        this.pos_middle = this.pos_middle.add(delta);
    }

    public wobble (x: number, y: number): void
    {
        const wobble_pos: Point = new Point(x - this.pos_middle.x, y - this.pos_middle.y);
        const tx: number = wobble_pos.x;
        wobble_pos.x = wobble_pos.x * Math.cos(this.line_rotation) - wobble_pos.y * Math.sin(this.line_rotation);
        wobble_pos.y = tx * Math.sin(this.line_rotation) + wobble_pos.y * Math.cos(this.line_rotation);
        this.wobble_middle = wobble_pos;
    }

    public update (imeDelta = 1): void
    {
        if (Math.abs(this.wobble_middle.y) > 0 )
        {
            this.wobble_velocity.y += -this.bounce_speed * this.wobble_middle.y;
            this.wobble_velocity.y *= this.bounciness;
        }
        if (Math.abs(this.wobble_middle.x) > 0 )
        {
            this.wobble_middle.x *= 0.95;
        }
        this.wobble_middle = this.wobble_middle.add(this.wobble_velocity);
        this.graphics.clear();
        this.graphics.lineStyle(Settings.EFFECT_BOUNCY_LINES_WIDTH, Settings.COLOR_BOUNCY_LINES, 1, false, 'normal', CapsStyle.SQUARE);
        this.graphics.moveTo(this.pos1.x, this.pos1.y);
        const m: Point = this.middle;
        if (Settings.EFFECT_BOUNCY_LINES_ENABLED )
        {
            this.graphics.curveTo(m.x, m.y, this.pos2.x, this.pos2.y);
        }
        else
        {
            this.graphics.lineTo(this.pos2.x, this.pos2.y);
        }
        if (this.collisionCounter > 0 )
        {
            this.collisionCounter--;
        }
    }

    public get position1 (): Point
    {
        return this.pos1;
    }

    public get position2 (): Point
    {
        return this.pos2;
    }

    public get middle (): Point
    {
        let temp: Point;
        temp = this.wobble_middle.clone();
        let angle: number;
        angle = -this.line_rotation;
        let tx: number;
        tx = temp.x;
        temp.x = temp.x * Math.cos(angle) - temp.y * Math.sin(angle);
        temp.y = tx * Math.sin(angle) + temp.y * Math.cos(angle);
        temp = temp.add(this.pos_middle);
        return temp;
    }

    public checkCollision (ball: Ball): void
    {
        if (this.collisionCounter > 0 )
        {
            return;
        }
        const dist: number = this.distanceFromLine(this.pos1, this.pos2, new Point(ball.x, ball.y));
        const max_distance: number = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        if (dist <= max_distance )
        {
            this.wobble(ball.x + Settings.EFFECT_BOUNCY_LINES_STRENGHT * ball.velocityX, ball.y + Settings.EFFECT_BOUNCY_LINES_STRENGHT * ball.velocityY);
            this.collisionCounter = 2;
        }
    }

    public closestPointOnLineSegment (a: Point, b: Point, p: Point): Point
    {
        const c: Point = new Point(p.x - a.x, p.y - a.y);
        const v: Point = new Point(b.x - a.x, b.y - a.y);
        const distance: number = v.length;
        if (distance != 0 )
        {
            v.x /= distance;
            v.y /= distance;
        }
        const t: number = v.x * c.x + v.y * c.y;
        if (t < 0 )
        {
            return a.clone();
        }
        if (t > distance )
        {
            return b.clone();
        }
        v.x *= t;
        v.y *= t;
        return a.add(v);
    }

    public distanceFromLine (a: Point, b: Point, p: Point): number
    {
        const delta: Point = this.closestPointOnLineSegment(a, b, p);
        delta.x = delta.x - p.x;
        delta.y = delta.y - p.y;
        return delta.length;
    }

    private lineIntersectLine (A: Point, B: Point, E: Point, F: Point, as_seg = true): Point
    {
        let ip: Point;
        let a1: number;
        let a2: number;
        let b1: number;
        let b2: number;
        let c1: number;
        let c2: number;
        a1 = B.y - A.y;
        b1 = A.x - B.x;
        c1 = B.x * A.y - A.x * B.y;
        a2 = F.y - E.y;
        b2 = E.x - F.x;
        c2 = F.x * E.y - E.x * F.y;
        const denom: number = a1 * b2 - a2 * b1;
        if (denom == 0 )
        {
            return null;
        }
        ip = new Point();
        ip.x = (b1 * c2 - b2 * c1) / denom;
        ip.y = (a2 * c1 - a1 * c2) / denom;
        if (as_seg )
        {
            if (Math.pow(ip.x - B.x, 2) + Math.pow(ip.y - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) )
            {
                return null;
            }
            if (Math.pow(ip.x - A.x, 2) + Math.pow(ip.y - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) )
            {
                return null;
            }
            if (Math.pow(ip.x - F.x, 2) + Math.pow(ip.y - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2) )
            {
                return null;
            }
            if (Math.pow(ip.x - E.x, 2) + Math.pow(ip.y - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2) )
            {
                return null;
            }
        }
        return ip;
    }

    private pos1: Point = new Point();
    private pos2: Point = new Point();
    private pos_middle: Point = new Point();
    private length = 0;
    private wobble_middle: Point = new Point();
    private wobble_velocity: Point = new Point();
    private line_rotation = 0;
    private bounce_speed = 0.25;
    private bounciness = 0.85;
    private collisionCounter = 0;
}