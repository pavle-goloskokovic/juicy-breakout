import { Component } from './Component';
import { PushButton } from './PushButton';
import { List } from './List';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import type { Stage } from '../../../flash/display/Stage';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
import { Point } from '../../../flash/geom/Point';
import { Rectangle } from '../../../flash/geom/Rectangle';
[Event(name = 'select', type = 'flash.events.Event')];
export class ComboBox extends Component {
    static TOP = 'top';
    static BOTTOM = 'bottom';
    protected _defaultLabel = '';
    protected _dropDownButton: PushButton;
    protected _items: any[];
    protected _labelButton: PushButton;
    protected _list: List;
    protected _numVisibleItems = 6;
    protected _open = false;
    protected _openPosition: string = BOTTOM;
    protected _stage: Stage;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, defaultLabel = '', items: any[] = null)
    {
        this._defaultLabel = defaultLabel;
        this._items = items;
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage);
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 20);
        this.setLabelButtonLabel();
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._list = new List(null, 0, 0, this._items);
        this._list.autoHideScrollBar = true;
        this._list.addEventListener(Event.SELECT, this.onSelect);
        this._labelButton = new PushButton(this, 0, 0, '', this.onDropDown);
        this._dropDownButton = new PushButton(this, 0, 0, '+', this.onDropDown);
    }

    protected setLabelButtonLabel (): void
    {
        if (this.selectedItem == null )
        {
            this._labelButton.label = this._defaultLabel;
        }
        else if (this.selectedItem instanceof String )
        {
            this._labelButton.label = this.selectedItem as string;
        }
        else if (this.selectedItem.hasOwnProperty('label') && this.selectedItem.label instanceof String )
        {
            this._labelButton.label = this.selectedItem.label;
        }
        else
        {
            this._labelButton.label = this.selectedItem.toString();
        }
    }

    protected removeList (): void
    {
        if (this._stage.contains(this._list) )
        {
            this._stage.removeChild(this._list);
        }
        this._stage.removeEventListener(MouseEvent.CLICK, this.onStageClick);
        this._dropDownButton.label = '+';
    }

    draw (): void
    {
        super.draw();
        this._labelButton.setSize(this._width - this._height + 1, this._height);
        this._labelButton.draw();
        this._dropDownButton.setSize(this._height, this._height);
        this._dropDownButton.draw();
        this._dropDownButton.x = this._width - this.height;
        this._list.setSize(this._width, this._numVisibleItems * this._list.listItemHeight);
    }

    addItem (item: any): void
    {
        this._list.addItem(item);
    }

    addItemAt (item: any, index: number): void
    {
        this._list.addItemAt(item, index);
    }

    removeItem (item: any): void
    {
        this._list.removeItem(item);
    }

    removeItemAt (index: number): void
    {
        this._list.removeItemAt(index);
    }

    removeAll (): void
    {
        this._list.removeAll();
    }

    protected onDropDown (event: MouseEvent): void
    {
        this._open = !this._open;
        if (this._open )
        {
            let point: Point = new Point();
            if (this._openPosition == ComboBox.BOTTOM )
            {
                point.y = this._height;
            }
            else
            {
                point.y = -this._numVisibleItems * this._list.listItemHeight;
            }
            point = this.localToGlobal(point);
            this._list.move(point.x, point.y);
            this._stage.addChild(this._list);
            this._stage.addEventListener(MouseEvent.CLICK, this.onStageClick);
            this._dropDownButton.label = '-';
        }
        else
        {
            this.removeList();
        }
    }

    protected onStageClick (event: MouseEvent): void
    {
        if (event.target == this._dropDownButton || event.target == this._labelButton )
        {
            return;
        }
        if (new Rectangle(this._list.x, this._list.y, this._list.width, this._list.height).contains(event.stageX, event.stageY) )
        {
            return;
        }
        this._open = false;
        this.removeList();
    }

    protected onSelect (event: Event): void
    {
        this._open = false;
        this._dropDownButton.label = '+';
        if (this.stage != null && this.stage.contains(this._list) )
        {
            this.stage.removeChild(this._list);
        }
        this.setLabelButtonLabel();
        dispatchEvent(event);
    }

    protected onAddedToStage (event: Event): void
    {
        this._stage = this.stage;
    }

    protected onRemovedFromStage (event: Event): void
    {
        this.removeList();
    }

    set selectedIndex (value: number)
    {
        this._list.selectedIndex = value;
        this.setLabelButtonLabel();
    }

    get selectedIndex (): number
    {
        return this._list.selectedIndex;
    }

    set selectedItem (item: any)
    {
        this._list.selectedItem = item;
        this.setLabelButtonLabel();
    }

    get selectedItem (): any
    {
        return this._list.selectedItem;
    }

    set defaultColor (value: number)
    {
        this._list.defaultColor = value;
    }

    get defaultColor (): number
    {
        return this._list.defaultColor;
    }

    set selectedColor (value: number)
    {
        this._list.selectedColor = value;
    }

    get selectedColor (): number
    {
        return this._list.selectedColor;
    }

    set rolloverColor (value: number)
    {
        this._list.rolloverColor = value;
    }

    get rolloverColor (): number
    {
        return this._list.rolloverColor;
    }

    set listItemHeight (value: number)
    {
        this._list.listItemHeight = value;
        this.invalidate();
    }

    get listItemHeight (): number
    {
        return this._list.listItemHeight;
    }

    set openPosition (value: string)
    {
        this._openPosition = value;
    }

    get openPosition (): string
    {
        return this._openPosition;
    }

    set defaultLabel (value: string)
    {
        this._defaultLabel = value;
        this.setLabelButtonLabel();
    }

    get defaultLabel (): string
    {
        return this._defaultLabel;
    }

    set numVisibleItems (value: number)
    {
        this._numVisibleItems = value;
        this.invalidate();
    }

    get numVisibleItems (): number
    {
        return this._numVisibleItems;
    }

    set items (value: any[])
    {
        this._list.items = value;
    }

    get items (): any[]
    {
        return this._list.items;
    }

    set listItemClass (value: Class)
    {
        this._list.listItemClass = value;
    }

    get listItemClass (): Class
    {
        return this._list.listItemClass;
    }

    set alternateColor (value: number)
    {
        this._list.alternateColor = value;
    }

    get alternateColor (): number
    {
        return this._list.alternateColor;
    }

    set alternateRows (value: boolean)
    {
        this._list.alternateRows = value;
    }

    get alternateRows (): boolean
    {
        return this._list.alternateRows;
    }

    set autoHideScrollBar (value: boolean)
    {
        this._list.autoHideScrollBar = value;
        this.invalidate();
    }

    get autoHideScrollBar (): boolean
    {
        return this._list.autoHideScrollBar;
    }

    get isOpen (): boolean
    {
        return this._open;
    }
}
