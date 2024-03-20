export class Sine {
    public static easeIn (ratio: number, unused1: number = 0, unused2: number = 0, unused3: number = 0): number
    {
        return 1 - Math.cos(ratio * (Math.PI / 2));
    }

    public static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return Math.sin(ratio * (Math.PI / 2));
    }

    public static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return -0.5 * (Math.cos(ratio * Math.PI) - 1);
    }
}