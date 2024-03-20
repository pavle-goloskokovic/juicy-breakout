export class ColorMatrix extends Array {
    private static DELTA_INDEX: any[] = [0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24, 0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42, 0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68, 0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54, 1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25, 2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0, 7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8, 10.0];
    private static IDENTITY_MATRIX: any[] = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
    private static LENGTH: number = IDENTITY_MATRIX.length;
    constructor (matrix: any[] = null)
    {
        super();
        matrix = this.fixMatrix(matrix);
        this.copyMatrix(matrix.length == ColorMatrix.LENGTH ? matrix : ColorMatrix.IDENTITY_MATRIX);
    }

    reset (): void
    {
        for (let i = 0; i < ColorMatrix.LENGTH; i++)
        {
            this[i] = ColorMatrix.IDENTITY_MATRIX[i];
        }
    }

    adjustColor (brightness: number, contrast: number, saturation: number, hue: number): void
    {
        this.adjustHue(hue);
        this.adjustContrast(contrast);
        this.adjustBrightness(brightness);
        this.adjustSaturation(saturation);
    }

    adjustBrightness (value: number): void
    {
        value = this.cleanValue(value, 255);
        if (value == 0 || isNaN(value))
        {
            return;
        }
        this.multiplyMatrix([1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    adjustContrast (value: number): void
    {
        value = this.cleanValue(value, 100);
        if (value == 0 || isNaN(value))
        {
            return;
        }
        let x: number;
        if (value < 0)
        {
            x = 127 + value / 100 * 127;
        }
        else
        {
            x = value % 1;
            if (x == 0)
            {
                x = ColorMatrix.DELTA_INDEX[value];
            }
            else
            {
                x = ColorMatrix.DELTA_INDEX[value << 0] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x;
            }
            x = x * 127 + 127;
        }
        this.multiplyMatrix([x / 127, 0, 0, 0, 0.5 * (127 - x), 0, x / 127, 0, 0, 0.5 * (127 - x), 0, 0, x / 127, 0, 0.5 * (127 - x), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    adjustSaturation (value: number): void
    {
        value = this.cleanValue(value, 100);
        if (value == 0 || isNaN(value))
        {
            return;
        }
        const x: number = 1 + (value > 0 ? 3 * value / 100 : value / 100);
        const lumR = 0.3086;
        const lumG = 0.6094;
        const lumB = 0.0820;
        this.multiplyMatrix([lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    adjustHue (value: number): void
    {
        value = this.cleanValue(value, 180) / 180 * Math.PI;
        if (value == 0 || isNaN(value))
        {
            return;
        }
        const cosVal: number = Math.cos(value);
        const sinVal: number = Math.sin(value);
        const lumR = 0.213;
        const lumG = 0.715;
        const lumB = 0.072;
        this.multiplyMatrix([lumR + cosVal * (1 - lumR) + sinVal * -lumR, lumG + cosVal * -lumG + sinVal * -lumG, lumB + cosVal * -lumB + sinVal * (1 - lumB), 0, 0, lumR + cosVal * -lumR + sinVal * 0.143, lumG + cosVal * (1 - lumG) + sinVal * 0.140, lumB + cosVal * -lumB + sinVal * -0.283, 0, 0, lumR + cosVal * -lumR + sinVal * -(1 - lumR), lumG + cosVal * -lumG + sinVal * lumG, lumB + cosVal * (1 - lumB) + sinVal * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    concat (matrix: any[]): void
    {
        matrix = this.fixMatrix(matrix);
        if (matrix.length != ColorMatrix.LENGTH)
        {
            return;
        }
        this.multiplyMatrix(matrix);
    }

    clone (): ColorMatrix
    {
        return new ColorMatrix(this);
    }

    toString (): string
    {
        return 'ColorMatrix [ ' + this.join(' , ') + ' ]';
    }

    toArray (): any[]
    {
        return slice(0, 20);
    }

    protected copyMatrix (matrix: any[]): void
    {
        const l: number = ColorMatrix.LENGTH;
        for (let i = 0; i < l; i++)
        {
            this[i] = matrix[i];
        }
    }

    protected multiplyMatrix (matrix: any[]): void
    {
        const col: any[] = [];
        for (let i = 0; i < 5; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                col[j] = this[j + i * 5];
            }
            for (j = 0; j < 5; j++)
            {
                let val = 0;
                for (let k = 0; k < 5; k++)
                {
                    val += matrix[j + k * 5] * col[k];
                }
                this[j + i * 5] = val;
            }
        }
    }

    protected cleanValue (value: number, limit: number): number
    {
        return Math.min(limit, Math.max(-limit, value));
    }

    protected fixMatrix (matrix: any[] = null): any[]
    {
        if (matrix == null)
        {
            return ColorMatrix.IDENTITY_MATRIX;
        }
        if (matrix instanceof ColorMatrix)
        {
            matrix = matrix.slice(0);
        }
        if (matrix.length < ColorMatrix.LENGTH)
        {
            matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
        }
        else if (matrix.length > ColorMatrix.LENGTH)
        {
            matrix = matrix.slice(0, ColorMatrix.LENGTH);
        }
        return matrix;
    }
}
