export class Quartic {
    static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio * ratio * ratio * ratio;
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return 1 - (ratio -= 1) * ratio * ratio * ratio;
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio < 0.5 ? 8 * ratio * ratio * ratio * ratio : -8 * (ratio -= 1) * ratio * ratio * ratio + 1;
    }
}
