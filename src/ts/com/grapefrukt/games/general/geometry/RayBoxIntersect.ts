import { Point } from '../../../../../flash/geom/Point';
import type { Rectangle } from '../../../../../flash/geom/Rectangle';
export class RayBoxIntersect {
    public static IN = 0;
    public static OUT = 1;
    public static rayBoxIntersect (r1: Point, r2: Point, box: Rectangle): Array<Point>
    {
        if (box.x + box.width < Math.min(r1.x, r2.x) || box.x > Math.max(r1.x, r2.x) )
        {
            return null;
        }
        if (box.y + box.height < Math.min(r1.y, r2.y) || box.y > Math.max(r1.y, r2.y) )
        {
            return null;
        }
        let intersections: Array<Point>;
        let tnear: number;
        let tfar: number;
        tnear = Math.max((box.x - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
        tfar = Math.min((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
        if (tnear < tfar )
        {
            intersections = [2, true];
            if (tnear >= 0 && tnear <= 1 )
            {
                intersections[RayBoxIntersect.IN] = Point.interpolate(r2, r1, tnear);
            }
            if (tfar >= 0 && tfar <= 1 )
            {
                intersections[RayBoxIntersect.OUT] = Point.interpolate(r2, r1, tfar);
            }
            return intersections;
        }
        tnear = Math.min((box.x - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
        tfar = Math.max((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
        if (tnear > tfar )
        {
            intersections = [2, true];
            if (tfar >= 0 && tfar <= 1 )
            {
                intersections[RayBoxIntersect.IN] = Point.interpolate(r2, r1, tfar);
            }
            if (tnear >= 0 && tnear <= 1 )
            {
                intersections[RayBoxIntersect.OUT] = Point.interpolate(r2, r1, tnear);
            }
            return intersections;
        }
        tnear = Math.min((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
        tfar = Math.max((box.x - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
        if (tnear > tfar )
        {
            intersections = [2, true];
            if (tfar >= 0 && tfar <= 1 )
            {
                intersections[RayBoxIntersect.IN] = Point.interpolate(r2, r1, tfar);
            }
            if (tnear >= 0 && tnear <= 1 )
            {
                intersections[RayBoxIntersect.OUT] = Point.interpolate(r2, r1, tnear);
            }
            return intersections;
        }
        tnear = Math.max((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
        tfar = Math.min((box.x - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
        if (tnear < tfar )
        {
            intersections = [2, true];
            if (tnear >= 0 && tnear <= 1 )
            {
                intersections[RayBoxIntersect.IN] = Point.interpolate(r2, r1, tnear);
            }
            if (tfar >= 0 && tfar <= 1 )
            {
                intersections[RayBoxIntersect.OUT] = Point.interpolate(r2, r1, tfar);
            }
            return intersections;
        }
        return null;
    }

    public static rayBoxIntersectFast (r1: Point, r2: Point, box: Rectangle, output: Point): boolean
    {
        if (box.x + box.width < Math.min(r1.x, r2.x) || box.x > Math.max(r1.x, r2.x) )
        {
            return false;
        }
        if (box.y + box.height < Math.min(r1.y, r2.y) || box.y > Math.max(r1.y, r2.y) )
        {
            return false;
        }
        let tnear: number;
        let tfar: number;
        let interpolate = -1;
        while (1)
        {
            tnear = Math.max((box.x - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
            tfar = Math.min((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
            if (tnear < tfar )
            {
                if (tnear >= 0 && tnear <= 1 )
                {
                    interpolate = tnear;
                }
                break;
            }
            tnear = Math.min((box.x - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
            tfar = Math.max((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
            if (tnear > tfar )
            {
                if (tfar >= 0 && tfar <= 1 )
                {
                    interpolate = tfar;
                }
                break;
            }
            tnear = Math.min((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
            tfar = Math.max((box.x - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
            if (tnear > tfar )
            {
                if (tfar >= 0 && tfar <= 1 )
                {
                    interpolate = tfar;
                }
                break;
            }
            tnear = Math.max((box.x + box.width - r1.x) / (r2.x - r1.x), (box.y - r1.y) / (r2.y - r1.y));
            tfar = Math.min((box.x - r1.x) / (r2.x - r1.x), (box.y + box.height - r1.y) / (r2.y - r1.y));
            if (tnear < tfar )
            {
                if (tnear >= 0 && tnear <= 1 )
                {
                    interpolate = tnear;
                }
                break;
            }
            break;
        }
        if (interpolate != -1 )
        {
            output.x = r1.x + (r2.x - r1.x) * interpolate;
            output.y = r1.y + (r2.y - r1.y) * interpolate;
            return true;
        }
        return false;
    }
}