export class Bounce {
    public static easeIn(ratio: number, unused1: number, unused2: number, unused3: number): number {
        return 1 - Bounce.easeOut(1 - ratio, 0, 0, 0);
    }
    public static easeOut(ratio: number, unused1: number, unused2: number, unused3: number): number {
        if(ratio < 1 / 2.75 ) {
            return 7.5625 * ratio * ratio;
        } else if(ratio < 2 / 2.75 ) {
            return 7.5625 * (ratio -= 1.5 / 2.75) * ratio + 0.75;
        } else if(ratio < 2.5 / 2.75 ) {
            return 7.5625 * (ratio -= 2.25 / 2.75) * ratio + 0.9375;
        } else {
            return 7.5625 * (ratio -= 2.625 / 2.75) * ratio + 0.984375;
        }
    }
    public static easeInOut(ratio: number, unused1: number, unused2: number, unused3: number): number {
        return (ratio *= 2) < 1 ? 0.5 * Bounce.easeIn(ratio, 0, 0, 0) : 0.5 * Bounce.easeOut(ratio - 1, 0, 0, 0) + 0.5;
    }
}