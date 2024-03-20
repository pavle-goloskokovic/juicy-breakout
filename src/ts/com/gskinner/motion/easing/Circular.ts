export class Circular {
    static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return -(Math.sqrt(1 - ratio * ratio) - 1);
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return Math.sqrt(1 - (ratio - 1) * (ratio - 1));
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return (ratio *= 2) < 1 ? -0.5 * (Math.sqrt(1 - ratio * ratio) - 1) : 0.5 * (Math.sqrt(1 - (ratio -= 2) * ratio) + 1);
    }
}
