import type { GameObjectCollection } from '../collections/GameObjectCollection';
import type { GameObject } from '../gameobjects/GameObject';
import { Event } from '../../../../../flash/events/Event';
export class GameObjectEvent extends Event {
    static REMOVE = 'gameobjectevent_remove';
    static DETACH = 'gameobjectevent_detach';
    private _collection: GameObjectCollection;
    private _game_object: GameObject;
    constructor (type: string, gameObject: GameObject, collection: GameObjectCollection)
    {
        super(type, bubbles, cancelable);
        this._game_object = gameObject;
        this._collection = collection;
    }

    clone (): Event
    {
        return new GameObjectEvent(this.type, this.gameObject, this.collection);
    }

    toString (): string
    {
        return this.formatToString('GameObjectEvent', 'type', 'bubbles', 'cancelable', 'eventPhase');
    }

    get gameObject (): GameObject
    {
        return this._game_object;
    }

    get collection (): GameObjectCollection
    {
        return this._collection;
    }
}
