export class Cubic {
    public static easeIn(ratio: number, unused1: number, unused2: number, unused3: number): number {
        return ratio * ratio * ratio;
    }
    public static easeOut(ratio: number, unused1: number, unused2: number, unused3: number): number {
        return (ratio -= 1) * ratio * ratio + 1;
    }
    public static easeInOut(ratio: number, unused1: number, unused2: number, unused3: number): number {
        return ratio < 0.5 ? 4 * ratio * ratio * ratio : 4 * (ratio -= 1) * ratio * ratio + 1;
    }
}