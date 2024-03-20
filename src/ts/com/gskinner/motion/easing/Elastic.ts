export class Elastic {
    protected static a: number = 1;
    protected static p: number = 0.3;
    protected static s: number = p / 4;
    public static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        if (ratio == 0 || ratio == 1 )
        {
            return ratio;
        }
        return -(Elastic.a * Math.pow(2, 10 * (ratio -= 1)) * Math.sin((ratio - Elastic.s) * (2 * Math.PI) / Elastic.p));
    }

    public static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        if (ratio == 0 || ratio == 1 )
        {
            return ratio;
        }
        return Elastic.a * Math.pow(2, -10 * ratio) * Math.sin((ratio - Elastic.s) * (2 * Math.PI) / Elastic.p) + 1;
    }

    public static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        if (ratio == 0 || ratio == 1 )
        {
            return ratio;
        }
        ratio = ratio * 2 - 1;
        if (ratio < 0 )
        {
            return -0.5 * (Elastic.a * Math.pow(2, 10 * ratio) * Math.sin((ratio - Elastic.s * 1.5) * (2 * Math.PI) / (Elastic.p * 1.5)));
        }
        return 0.5 * Elastic.a * Math.pow(2, -10 * ratio) * Math.sin((ratio - Elastic.s * 1.5) * (2 * Math.PI) / (Elastic.p * 1.5)) + 1;
    }
}