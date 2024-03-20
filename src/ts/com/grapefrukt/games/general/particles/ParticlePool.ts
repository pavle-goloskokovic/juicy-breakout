import { Particle } from './Particle';
import { ParticleEvent } from './events/ParticleEvent';
import { ObjectPool } from '../../../../../de/polygonal/core/ObjectPool';
import { Sprite } from '../../../../../flash/display/Sprite';
export class ParticlePool extends Sprite {
    private _particleclass: Class;
    private _pool: ObjectPool;
    public constructor (particleClass: Class, size: number = 20)
    {
        super();
        this._particleclass = particleClass;
        this._pool = new ObjectPool(true);
        this._pool.allocate(this._particleclass, size);
        this._pool.initialize('reset', []);
        this.addEventListener(ParticleEvent.DIE, this.handleParticleDeath, true);
    }

    public clear (): void
    {
        while (this.numChildren)
        {
            const p: Particle = Particle(this.getChildAt(0));
            this.removeChild(p);
            this._pool.object = p;
        }
    }

    private handleParticleDeath (e: ParticleEvent): void
    {
        const p: Particle = Particle(e.target);
        this.removeChild(p);
        this._pool.object = p;
    }

    public add (): Particle
    {
        const p: Particle = this._pool.object;
        this.addChild(p);
        return p;
    }
}