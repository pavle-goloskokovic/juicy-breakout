export class MathUtil {
    public static wrap (value: number, max: number = 1, min: number = 0): number
    {
        while (value >= max)
        {
            value -= max - min;
        }
        while (value < min)
        {
            value += max - min;
        }
        return value;
    }

    public static clamp (value: number, max: number = 1, min: number = 0): number
    {
        if (value > max )
        {
            return max;
        }
        if (value < min )
        {
            return min;
        }
        return value;
    }

    public static parseNumber (value: string, nanAsZero: boolean = false): number
    {
        value = value.replace(',', '.');
        let val: number = parseFloat(value);
        if (nanAsZero && isNaN(val) )
        {
            val = 0;
        }
        return val;
    }

    public static parseBoolean (value: string): boolean
    {
        if (value == 'true' )
        {
            return true;
        }
        if (value == '1' )
        {
            return true;
        }
        if (value == 'yes' )
        {
            return true;
        }
        return false;
    }
}