export class Exponential {
    static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio == 0 ? 0 : Math.pow(2, 10 * (ratio - 1));
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio == 1 ? 1 : 1 - Math.pow(2, -10 * ratio);
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        if (ratio == 0 || ratio == 1)
        {
            return ratio;
        }
        if (0 > (ratio = ratio * 2 - 1))
        {
            return 0.5 * Math.pow(2, 10 * ratio);
        }
        return 1 - 0.5 * Math.pow(2, -10 * ratio);
    }
}
