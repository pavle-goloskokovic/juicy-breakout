export class Quadratic {
    public static easeIn (ratio: number, unused1: number = 0, unused2: number = 0, unused3: number = 0): number
    {
        return ratio * ratio;
    }

    public static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return -ratio * (ratio - 2);
    }

    public static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio < 0.5 ? 2 * ratio * ratio : -2 * ratio * (ratio - 2) - 1;
    }
}