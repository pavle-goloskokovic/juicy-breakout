export class MathUtil {
    static wrap (value: number, max = 1, min = 0): number
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

    static clamp (value: number, max = 1, min = 0): number
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

    static parseNumber (value: string, nanAsZero = false): number
    {
        value = value.replace(',', '.');
        let val: number = parseFloat(value);
        if (nanAsZero && isNaN(val) )
        {
            val = 0;
        }
        return val;
    }

    static parseBoolean (value: string): boolean
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
