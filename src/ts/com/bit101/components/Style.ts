export class Style {
    static TEXT_BACKGROUND = 0xFFFFFF;
    static BACKGROUND = 0xCCCCCC;
    static BUTTON_FACE = 0xFFFFFF;
    static BUTTON_DOWN = 0xEEEEEE;
    static INPUT_TEXT = 0x333333;
    static LABEL_TEXT = 0x666666;
    static DROPSHADOW = 0x000000;
    static PANEL = 0xF3F3F3;
    static PROGRESS_BAR = 0xFFFFFF;
    static LIST_DEFAULT = 0xFFFFFF;
    static LIST_ALTERNATE = 0xF3F3F3;
    static LIST_SELECTED = 0xCCCCCC;
    static LIST_ROLLOVER = 0XDDDDDD;
    static embedFonts = true;
    static fontName = 'PF Ronda Seven';
    static fontSize = 8;
    static DARK = 'dark';
    static LIGHT = 'light';
    static setStyle (style: string): void
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
