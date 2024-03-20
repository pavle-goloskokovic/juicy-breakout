import {Event} from "../../../../../../flash/events/Event";
export class ParticleEvent extends Event {
    public static DIE: string = 'particle_event_die';
    public constructor(type: string) {
        super(type, bubbles, cancelable);
    }
    public clone(): Event {
        return new ParticleEvent(type);
    }
    public toString(): string {
        return formatToString("ParticleEvent", "type", "bubbles", "cancelable", "eventPhase");
    }
}