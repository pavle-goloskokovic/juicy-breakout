
class ObjNode<T extends new(...args: any[]) => any> {
    next: ObjNode<T>;
    data: InstanceType<T>;
}

export class ObjectPool<T extends new(...args: any[]) => any> {

    private _obj: T;
    private _args: any[];
    private _initSize = 0;
    private _currSize = 0;
    private _usageCount = 0;
    private _head: ObjNode<T>;
    private _tail: ObjNode<T>;
    private _emptyNode: ObjNode<T>;
    private _allocNode: ObjNode<T>;

    constructor (
        private _grow = false
    ) {}

    deconstruct (): void
    {
        let node = this._head;
        let t: ObjNode<T>;

        while (node)
        {
            t = node.next;
            node.next = null;
            node.data = null;
            node = t;
        }

        this._head =
            this._tail =
                this._emptyNode =
                    this._allocNode = null;
    }

    get size (): number
    {
        return this._currSize;
    }

    /*get usageCount (): number
    {
        return this._usageCount;
    }

    get wasteCount (): number
    {
        return this._currSize - this._usageCount;
    }*/

    get object (): InstanceType<T>
    {
        if (this._usageCount === this._currSize)
        {
            if (this._grow)
            {
                this._currSize += this._initSize;
                const n = this._tail;
                let t = this._tail;
                let node: ObjNode<T>;
                for (let i = 0; i < this._initSize; i++)
                {
                    node = new ObjNode();
                    node.data = new this._obj(...this._args);
                    t.next = node;
                    t = node;
                }
                this._tail = t;
                this._tail.next = (this._emptyNode = this._head);
                this._allocNode = n.next;
                return this.object;
            }
            else
            {
                throw new Error('object pool exhausted');
            }
        }
        else
        {
            const o = this._allocNode.data;
            this._allocNode.data = null;
            this._allocNode = this._allocNode.next;
            this._usageCount++;
            return o;
        }
    }

    set object (o: InstanceType<T>)
    {
        if (this._usageCount > 0)
        {
            this._usageCount--;
            this._emptyNode.data = o;
            this._emptyNode = this._emptyNode.next;
        }
    }

    allocate (C: T, size: number, args: any[] = []): void
    {
        this.deconstruct();
        this._obj = C;
        this._args = args;
        this._initSize =
            this._currSize = size;
        this._head =
            this._tail = new ObjNode();
        this._head.data = new this._obj(...args);
        let n: ObjNode<T>;
        for (let i = 1; i < this._initSize; i++)
        {
            n = new ObjNode();
            n.data = new this._obj(...args);
            n.next = this._head;
            this._head = n;
        }
        this._emptyNode = (this._allocNode = this._head);
        this._tail.next = this._head;
    }

    initialize (func: keyof InstanceType<T>, args: any[] = []): void
    {
        let n = this._head;
        while (n)
        {
            n.data[func](...args);
            if (n == this._tail)
            {
                break;
            }
            n = n.next;
        }
    }

    /*purge (): void
    {
        let i = 0;
        let node: ObjNode<T>;
        if (this._usageCount == 0)
        {
            if (this._currSize == this._initSize)
            {
                return;
            }
            if (this._currSize > this._initSize)
            {
                i = 0;
                node = this._head;
                while (++i < this._initSize)
                {
                    node = node.next;
                }
                this._tail = node;
                this._allocNode = (this._emptyNode = this._head);
                this._currSize = this._initSize;
                return;
            }
        }
        else
        {
            const a: ObjNode<T>[] = [];
            node = this._head;
            while (node)
            {
                if (!node.data)
                {
                    a[Math.trunc(i++)] = node;
                }
                if (node == this._tail)
                {
                    break;
                }
                node = node.next;
            }
            this._currSize = a.length;
            this._usageCount = this._currSize;
            this._head = (this._tail = a[0]);
            for (i = 1; i < this._currSize; i++)
            {
                node = a[i];
                node.next = this._head;
                this._head = node;
            }
            this._emptyNode = (this._allocNode = this._head);
            this._tail.next = this._head;
            if (this._usageCount < this._initSize)
            {
                this._currSize = this._initSize;
                const n = this._tail;
                let t = this._tail;
                const k: number = this._initSize - this._usageCount;
                for (i = 0; i < k; i++)
                {
                    node = new ObjNode();
                    node.data = new this._obj(...this._args);
                    t.next = node;
                    t = node;
                }
                this._tail = t;
                this._tail.next = (this._emptyNode = this._head);
                this._allocNode = n.next;
            }
        }
    }*/
}
