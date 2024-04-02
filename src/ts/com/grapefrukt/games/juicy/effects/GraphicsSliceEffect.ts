import { Settings } from '../Settings';
import { applyColorTransform } from './ColorTransform';
import Vector2 = Phaser.Math.Vector2;

export class GraphicsSliceEffect extends Phaser.GameObjects.Container {

    slices: LineSliceObject[] = [];

    constructor (
        scene: Phaser.Scene,
        source: Phaser.GameObjects.Graphics,
        bounds: Phaser.Geom.Rectangle
    )
    {
        super(scene);

        this.x = source.x;
        this.y = source.y;

        const scaleX = source.scaleX;
        const scaleY = source.scaleY;
        const left = bounds.left * scaleX;
        const top = bounds.top * scaleY;
        const right = bounds.right * scaleX;
        const bottom = bounds.bottom * scaleY;

        const points = [
            new Vector2(left, top),
            new Vector2(right, top),
            new Vector2(right, bottom),
            new Vector2(left, bottom)
        ];

        this.addSlice(new LineSliceObject(scene, points));
    }

    update (deltaFactor: number): void
    {
        for (const slice of this.slices)
        {
            slice.x += slice.velocity.x * deltaFactor;
            slice.y += slice.velocity.y * deltaFactor;

            slice.angle += slice.velocityR * deltaFactor;

            slice.velocity.x -= slice.velocity.x * 0.01 * deltaFactor;
            slice.velocity.y -= slice.velocity.y * 0.01 * deltaFactor;

            slice.velocityR -= slice.velocityR * 0.01 * deltaFactor;
        }
    }

    slice (p1: Vector2, p2: Vector2): void
    {
        const toSlice = this.slices.concat();

        for (const slice of toSlice)
        {
            slice.lineSlice(p1, p2);
        }
    }

    addSlice (s: LineSliceObject): void
    {
        this.slices.push(s);

        this.add(this.scene.add.existing(s));
    }

    removeSlice (s: LineSliceObject): void
    {
        this.slices.splice(this.slices.indexOf(s), 1);

        s.destroy();
    }
}

class LineSliceObject extends Phaser.GameObjects.Graphics {

    velocity = new Vector2();
    velocityR = 0;

    constructor (
        scene: Phaser.Scene,
        private points: Vector2[]
    )
    {
        super(scene);

        this.render();
    }

    private render (): void
    {
        this.fillStyle(Settings.EFFECT_SCREEN_COLORS ?
            (Settings.EFFECT_BLOCK_DARKEN ?
                applyColorTransform(Settings.COLOR_BLOCK, .7, .7, .8)
                : Settings.COLOR_BLOCK
            ) : 0xFFFFFF
        );

        this.fillPoints(this.points);
    }

    lineSlice (pt1: Vector2, pt2: Vector2): void
    {
        const points = this.points;
        const newPoints: Vector2[][] = [[], []];

        let numCross = 0;

        for (let i = 0; i < points.length; i++)
        {
            const pt3 = points[i];

            const pt4 = points.length > i + 1 ?
                points[i + 1] :
                points[0];

            const crossPt = this.crossPoint(pt1, pt2, pt3, pt4);

            newPoints[0].push(pt3);

            if (crossPt)
            {
                newPoints[0].push(crossPt);
                newPoints[1].push(crossPt);
                newPoints.reverse();
                numCross++;
            }
        }

        if (numCross === 2)
        {
            const slice1 =
                new LineSliceObject(this.scene, newPoints[0]);
            const slice2 =
                new LineSliceObject(this.scene, newPoints[1]);

            slice1.x =
                slice2.x = this.x;

            slice1.y =
                slice2.y = this.y;

            slice1.angle =
                slice2.angle = this.angle;

            const parent = this.parentContainer as GraphicsSliceEffect;
            parent.addSlice(slice1);
            parent.addSlice(slice2);
            parent.removeSlice(this);

            const vector = new Vector2().copy(pt2).subtract(pt1);

            const angle = Math.atan2(vector.y, vector.x);

            const force = Settings.EFFECT_BLOCK_SHATTER_FORCE;
            const fx = Math.abs(Math.sin(angle));
            const fy = Math.abs(Math.cos(angle));
            const fx1 = newPoints[0][0].x < newPoints[1][0].x ? -fx : fx;
            const fx2 = newPoints[1][0].x < newPoints[0][0].x ? -fx : fx;
            const fy1 = newPoints[0][0].y < newPoints[1][0].y ? -fy : fy;
            const fy2 = newPoints[1][0].y < newPoints[0][0].y ? -fy : fy;

            slice1.velocity.copy(
                slice2.velocity.copy(this.velocity));

            slice1.velocityR = this.velocityR
                + Math.random() * Settings.EFFECT_BLOCK_SHATTER_ROTATION
                - Settings.EFFECT_BLOCK_SHATTER_ROTATION / 2;

            slice2.velocityR = this.velocityR
                + Math.random() * Settings.EFFECT_BLOCK_SHATTER_ROTATION
                - Settings.EFFECT_BLOCK_SHATTER_ROTATION / 2;

            slice1.velocity.x += fx1 * force;
            slice1.velocity.y += fy1 * force;
            slice2.velocity.x += fx2 * force;
            slice2.velocity.y += fy2 * force;
        }
    }

    private crossPoint (pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2): Vector2
    {
        // TODO cache vectors
        const vector1 = new Vector2().copy(pt2).subtract(pt1);
        const vector2 = new Vector2().copy(pt4).subtract(pt3);

        if (this.cross(vector1, vector2) === 0)
        {
            return null;
        }

        const _s = this.cross(vector2,
            new Vector2().copy(pt3).subtract(pt1)
        ) / this.cross(vector2, vector1);

        const _t = this.cross(vector1,
            new Vector2().copy(pt1).subtract(pt3)
        ) / this.cross(vector1, vector2);

        if (LineSliceObject.isCross(_s) && LineSliceObject.isCross(_t))
        {
            vector1.x *= _s;
            vector1.y *= _s;

            return new Vector2().copy(pt1).add(vector1);
        }
        else
        {
            return null;
        }
    }

    private cross (vector1: Vector2, vector2: Vector2): number
    {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    static isCross (n: number): boolean
    {
        return 0 <= n && n <= 1;
    }
}
