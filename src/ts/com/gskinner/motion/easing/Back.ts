export class Back {
    protected static s: number = 1.70158;
    public static easeIn (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return ratio * ratio * ((Back.s + 1) * ratio - Back.s);
    }

    public static easeOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return (ratio -= 1) * ratio * ((Back.s + 1) * ratio + Back.s) + 1;
    }

    public static easeInOut (ratio: number, unused1: number, unused2: number, unused3: number): number
    {
        return (ratio *= 2) < 1 ? 0.5 * (ratio * ratio * ((Back.s * 1.525 + 1) * ratio - Back.s * 1.525)) : 0.5 * ((ratio -= 2) * ratio * ((Back.s * 1.525 + 1) * ratio + Back.s * 1.525) + 2);
    }
}