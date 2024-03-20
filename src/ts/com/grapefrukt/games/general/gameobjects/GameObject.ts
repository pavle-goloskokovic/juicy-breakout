import type { GameObjectCollection } from '../collections/GameObjectCollection';
import { GameObjectEvent } from '../events/GameObjectEvent';
import { Sprite } from '../../../../../flash/display/Sprite';
import { grapelib } from '../namespaces/grapelib';
import { Point } from '../../../../../flash/geom/Point';
import { Rectangle } from '../../../../../flash/geom/Rectangle';
[Event(name = 'gameobjectevent_detach', type = 'com.grapefrukt.games.general.events.GameObjectEvent')];
export class GameObject extends Sprite {
    velocityX = 0;
    velocityY = 0;
    protected _flagged_for_removal = false;
    protected _auto_remove = true;
    constructor ()
    {
        super();
    }

    update (timeDelta = 1): void
    {
        this.x += this.velocityX * timeDelta;
        this.y += this.velocityY * timeDelta;
    }

    get flaggedForRemoval (): boolean
    {
        return this._flagged_for_removal;
    }

    remove (): void
    {
        this._flagged_for_removal = true;
        dispatchEvent(new GameObjectEvent(GameObjectEvent.REMOVE, this, null));
        if (this._auto_remove )
        {
            this.handleRemoveComplete();
        }
    }

    protected handleRemoveComplete (): void
    {
        if (this.parent )
        {
            this.parent.removeChild(this);
        }
    }

    protected handleDetach (collection: GameObjectCollection): void
    {
        dispatchEvent(new GameObjectEvent(GameObjectEvent.DETACH, this, collection));
    }

    getDistance (other: GameObject): number
    {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    }

    get velocity (): number
    {
        return Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    }

    set velocity (value: number)
    {
        const ratio: number = value / this.velocity;
        this.velocityX = this.velocityX * ratio;
        this.velocityY = this.velocityY * ratio;
    }
}
