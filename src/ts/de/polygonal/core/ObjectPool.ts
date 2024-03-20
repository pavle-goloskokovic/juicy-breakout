export class ObjectPool {
    private _obj: Class;
    private _initSize: number;
    private _currSize: number;
    private _usageCount: number;
    private _grow: boolean = true;
    private _head: ObjNode;
    private _tail: ObjNode;
    private _emptyNode: ObjNode;
    private _allocNode: ObjNode;
    public constructor(grow: boolean = false) {
        this._grow = grow;
    }
    public deconstruct(): void {
        let node: ObjNode = this._head;
        let t: ObjNode;
        while(node) {
            t = node.next;
            node.next = null;
            node.data = null;
            node = t;
        }
        this._head = (this._tail = (this._emptyNode = (this._allocNode = null)));
    }
    public get size(): number {
        return this._currSize;
    }
    public get usageCount(): number {
        return this._usageCount;
    }
    public get wasteCount(): number {
        return this._currSize - this._usageCount;
    }
    public get object(): any {
        if(this._usageCount == this._currSize ) {
            if(this._grow ) {
                this._currSize += this._initSize;
                let n: ObjNode = this._tail;
                let t: ObjNode = this._tail;
                let node: ObjNode;
                for(let i: number = 0; i < this._initSize; i++) {
                    node = new ObjNode();
                    node.data = new this._obj();
                    t.next = node;
                    t = node;
                }
                this._tail = t;
                this._tail.next = (this._emptyNode = this._head);
                this._allocNode = n.next;
                return this.object;
            } else {
                throw new Error("object pool exhausted")
            }
        } else {
            let o: any = this._allocNode.data;
            this._allocNode.data = null;
            this._allocNode = this._allocNode.next;
            this._usageCount++;
            return o;
        }
    }
    public set object(o: any) {
        if(this._usageCount > 0 ) {
            this._usageCount--;
            this._emptyNode.data = o;
            this._emptyNode = this._emptyNode.next;
        } 
    }
    public allocate(C: Class, size: number): void {
        this.deconstruct();
        this._obj = C;
        this._initSize = (this._currSize = size);
        this._head = (this._tail = new ObjNode());
        this._head.data = new this._obj();
        let n: ObjNode;
        for(let i: number = 1; i < this._initSize; i++) {
            n = new ObjNode();
            n.data = new this._obj();
            n.next = this._head;
            this._head = n;
        }
        this._emptyNode = (this._allocNode = this._head);
        this._tail.next = this._head;
    }
    public initialize(func: string, args: any[]): void {
        let n: ObjNode = this._head;
        while(n) {
            n.data[func].apply(n.data, args);
            if(n == this._tail ) {
                break;
            } 
            n = n.next;
        }
    }
    public purge(): void {
        let i: number;
        let node: ObjNode;
        if(this._usageCount == 0 ) {
            if(this._currSize == this._initSize ) {
                return
            } 
            if(this._currSize > this._initSize ) {
                i = 0;
                node = this._head;
                while(++i < this._initSize) {
                    node = node.next
                }
                this._tail = node;
                this._allocNode = (this._emptyNode = this._head);
                this._currSize = this._initSize;
                return;
            } 
        } else {
            let a: any[] = [];
            node = this._head;
            while(node) {
                if(!node.data ) {
                    a[int(i++)] = node
                } 
                if(node == this._tail ) {
                    break;
                } 
                node = node.next;
            }
            this._currSize = a.length;
            this._usageCount = this._currSize;
            this._head = (this._tail = a[0]);
            for(i = 1; i < this._currSize; i++) {
                node = a[i];
                node.next = this._head;
                this._head = node;
            }
            this._emptyNode = (this._allocNode = this._head);
            this._tail.next = this._head;
            if(this._usageCount < this._initSize ) {
                this._currSize = this._initSize;
                let n: ObjNode = this._tail;
                let t: ObjNode = this._tail;
                let k: number = this._initSize - this._usageCount;
                for(i = 0; i < k; i++) {
                    node = new ObjNode();
                    node.data = new this._obj();
                    t.next = node;
                    t = node;
                }
                this._tail = t;
                this._tail.next = (this._emptyNode = this._head);
                this._allocNode = n.next;
            } 
        }
    }
}
class ObjNode {
    public next: ObjNode;
    public data: any;
}