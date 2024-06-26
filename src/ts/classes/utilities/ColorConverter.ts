export class ColorConverter {

    static UINTtoRGB (color: number): number[]
    {
        const r = color >> 16 & 0xFF;
        const g = color >> 8 & 0xFF;
        const b = color & 0xFF;
        return [r, g, b];
    }

    static UINTtoHSB (color: number): number[]
    {
        const rgb = ColorConverter.UINTtoRGB(color);
        return ColorConverter.RGBtoHSB(rgb[0], rgb[1], rgb[2]);
    }

    static HSBtoRGB (hue: number, saturation: number, brightness: number): number[]
    {
        return ColorConverter.UINTtoRGB(ColorConverter.HSBtoUINT(hue, saturation, brightness));
    }

    static RGBtoUINT (r: number, g: number, b: number): number
    {
        return r << 16 | g << 8 | b << 0;
    }

    static RGBtoHSB (r: number, g: number, b: number): number[]
    {
        const cmax = Math.max(r, g, b);
        const cmin = Math.min(r, g, b);
        const brightness = cmax / 255.0;
        let hue = 0;
        const saturation = cmax != 0 ? (cmax - cmin) / cmax : 0;
        if (saturation != 0)
        {
            const redc = (cmax - r) / (cmax - cmin);
            const greenc = (cmax - g) / (cmax - cmin);
            const bluec = (cmax - b) / (cmax - cmin);
            if (r == cmax)
            {
                hue = bluec - greenc;
            }
            else if (g == cmax)
            {
                hue = 2.0 + redc - bluec;
            }
            else
            {
                hue = 4.0 + greenc - redc;
            }
            hue = hue / 6.0;
            if (hue < 0)
            {
                hue = hue + 1.0;
            }
        }
        return [hue, saturation, brightness];
    }

    static HSBtoUINT (hue: number, saturation: number, brightness: number): number
    {
        let r = 0;
        let g = 0;
        let b = 0;
        if (saturation == 0)
        {
            r = (g = (b = brightness * 255.0 + 0.5));
        }
        else
        {
            const h = (hue - Math.trunc(hue)) * 6.0;
            const f = h - Math.trunc(h);
            const p = brightness * (1.0 - saturation);
            const q = brightness * (1.0 - saturation * f);
            const t = brightness * (1.0 - saturation * (1.0 - f));
            switch (Math.trunc(h))
            {
                case 0:
                    {
                        r = brightness * 255.0 + 0.5;
                        g = t * 255.0 + 0.5;
                        b = p * 255.0 + 0.5;
                    }
                    break;
                case 1:
                    {
                        r = q * 255.0 + 0.5;
                        g = brightness * 255.0 + 0.5;
                        b = p * 255.0 + 0.5;
                    }
                    break;
                case 2:
                    {
                        r = p * 255.0 + 0.5;
                        g = brightness * 255.0 + 0.5;
                        b = t * 255.0 + 0.5;
                    }
                    break;
                case 3:
                    {
                        r = p * 255.0 + 0.5;
                        g = q * 255.0 + 0.5;
                        b = brightness * 255.0 + 0.5;
                    }
                    break;
                case 4:
                    {
                        r = t * 255.0 + 0.5;
                        g = p * 255.0 + 0.5;
                        b = brightness * 255.0 + 0.5;
                    }
                    break;
                case 5:
                    {
                        r = brightness * 255.0 + 0.5;
                        g = p * 255.0 + 0.5;
                        b = q * 255.0 + 0.5;
                    }
                    break;
            }
        }
        return r << 16 | g << 8 | b << 0;
    }
}
