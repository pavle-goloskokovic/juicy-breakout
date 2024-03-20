import {GameObjectCollection} from "../collections/GameObjectCollection";
import {GameObject} from "../gameobjects/GameObject";
import {Event} from "../../../../../flash/events/Event";
export class GameObjectEvent extends Event {
    public static REMOVE: string = "gameobjectevent_remove";
    public static DETACH: string = "gameobjectevent_detach";
    private _collection: GameObjectCollection;
    private _game_object: GameObject;
    public constructor(type: string, gameObject: GameObject, collection: GameObjectCollection) {
        super(type, bubbles, cancelable);
        this._game_object = gameObject;
        this._collection = collection;
    }
    public clone(): Event {
        return new GameObjectEvent(this.type, this.gameObject, this.collection);
    }
    public toString(): string {
        return this.formatToString("GameObjectEvent", "type", "bubbles", "cancelable", "eventPhase");
    }
    public get gameObject(): GameObject {
        return this._game_object;
    }
    public get collection(): GameObjectCollection {
        return this._collection;
    }
}