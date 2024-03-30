import type { Ball } from '../gameobjects/Ball';
import { Settings } from '../Settings';

const tempVec = new Phaser.Math.Vector2();
const tempVec2 = new Phaser.Math.Vector2();
const tempVec3 = new Phaser.Math.Vector2();
const tempVec4 = new Phaser.Math.Vector2();

export class BouncyLine extends Phaser.GameObjects.Graphics {

    private pos1 = new Phaser.Math.Vector2();
    private pos2 = new Phaser.Math.Vector2();
    private posMiddle = new Phaser.Math.Vector2();

    private curveMiddle = new Phaser.Math.Vector2();
    private curve = new Phaser.Curves
        .QuadraticBezier(this.pos1, this.curveMiddle, this.pos2);

    private wobbleMiddle = new Phaser.Math.Vector2();
    private wobbleVelocity = new Phaser.Math.Vector2();
    private readonly lineRotation: number;
    private bounceSpeed = 0.25;
    private bounciness = 0.85;
    private collisionCounter = 0;

    constructor (
        scene: Phaser.Scene,
        x1 = 0, y1 = 0,
        x2 = 0, y2 = 0
    )
    {
        super(scene);

        this.pos1.set(x1, y1);
        this.pos2.set(x2, y2);

        const delta = tempVec
            .copy(this.pos2)
            .subtract(this.pos1);

        const length = delta.length();

        delta.normalize();

        this.lineRotation = Math.atan2(delta.y, delta.x);

        delta.scale(length * 0.5);

        this.posMiddle
            .copy(this.pos1)
            .add(delta);
    }

    wobble (x: number, y: number): void
    {
        const wobbleMiddle = this.wobbleMiddle.set(
            x - this.posMiddle.x,
            y - this.posMiddle.y
        );

        const tx = wobbleMiddle.x;

        wobbleMiddle.x = tx * Math.cos(this.lineRotation)
            - wobbleMiddle.y * Math.sin(this.lineRotation);

        wobbleMiddle.y = tx * Math.sin(this.lineRotation)
            + wobbleMiddle.y * Math.cos(this.lineRotation);
    }

    update (/*deltaFactor = 1*/): void
    {
        if (Math.abs(this.wobbleMiddle.y) > 0)
        {
            this.wobbleVelocity.y += -this.bounceSpeed * this.wobbleMiddle.y;
            this.wobbleVelocity.y *= this.bounciness;
        }

        if (Math.abs(this.wobbleMiddle.x) > 0)
        {
            this.wobbleMiddle.x *= 0.95;
        }

        this.wobbleMiddle.add(this.wobbleVelocity);

        this.clear();

        this.lineStyle(
            Settings.EFFECT_BOUNCY_LINES_WIDTH,
            Settings.EFFECT_SCREEN_COLORS ?
                Settings.COLOR_BOUNCY_LINES : 0xFFFFFF,
            1,
            // false, 'normal', CapsStyle.SQUARE
        );

        if (Settings.EFFECT_BOUNCY_LINES_ENABLED)
        {
            this.middle; // getter logic

            this.curve.draw(this);
        }
        else
        {
            this.lineBetween(
                this.pos1.x, this.pos1.y,
                this.pos2.x, this.pos2.y
            );
        }

        if (this.collisionCounter > 0)
        {
            this.collisionCounter--;
        }
    }

    /*get position1 (): Phaser.Math.Vector2
    {
        return this.pos1;
    }

    get position2 (): Phaser.Math.Vector2
    {
        return this.pos2;
    }*/

    get middle (): Phaser.Math.Vector2
    {
        const curveMiddle = this.curveMiddle
            .copy(this.wobbleMiddle);

        const angle = -this.lineRotation;
        const tx = curveMiddle.x;

        curveMiddle.x = tx * Math.cos(angle) - curveMiddle.y * Math.sin(angle);
        curveMiddle.y = tx * Math.sin(angle) + curveMiddle.y * Math.cos(angle);

        curveMiddle.add(this.posMiddle);

        return curveMiddle;
    }

    checkCollision (ball: Ball): void
    {
        if (this.collisionCounter > 0)
        {
            return;
        }

        const dist = this.distanceFromLine(
            this.pos1, this.pos2,
            tempVec.set(ball.x, ball.y)
        );

        const maxDistance = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH
            + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;

        if (dist <= maxDistance)
        {
            this.wobble(
                ball.x + Settings.EFFECT_BOUNCY_LINES_STRENGHT * ball.velocityX,
                ball.y + Settings.EFFECT_BOUNCY_LINES_STRENGHT * ball.velocityY
            );

            this.collisionCounter = 2;
        }
    }

    private closestPointOnLineSegment (
        a: Phaser.Math.Vector2,
        b: Phaser.Math.Vector2,
        p: Phaser.Math.Vector2,
        out: Phaser.Math.Vector2
    ): Phaser.Math.Vector2
    {
        const c = tempVec3.set(p.x - a.x, p.y - a.y);
        const v = tempVec4.set(b.x - a.x, b.y - a.y);

        const distance = v.length();

        if (distance !== 0)
        {
            v.x /= distance;
            v.y /= distance;
        }

        const t = v.x * c.x + v.y * c.y;

        if (t < 0)
        {
            return out.copy(a);
        }

        if (t > distance)
        {
            return out.copy(b);
        }

        v.x *= t;
        v.y *= t;

        return out.copy(a).add(v);
    }

    private distanceFromLine (
        a: Phaser.Math.Vector2,
        b: Phaser.Math.Vector2,
        p: Phaser.Math.Vector2
    ): number
    {
        const delta =
            this.closestPointOnLineSegment(a, b, p, tempVec2);

        delta.x = delta.x - p.x;
        delta.y = delta.y - p.y;

        return delta.length();
    }

    /*private lineIntersectLine (
        a: Phaser.Math.Vector2,
        b: Phaser.Math.Vector2,
        e: Phaser.Math.Vector2,
        f: Phaser.Math.Vector2,
        out: Phaser.Math.Vector2,
        asSeg = true
    ): Phaser.Math.Vector2
    {
        const a1 = b.y - a.y;
        const b1 = a.x - b.x;
        const c1 = b.x * a.y - a.x * b.y;
        const a2 = f.y - e.y;
        const b2 = e.x - f.x;
        const c2 = f.x * e.y - e.x * f.y;

        const denom = a1 * b2 - a2 * b1;

        if (denom === 0)
        {
            return null;
        }

        const ip = out.set(
            (b1 * c2 - b2 * c1) / denom,
            (a2 * c1 - a1 * c2) / denom
        );

        if (asSeg)
        {
            if (Math.pow(ip.x - b.x, 2) + Math.pow(ip.y - b.y, 2) >
                Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
            {
                return null;
            }

            if (Math.pow(ip.x - a.x, 2) + Math.pow(ip.y - a.y, 2) >
                Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
            {
                return null;
            }

            if (Math.pow(ip.x - f.x, 2) + Math.pow(ip.y - f.y, 2) >
                Math.pow(e.x - f.x, 2) + Math.pow(e.y - f.y, 2))
            {
                return null;
            }

            if (Math.pow(ip.x - e.x, 2) + Math.pow(ip.y - e.y, 2) >
                Math.pow(e.x - f.x, 2) + Math.pow(e.y - f.y, 2))
            {
                return null;
            }
        }

        return ip;
    }*/
}
