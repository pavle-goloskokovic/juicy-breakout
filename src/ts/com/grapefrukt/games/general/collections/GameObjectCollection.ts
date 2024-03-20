import { GameObjectEvent } from '../events/GameObjectEvent';
import { GameObject } from '../gameobjects/GameObject';
import { Sprite } from '../../../../../flash/display/Sprite';
import { Point } from '../../../../../flash/geom/Point';
import { grapelib } from '../namespaces/grapelib';
export class GameObjectCollection extends Sprite {
    protected _collection: Array<GameObject>;
    constructor ()
    {
        super();
        this._collection = [];
        this.addEventListener(GameObjectEvent.REMOVE, this.handleRemove, true);
    }

    protected handleRemove (e: GameObjectEvent): void
    {
        this.remove(GameObject(e.target), false);
    }

    getClosest (x: number, y: number, maxDistance: number = Number.MAX_VALUE, classFilter: Class = null, filterObject: GameObject = null): GameObject
    {
        let dist = 0.0;
        let minDist: number = maxDistance;
        if (minDist != Number.MAX_VALUE)
        {
            minDist *= minDist;
        }
        let minObj: GameObject;
        for (const go of this._collection)
        {
            if ((!classFilter || go instanceof classFilter) && go != filterObject)
            {
                dist = (go.x - x) * (go.x - x) + (go.y - y) * (go.y - y);
                if (dist < minDist)
                {
                    minDist = dist;
                    minObj = go;
                }
            }
        }
        return minObj;
    }

    add (go: GameObject): GameObject
    {
        this._collection.push(go);
        this.addChild(go);
        return go;
    }

    addAt (go: GameObject, index: number): GameObject
    {
        this._collection.splice(index - 1, 0, go);
        this.addChild(go);
        return go;
    }

    removeAtIndex (pos: number, doRemove: boolean): GameObject
    {
        const go: GameObject = this._collection[pos];
        this._collection.splice(pos, 1);
        go.handleDetach(this);
        if (doRemove)
        {
            go.remove();
        }
        return go;
    }

    remove (go: GameObject, doRemove: boolean): GameObject
    {
        const i: number = this._collection.indexOf(go);
        if (this._collection[i] && GameObject(this._collection[i]) == go)
        {
            this._collection.splice(i, 1);
            go.handleDetach(this);
            if (doRemove)
            {
                go.remove();
            }
            return go;
        }
        return null;
    }

    getIndex (go: GameObject): number
    {
        for (let i: number = this._collection.length - 1; i >= 0; --i)
        {
            if (this._collection[i] && GameObject(this._collection[i]) == go)
            {
                return i;
            }
        }
        return -1;
    }

    getRandom (): GameObject
    {
        if (this._collection.length == 0)
        {
            return null;
        }
        let go: GameObject;
        let tries = 0;
        while (!go && tries < 10)
        {
            go = this._collection[int(Math.random() * this._collection.length)];
            tries++;
        }
        return go;
    }

    checkCollision (x: number, y: number, classFilter: Class = null, filterObject: GameObject = null): GameObject
    {
        const hitGo: GameObject = this.getClosest(x, y, Number.MAX_VALUE, classFilter, filterObject);
        if ((hitGo && !hitGo.flaggedForRemoval) && hitGo.hitTestPoint(x, y, true))
        {
            return hitGo;
        }
        return null;
    }

    hasItemOfClass (findClass: Class): boolean
    {
        for (const go of this._collection)
        {
            if (go instanceof findClass)
            {
                return true;
            }
        }
        return false;
    }

    update (timeDelta = 1): void
    {
        for (let i: number = this._collection.length - 1; i >= 0; --i)
        {
            this._collection[i].update(timeDelta);
        }
    }

    clear (): void
    {
        for (let i: number = this._collection.length - 1; i >= 0; --i)
        {
            this._collection[i].remove();
        }
        this._collection.length = 0;
    }

    get head (): GameObject
    {
        if (this._collection.length)
        {
            return this._collection[0];
        }
        return null;
    }

    get tail (): GameObject
    {
        if (this._collection.length)
        {
            return this._collection[this._collection.length - 1];
        }
        return null;
    }

    get collection (): Array<GameObject>
    {
        return this._collection;
    }

    get size (): number
    {
        return this._collection.length;
    }
}
