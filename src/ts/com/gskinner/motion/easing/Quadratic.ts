export class Quadratic {
    static easeIn (ratio: number, unused1 = 0, unused2 = 0, unused3 = 0): number
    {
        return ratio * ratio;
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return -ratio * (ratio - 2);
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio < 0.5 ? 2 * ratio * ratio : -2 * ratio * (ratio - 2) - 1;
    }
}
