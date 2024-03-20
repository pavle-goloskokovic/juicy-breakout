import { Component } from './Component';
import { Panel } from './Panel';
import { VScrollBar } from './VScrollBar';
import { ListItem } from './ListItem';
import type { DisplayObjectContainer } from '../../../flash/display/DisplayObjectContainer';
import { Sprite } from '../../../flash/display/Sprite';
import { Event } from '../../../flash/events/Event';
import { MouseEvent } from '../../../flash/events/MouseEvent';
[Event(name = 'select', type = 'flash.events.Event')];
export class List extends Component {
    protected _items: any[];
    protected _itemHolder: Sprite;
    protected _panel: Panel;
    protected _listItemHeight = 20;
    protected _listItemClass: Class = ListItem;
    protected _scrollbar: VScrollBar;
    protected _selectedIndex = -1;
    protected _defaultColor: number = Style.LIST_DEFAULT;
    protected _alternateColor: number = Style.LIST_ALTERNATE;
    protected _selectedColor: number = Style.LIST_SELECTED;
    protected _rolloverColor: number = Style.LIST_ROLLOVER;
    protected _alternateRows = false;
    constructor (parent: DisplayObjectContainer = null, xpos = 0, ypos = 0, items: any[] = null)
    {
        if (items != null)
        {
            this._items = items;
        }
        else
        {
            this._items = [];
        }
        super(parent, xpos, ypos);
    }

    protected init (): void
    {
        super.init();
        this.setSize(100, 100);
        this.addEventListener(MouseEvent.MOUSE_WHEEL, this.onMouseWheel);
        this.addEventListener(Event.RESIZE, this.onResize);
        this.makeListItems();
        this.fillItems();
    }

    protected addChildren (): void
    {
        super.addChildren();
        this._panel = new Panel(this, 0, 0);
        this._panel.color = this._defaultColor;
        this._itemHolder = new Sprite();
        this._panel.content.addChild(this._itemHolder);
        this._scrollbar = new VScrollBar(this, 0, 0, this.onScroll);
        this._scrollbar.setSliderParams(0, 0, 0);
    }

    protected makeListItems (): void
    {
        let item: ListItem;
        while (this._itemHolder.numChildren > 0)
        {
            item = ListItem(this._itemHolder.getChildAt(0));
            item.removeEventListener(MouseEvent.CLICK, this.onSelect);
            this._itemHolder.removeChildAt(0);
        }
        let numItems: number = Math.ceil(this._height / this._listItemHeight);
        numItems = Math.min(numItems, this._items.length);
        numItems = Math.max(numItems, 1);
        for (let i = 0; i < numItems; i++)
        {
            item = new this._listItemClass(this._itemHolder, 0, i * this._listItemHeight);
            item.setSize(this.width, this._listItemHeight);
            item.defaultColor = this._defaultColor;
            item.selectedColor = this._selectedColor;
            item.rolloverColor = this._rolloverColor;
            item.addEventListener(MouseEvent.CLICK, this.onSelect);
        }
    }

    protected fillItems (): void
    {
        const offset: number = this._scrollbar.value;
        let numItems: number = Math.ceil(this._height / this._listItemHeight);
        numItems = Math.min(numItems, this._items.length);
        for (let i = 0; i < numItems; i++)
        {
            const item: ListItem = this._itemHolder.getChildAt(i) as ListItem;
            if (offset + i < this._items.length)
            {
                item.data = this._items[offset + i];
            }
            else
            {
                item.data = '';
            }
            if (this._alternateRows)
            {
                item.defaultColor = (offset + i) % 2 == 0 ? this._defaultColor : this._alternateColor;
            }
            else
            {
                item.defaultColor = this._defaultColor;
            }
            if (offset + i == this._selectedIndex)
            {
                item.selected = true;
            }
            else
            {
                item.selected = false;
            }
        }
    }

    protected scrollToSelection (): void
    {
        const numItems: number = Math.ceil(this._height / this._listItemHeight);
        if (this._selectedIndex != -1)
        {
            if (this._scrollbar.value > this._selectedIndex)
            {

            }
            else if (this._scrollbar.value + numItems < this._selectedIndex)
            {
                this._scrollbar.value = this._selectedIndex - numItems + 1;
            }
        }
        else
        {
            this._scrollbar.value = 0;
        }
        this.fillItems();
    }

