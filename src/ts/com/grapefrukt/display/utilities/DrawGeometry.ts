import type { Graphics } from '../../../../flash/display/Graphics';
export class DrawGeometry {
    static drawIrregularCircle (graphics: Graphics, x: number, y: number, radius: number, irregularity = .2, slices = -1): void
    {
        if (slices < 0 )
        {
            slices = Math.round(Math.sqrt(radius * radius * Math.PI) / 10);
            if (slices < 6 )
            {
                slices = 6;
            }
        }
        let angle: number = Math.random() * 2 * Math.PI;
        let px = 0;
        let py = 0;
        let rndRadius = 0;
        for (let i = 0; i < slices; i++)
        {
            rndRadius = radius * (1 + Math.random() * irregularity * 2 - irregularity / 2);
            px = x + Math.cos(angle) * rndRadius;
            py = y + Math.sin(angle) * rndRadius;
            if (i == 0 )
            {
                graphics.moveTo(px, py);
            }
            graphics.lineTo(px, py);
            angle += 2 * Math.PI / slices;
        }
        graphics.endFill();
    }

    static drawDonut (graphics: Graphics, x: number, y: number, xRadius: number, yRadius: number, innerXRadius: number, innerYRadius: number, color = 0xFF0000, fillAlpha = 1): void
    {
        let segAngle: number;
        let theta: number;
        let angle: number;
        let angleMid: number;
        let segs: number;
        let bx: number;
        let by: number;
        let cx: number;
        let cy: number;
        segs = 8;
        segAngle = 45;
        theta = 0;
        angle = 0;
        graphics.beginFill(color, fillAlpha);
        graphics.moveTo(x + Math.cos(0) * innerXRadius, y + Math.sin(0) * innerYRadius);
        graphics.lineTo(x + Math.cos(0) * xRadius, y + Math.sin(0) * yRadius);
        for (let i = 0; i < segs; i++)
        {
            angle += theta;
            angleMid = angle - theta / 2;
            bx = x + Math.cos(angle) * xRadius;
            by = y + Math.sin(angle) * yRadius;
            cx = x + Math.cos(angleMid) * (xRadius / Math.cos(theta / 2));
            cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            graphics.curveTo(cx, cy, bx, by);
        }
        graphics.lineTo(x + Math.cos(2 * Math.PI) * innerXRadius, y + Math.sin(-2 * Math.PI) * innerYRadius);
        theta = -(segAngle / 180) * Math.PI;
        angle = -2 * Math.PI;
        for (let j = 0; j < segs; j++)
        {
            angle -= theta;
            angleMid = angle + theta / 2;
            bx = x + Math.cos(angle) * innerXRadius;
            by = y + Math.sin(angle) * innerYRadius;
            cx = x + Math.cos(angleMid) * (innerXRadius / Math.cos(theta / 2));
            cy = y + Math.sin(angleMid) * (innerYRadius / Math.cos(theta / 2));
            graphics.curveTo(cx, cy, bx, by);
        }
        graphics.endFill();
    }

    static drawWedge (graphics: Graphics, x: number, y: number, startAngle: number, arc: number, xRadius: number, yRadius: number, innerXRadius: number, innerYRadius: number, color = 0xFF0000, fillAlpha = 1): void
    {
        let segAngle: number;
        let theta: number;
        let angle: number;
        let angleMid: number;
        let segs: number;
        let bx: number;
        let by: number;
        let cx: number;
        let cy: number;
        segs = Math.ceil(Math.abs(arc) / 45);
        segAngle = arc / segs;
        theta = -(segAngle / 180) * Math.PI;
        angle = -(startAngle / 180) * Math.PI;
        graphics.beginFill(color, fillAlpha);
        graphics.moveTo(x + Math.cos(startAngle / 180 * Math.PI) * innerXRadius, y + Math.sin(-startAngle / 180 * Math.PI) * innerYRadius);
        graphics.lineTo(x + Math.cos(startAngle / 180 * Math.PI) * xRadius, y + Math.sin(-startAngle / 180 * Math.PI) * yRadius);
        for (let i = 0; i < segs; i++)
        {
            angle += theta;
            angleMid = angle - theta / 2;
            bx = x + Math.cos(angle) * xRadius;
            by = y + Math.sin(angle) * yRadius;
            cx = x + Math.cos(angleMid) * (xRadius / Math.cos(theta / 2));
            cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            graphics.curveTo(cx, cy, bx, by);
        }
        graphics.lineTo(x + Math.cos((startAngle + arc) / 180 * Math.PI) * innerXRadius, y + Math.sin(-(startAngle + arc) / 180 * Math.PI) * innerYRadius);
        theta = -(segAngle / 180) * Math.PI;
        angle = -((startAngle + arc) / 180) * Math.PI;
        for (let j = 0; j < segs; j++)
        {
            angle -= theta;
            angleMid = angle + theta / 2;
            bx = x + Math.cos(angle) * innerXRadius;
            by = y + Math.sin(angle) * innerYRadius;
            cx = x + Math.cos(angleMid) * (innerXRadius / Math.cos(theta / 2));
            cy = y + Math.sin(angleMid) * (innerYRadius / Math.cos(theta / 2));
            graphics.curveTo(cx, cy, bx, by);
        }
        graphics.endFill();
    }

    static drawTriangle (graphics: Graphics, x: number, y: number, size: number, invert = false): void
    {
        if (invert )
        {
            graphics.moveTo(x, y - size / 2);
            graphics.lineTo(x + size / 2, y + size / 2);
            graphics.lineTo(x - size / 2, y + size / 2);
        }
        else
        {
            graphics.moveTo(x - size / 2, y - size / 2);
            graphics.lineTo(x + size / 2, y - size / 2);
            graphics.lineTo(x, y + size / 2);
        }
    }

    static drawArrow (graphics: Graphics, size: number): void
    {
        DrawGeometry.drawTriangle(graphics, 0, size, size);
    }
}
