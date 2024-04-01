import type { Particle } from './Particle';
import { ParticleEvent } from './events/ParticleEvent';
import { ObjectPool } from '../../../../../de/polygonal/core/ObjectPool';

export class ParticlePool<T extends typeof Particle>
    extends Phaser.GameObjects.Container {

    private pool: ObjectPool<T>;

    constructor (
        scene: Phaser.Scene,
        private particleClass: T,
        // TODO T constructor arguments
        size = 20
    )
    {
        super(scene);

        this.pool = new ObjectPool<T>(true);
        this.pool.allocate(this.particleClass, size, [scene]);
        this.pool.initialize('reset');

        this.on(ParticleEvent.DIE, this.releaseParticle, this);
    }

    clear (): void
    {
        const list = this.list as InstanceType<T>[];

        while (list.length)
        {
            this.releaseParticle(list[0]);
        }
    }

    private releaseParticle (p: InstanceType<T>): void
    {
        this.remove(p, false);
        p.removeFromDisplayList();

        this.pool.object = p;
    }

    addParticle (): InstanceType<T>
    {
        const p = this.pool.object;
        this.add(p);
        return p;
    }
}