    draw (): void
    {
        super.draw();
        this._selectedIndex = Math.min(this._selectedIndex, this._items.length - 1);
        this._panel.setSize(this._width, this._height);
        this._panel.color = this._defaultColor;
        this._panel.draw();
        this._scrollbar.x = this._width - 10;
        const contentHeight: number = this._items.length * this._listItemHeight;
        this._scrollbar.setThumbPercent(this._height / contentHeight);
        const pageSize: number = Math.floor(this._height / this._listItemHeight);
        this._scrollbar.maximum = Math.max(0, this._items.length - pageSize);
        this._scrollbar.pageSize = pageSize;
        this._scrollbar.height = this._height;
        this._scrollbar.draw();
        this.scrollToSelection();
    }

    addItem (item: any): void
    {
        this._items.push(item);
        this.invalidate();
        this.makeListItems();
        this.fillItems();
    }

    addItemAt (item: any, index: number): void
    {
        index = Math.max(0, index);
        index = Math.min(this._items.length, index);
        this._items.splice(index, 0, item);
        this.invalidate();
        this.fillItems();
    }

    removeItem (item: any): void
    {
        const index: number = this._items.indexOf(item);
        this.removeItemAt(index);
    }

    removeItemAt (index: number): void
    {
        if (index < 0 || index >= this._items.length)
        {
            return;
        }
        this._items.splice(index, 1);
        this.invalidate();
        this.fillItems();
    }

    removeAll (): void
    {
        this._items.length = 0;
        this.invalidate();
        this.fillItems();
    }

    protected onSelect (event: Event): void
    {
        if (!(event.target instanceof ListItem))
        {
            return;
        }
        const offset: number = this._scrollbar.value;
        for (let i = 0; i < this._itemHolder.numChildren; i++)
        {
            if (this._itemHolder.getChildAt(i) == event.target)
            {
                this._selectedIndex = i + offset;
            }
            ListItem(this._itemHolder.getChildAt(i)).selected = false;
        }
        ListItem(event.target).selected = true;
        dispatchEvent(new Event(Event.SELECT));
    }

    protected onScroll (event: Event): void
    {
        this.fillItems();
    }

    protected onMouseWheel (event: MouseEvent): void
    {
        this._scrollbar.value -= event.delta;
        this.fillItems();
    }

    protected onResize (event: Event): void
    {
        this.makeListItems();
        this.fillItems();
    }

    set selectedIndex (value: number)
    {
        if (value >= 0 && value < this._items.length)
        {
            this._selectedIndex = value;
        }
        else
        {
            this._selectedIndex = -1;
        }
        this.invalidate();
        dispatchEvent(new Event(Event.SELECT));
    }

    get selectedIndex (): number
    {
        return this._selectedIndex;
    }

    set selectedItem (item: any)
    {
        const index: number = this._items.indexOf(item);
        this.selectedIndex = index;
        this.invalidate();
        dispatchEvent(new Event(Event.SELECT));
    }

    get selectedItem (): any
    {
        if (this._selectedIndex >= 0 && this._selectedIndex < this._items.length)
        {
            return this._items[this._selectedIndex];
        }
        return null;
    }

    set defaultColor (value: number)
    {
        this._defaultColor = value;
        this.invalidate();
    }

    get defaultColor (): number
    {
        return this._defaultColor;
    }

    set selectedColor (value: number)
    {
        this._selectedColor = value;
        this.invalidate();
    }

    get selectedColor (): number
    {
        return this._selectedColor;
    }

    set rolloverColor (value: number)
    {
        this._rolloverColor = value;
        this.invalidate();
    }

    get rolloverColor (): number
    {
        return this._rolloverColor;
    }

    set listItemHeight (value: number)
    {
        this._listItemHeight = value;
        this.makeListItems();
        this.invalidate();
    }

    get listItemHeight (): number
    {
        return this._listItemHeight;
    }

    set items (value: any[])
    {
        this._items = value;
        this.invalidate();
    }

    get items (): any[]
    {
        return this._items;
    }

    set listItemClass (value: Class)
    {
        this._listItemClass = value;
        this.makeListItems();
        this.invalidate();
    }

    get listItemClass (): Class
    {
        return this._listItemClass;
    }

    set alternateColor (value: number)
    {
        this._alternateColor = value;
        this.invalidate();
    }

    get alternateColor (): number
    {
        return this._alternateColor;
    }

    set alternateRows (value: boolean)
    {
        this._alternateRows = value;
        this.invalidate();
    }

    get alternateRows (): boolean
    {
        return this._alternateRows;
    }

    set autoHideScrollBar (value: boolean)
    {
        this._scrollbar.autoHide = value;
    }

    get autoHideScrollBar (): boolean
    {
        return this._scrollbar.autoHide;
    }
}
