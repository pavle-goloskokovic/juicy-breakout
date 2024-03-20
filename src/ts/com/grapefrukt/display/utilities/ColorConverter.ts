export class ColorConverter {
    public static UINTtoRGB(color: number): any[] {
        let r: number = color >> 16 & 0xFF;
        let g: number = color >> 8 & 0xFF;
        let b: number = color & 0xFF;
        return [r, g, b];
    }
    public static UINTtoHSB(color: number): any[] {
        let rgb: any[] = ColorConverter.UINTtoRGB(color);
        return ColorConverter.RGBtoHSB(rgb[0], rgb[1], rgb[2]);
    }
    public static HSBtoRGB(hue: number, saturation: number, brightness: number): any[] {
        return ColorConverter.UINTtoRGB(ColorConverter.HSBtoUINT(hue, saturation, brightness));
    }
    public static RGBtoUINT(r: number, g: number, b: number): number {
        return r << 16 | g << 8 | b << 0;
    }
    public static RGBtoHSB(r: number, g: number, b: number): any[] {
        let cmax: number = Math.max(r, g, b);
        let cmin: number = Math.min(r, g, b);
        let brightness: number = cmax / 255.0;
        let hue: number = 0;
        let saturation: number = cmax != 0 ? (cmax - cmin) / cmax : 0;
        if(saturation != 0 ) {
            let redc: number = (cmax - r) / (cmax - cmin);
            let greenc: number = (cmax - g) / (cmax - cmin);
            let bluec: number = (cmax - b) / (cmax - cmin);
            if(r == cmax ) {
                hue = bluec - greenc;
            } else if(g == cmax ) {
                hue = 2.0 + redc - bluec;
            } else {
                hue = 4.0 + greenc - redc;
            }
            hue = hue / 6.0;
            if(hue < 0 ) {
                hue = hue + 1.0;
            } 
        } 
        return [hue, saturation, brightness];
    }
    public static HSBtoUINT(hue: number, saturation: number, brightness: number): number {
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        if(saturation == 0 ) {
            r = (g = (b = brightness * 255.0 + 0.5));
        } else {
            let h: number = (hue - int(hue)) * 6.0;
            let f: number = h - int(h);
            let p: number = brightness * (1.0 - saturation);
            let q: number = brightness * (1.0 - saturation * f);
            let t: number = brightness * (1.0 - saturation * (1.0 - f));
            switch(int(h)) {
                case 0:
                {
                    r = brightness * 255.0 + 0.5
                    g = t * 255.0 + 0.5
                    b = p * 255.0 + 0.5
                }
                break;
                case 1:
                {
                    r = q * 255.0 + 0.5
                    g = brightness * 255.0 + 0.5
                    b = p * 255.0 + 0.5
                }
                break;
                case 2:
                {
                    r = p * 255.0 + 0.5
                    g = brightness * 255.0 + 0.5
                    b = t * 255.0 + 0.5
                }
                break;
                case 3:
                {
                    r = p * 255.0 + 0.5
                    g = q * 255.0 + 0.5
                    b = brightness * 255.0 + 0.5
                }
                break;
                case 4:
                {
                    r = t * 255.0 + 0.5
                    g = p * 255.0 + 0.5
                    b = brightness * 255.0 + 0.5
                }
                break;
                case 5:
                {
                    r = brightness * 255.0 + 0.5
                    g = p * 255.0 + 0.5
                    b = q * 255.0 + 0.5
                }
                break;
            }
        }
        return r << 16 | g << 8 | b << 0;
    }
}