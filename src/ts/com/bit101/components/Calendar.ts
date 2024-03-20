import { Panel } from './Panel';
import { Label } from './Label';
import { PushButton } from './PushButton';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Shape } from '../../../flash/display/Shape';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
[Event(name = 'select', type = 'flash.events.Event')];
export class Calendar extends Panel {
    protected _dateLabel: Label;
    protected _day: number;
    protected _dayButtons: any[] = [];
    protected _month: number;
    protected _monthNames: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    protected _selection: Shape;
    protected _year: number;
    public constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0)
    {
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(140, 140);
        const today: Date = new Date();
        this.setDate(today);
    }

    protected addChildren (): void
    {
        super.addChildren();
        for (let i = 0; i < 6; i++)
        {
            for (let j = 0; j < 7; j++)
            {
                const btn: PushButton = new PushButton(this.content, j * 20, 20 + i * 20);
                btn.setSize(19, 19);
                btn.addEventListener(MouseEvent.CLICK, this.onDayClick);
                this._dayButtons.push(btn);
            }
        }
        this._dateLabel = new Label(this.content, 25, 0);
        this._dateLabel.autoSize = true;
        const prevYearBtn: PushButton = new PushButton(this.content, 2, 2, '«', this.onPrevYear);
        prevYearBtn.setSize(14, 14);
        const prevMonthBtn: PushButton = new PushButton(this.content, 17, 2, '<', this.onPrevMonth);
        prevMonthBtn.setSize(14, 14);
        const nextMonthBtn: PushButton = new PushButton(this.content, 108, 2, '>', this.onNextMonth);
        nextMonthBtn.setSize(14, 14);
        const nextYearBtn: PushButton = new PushButton(this.content, 124, 2, '»', this.onNextYear);
        nextYearBtn.setSize(14, 14);
        this._selection = new Shape();
        this._selection.graphics.beginFill(0, 0.15);
        this._selection.graphics.drawRect(1, 1, 18, 18);
        this.content.addChild(this._selection);
    }

    protected getEndDay (month: number, year: number): number
    {
        switch (month)
        {
            case 0:
                break;
            case 2:
                break;
            case 4:
                break;
            case 6:
                break;
            case 7:
                break;
            case 9:
                break;
            case 11:
                {
                    return 31;
                }
                break;
            case 1:
                {
                    if (year % 400 == 0 || year % 100 != 0 && year % 4 == 0 )
                    {
                        return 29;
                    }
                    return 28;
                }
                break;
            default:
                break;
        }
        return 30;
    }

    public setDate (date: Date): void
    {
        this._year = date.fullYear;
        this._month = date.month;
        this._day = date.date;
        const startDay: number = new Date(this._year, this._month, 1).day;
        const endDay: number = this.getEndDay(this._month, this._year);
        for (let i = 0; i < 42; i++)
        {
            this._dayButtons[i].visible = false;
        }
        for (i = 0; i < endDay; i++)
        {
            const btn: PushButton = this._dayButtons[i + startDay];
            btn.visible = true;
            btn.label = (i + 1).toString();
            btn.tag = i + 1;
            if (i + 1 == this._day )
            {
                this._selection.x = btn.x;
                this._selection.y = btn.y;
            }
        }
        this._dateLabel.text = this._monthNames[this._month] + '  ' + this._year;
        this._dateLabel.draw();
        this._dateLabel.x = (this.width - this._dateLabel.width) / 2;
    }

    public setYearMonthDay (year: number, month: number, day: number): void
    {
        this.setDate(new Date(year, month, day));
    }

    protected onNextMonth (event: MouseEvent): void
    {
        this._month++;
        if (this._month > 11 )
        {
            this._month = 0;
            this._year++;
        }
        this._day = Math.min(this._day, this.getEndDay(this._month, this._year));
        this.setYearMonthDay(this._year, this._month, this._day);
    }

    protected onPrevMonth (event: MouseEvent): void
    {
        this._month--;
        if (this._month < 0 )
        {
            this._month = 11;
            this._year--;
        }
        this._day = Math.min(this._day, this.getEndDay(this._month, this._year));
        this.setYearMonthDay(this._year, this._month, this._day);
    }

    protected onNextYear (event: MouseEvent): void
    {
        this._year++;
        this._day = Math.min(this._day, this.getEndDay(this._month, this._year));
        this.setYearMonthDay(this._year, this._month, this._day);
    }

    protected onPrevYear (event: MouseEvent): void
    {
        this._year--;
        this._day = Math.min(this._day, this.getEndDay(this._month, this._year));
        this.setYearMonthDay(this._year, this._month, this._day);
    }

    protected onDayClick (event: MouseEvent): void
    {
        this._day = event.target.tag;
        this.setYearMonthDay(this._year, this._month, this._day);
        dispatchEvent(new Event(Event.SELECT));
    }

    public get selectedDate (): Date
    {
        return new Date(this._year, this._month, this._day);
    }

    public get month (): number
    {
        return this._month;
    }

    public get year (): number
    {
        return this._year;
    }

    public get day (): number
    {
        return this._day;
    }
}