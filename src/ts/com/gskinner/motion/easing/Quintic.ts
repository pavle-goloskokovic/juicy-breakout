export class Quintic {
    static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio * ratio * ratio * ratio * ratio;
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return 1 + (ratio -= 1) * ratio * ratio * ratio * ratio;
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio < 0.5 ? 16 * ratio * ratio * ratio * ratio * ratio : 16 * (ratio -= 1) * ratio * ratio * ratio * ratio + 1;
    }
}
