export class Style {
    public static TEXT_BACKGROUND = 0xFFFFFF;
    public static BACKGROUND = 0xCCCCCC;
    public static BUTTON_FACE = 0xFFFFFF;
    public static BUTTON_DOWN = 0xEEEEEE;
    public static INPUT_TEXT = 0x333333;
    public static LABEL_TEXT = 0x666666;
    public static DROPSHADOW = 0x000000;
    public static PANEL = 0xF3F3F3;
    public static PROGRESS_BAR = 0xFFFFFF;
    public static LIST_DEFAULT = 0xFFFFFF;
    public static LIST_ALTERNATE = 0xF3F3F3;
    public static LIST_SELECTED = 0xCCCCCC;
    public static LIST_ROLLOVER = 0XDDDDDD;
    public static embedFonts = true;
    public static fontName = 'PF Ronda Seven';
    public static fontSize = 8;
    public static DARK = 'dark';
    public static LIGHT = 'light';
    public static setStyle (style: string): void
    {
        switch (style)
        {
            case Style.DARK:
                {
                    Style.BACKGROUND = 0x444444;
                    Style.BUTTON_FACE = 0x666666;
                    Style.BUTTON_DOWN = 0x222222;
                    Style.INPUT_TEXT = 0xBBBBBB;
                    Style.LABEL_TEXT = 0xCCCCCC;
                    Style.PANEL = 0x666666;
                    Style.PROGRESS_BAR = 0x666666;
                    Style.TEXT_BACKGROUND = 0x555555;
                    Style.LIST_DEFAULT = 0x444444;
                    Style.LIST_ALTERNATE = 0x393939;
                    Style.LIST_SELECTED = 0x666666;
                    Style.LIST_ROLLOVER = 0x777777;
                }
                break;
            case Style.LIGHT:
                break;
            default:
                {
                    Style.BACKGROUND = 0xCCCCCC;
                    Style.BUTTON_FACE = 0xFFFFFF;
                    Style.BUTTON_DOWN = 0xEEEEEE;
                    Style.INPUT_TEXT = 0x333333;
                    Style.LABEL_TEXT = 0x666666;
                    Style.PANEL = 0xF3F3F3;
                    Style.PROGRESS_BAR = 0xFFFFFF;
                    Style.TEXT_BACKGROUND = 0xFFFFFF;
                    Style.LIST_DEFAULT = 0xFFFFFF;
                    Style.LIST_ALTERNATE = 0xF3F3F3;
                    Style.LIST_SELECTED = 0xCCCCCC;
                    Style.LIST_ROLLOVER = 0xDDDDDD;
                }
                break;
        }
    }
}