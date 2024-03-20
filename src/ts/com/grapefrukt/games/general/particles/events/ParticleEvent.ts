import { Event } from '../../../../../../flash/events/Event';
export class ParticleEvent extends Event {
    static DIE = 'particle_event_die';
    constructor (type: string)
    {
        super(type, bubbles, cancelable);
    }

    clone (): Event
    {
        return new ParticleEvent(this.type);
    }

    toString (): string
    {
        return this.formatToString('ParticleEvent', 'type', 'bubbles', 'cancelable', 'eventPhase');
    }
}
