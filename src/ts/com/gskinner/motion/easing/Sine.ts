export class Sine {
    static easeIn (ratio: number, unused1 = 0, unused2 = 0, unused3 = 0): number
    {
        return 1 - Math.cos(ratio * (Math.PI / 2));
    }

    static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return Math.sin(ratio * (Math.PI / 2));
    }

    static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return -0.5 * (Math.cos(ratio * Math.PI) - 1);
    }
}
