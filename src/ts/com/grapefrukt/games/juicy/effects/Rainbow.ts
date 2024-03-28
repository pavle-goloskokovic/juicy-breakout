import { Settings } from '../Settings';

class Segment {
    x = 0;
    y = 0;
}

export class Rainbow extends Phaser.GameObjects.Graphics {

    private segments: Segment[] = [];
    private verts: number[] = [];
    // private indices: number[] = [];

    addSegment (x: number, y: number): void
    {
        const segments = this.segments;

        let seg: Segment;

        while (segments.length > Settings.EFFECT_BALL_TRAIL_LENGTH)
        {
            seg = segments.shift();
        }

        if (!seg)
        {
            seg = new Segment();
        }

        seg.x = x;
        seg.y = y;

        segments.push(seg);
    }

    redrawSegments (offsetX = 0, offsetY = 0): void
    {
        this.clear();

        if (!Settings.EFFECT_BALL_TRAIL) { return; }

        const segments = this.segments;
        const verts = this.verts;

        if (verts.length !== (segments.length - 1) * 4)
        {
            verts.length = 0;
        }

        let s2: Segment;
        let vertIndex = 0;

        for (let i = 0; i < segments.length; ++i)
        {
            const s1 = segments[i];

            if (s2)
            {
                const ang = Math.atan2(s1.y - s2.y, s1.x - s2.x) + Math.PI / 2;
                const sin = Math.sin(ang);
                const cos = Math.cos(ang);

                for (let j = 0; j < 2; ++j)
                {
                    let offset = (-.5 + j) * 9.0;

                    if (Settings.EFFECT_BALL_TRAIL_SCALE)
                    {
                        offset *= i / segments.length;
                    }

                    verts[vertIndex++] = s1.x + cos * offset - offsetX;
                    verts[vertIndex++] = s1.y + sin * offset - offsetY;
                }
            }

            s2 = s1;
        }

        if (verts.length >= 8)
        {
            this.fillStyle(Settings.COLOR_TRAIL);

            for (let k = 0; k < verts.length / 2; k++)
            {
                /*const indices = this.indices;
                indices[k * 6    ] = k * 2;
                indices[k * 6 + 1] = k * 2 + 1;
                indices[k * 6 + 2] = k * 2 + 2;
                indices[k * 6 + 3] = k * 2 + 1;
                indices[k * 6 + 4] = k * 2 + 2;
                indices[k * 6 + 5] = k * 2 + 3;*/

                this.fillTriangle(
                    verts[(k * 2    ) * 2], verts[(k * 2    ) * 2 + 1],
                    verts[(k * 2 + 1) * 2], verts[(k * 2 + 1) * 2 + 1],
                    verts[(k * 2 + 2) * 2], verts[(k * 2 + 2) * 2 + 1]
                );
                this.fillTriangle(
                    verts[(k * 2 + 1) * 2], verts[(k * 2 + 1) * 2 + 1],
                    verts[(k * 2 + 2) * 2], verts[(k * 2 + 2) * 2 + 1],
                    verts[(k * 2 + 3) * 2], verts[(k * 2 + 3) * 2 + 1]
                );
            }
        }
    }
}
