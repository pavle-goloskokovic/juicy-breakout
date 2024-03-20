import { Sprite } from '../../../flash/display/Sprite';
import { TextField } from '../../../flash/text/TextField';
import { TextFieldAutoSize } from '../../../flash/text/TextFieldAutoSize';
import { TextFormat } from '../../../flash/text/TextFormat';
export class TXT extends Sprite {
    private txt_text: TextField;
    constructor (color = 0xffffff, size = 12)
    {
        super();
        const textformat: TextFormat = new TextFormat('Arial', size);
        this.txt_text = new TextField();
        this.txt_text.textColor = color;
        this.txt_text.selectable = false;
        this.txt_text.setTextFormat(textformat);
        this.txt_text.defaultTextFormat = textformat;
        this.addChild(this.txt_text);
        this.mouseChildren = false;
        this.mouseEnabled = false;
        this.txt_text.mouseWheelEnabled = true;
        this.txt_text.height = 580;
        this.txt_text.width = 400;
    }

    setText (str: string): void
    {
        this.txt_text.text = str + '\n';
    }

    appendText (str: string): void
    {
        this.txt_text.appendText(str + '\n');
    }

    set selectable (value: boolean)
    {
        this.txt_text.selectable = value;
    }
}
