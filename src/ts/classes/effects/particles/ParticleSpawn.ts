import type { ParticlePool } from './ParticlePool';
import type { Particle } from './Particle';

export class ParticleSpawn {

    static burst (
        spawnX: number, spawnY: number,
        count: number, spread: number,
        baseAngle: number, speed: number,
        speedVariance: number,
        pool: ParticlePool<typeof Particle>
    ): void
    {
        for (let i = 0; i < count; i++)
        {
            const particle = pool.addParticle();

            particle.x = spawnX;
            particle.y = spawnY;

            const speedRnd = Math.random() * speedVariance - speedVariance / 2;
            const spreadRnd = Math.random() * spread - spread / 2;

            particle.init(spawnX, spawnY,
                Math.sin((-baseAngle + spreadRnd) / 180 * Math.PI) * speed * (1 + speedRnd),
                Math.cos((-baseAngle + spreadRnd) / 180 * Math.PI) * speed * (1 + speedRnd));
        }
    }

    /*static explode (
        spawnX: number, spawnY: number,
        count: number, distanceMultiplier: number,
        pool: ParticlePool<typeof Particle>,
        randomRange = 2,
        vector = new Phaser.Math.Vector2(),
        spawnAreaSize = 0
    ): void
    {
        for (let i = 0; i < count; i++)
        {
            const particle = pool.addParticle();

            particle.init(
                spawnX + (Math.random() - .5) * spawnAreaSize,
                spawnY + (Math.random() - .5) * spawnAreaSize,
                (vector.x + (Math.random() - .5) * randomRange) * distanceMultiplier,
                (vector.y + (Math.random() - .5) * randomRange) * distanceMultiplier);
        }
    }

    // TODO cache vectors
    static explode2 (
        position: Phaser.Math.Vector2,
        pool: ParticlePool<typeof Particle>,
        count: number,
        randomRange = new Phaser.Math.Vector2(),
        vector = new Phaser.Math.Vector2(),
        spawnAreaSize = 0,
        distanceMultiplier = 1
    ): void
    {
        for (let i = 0; i < count; i++)
        {
            const particle = pool.addParticle();

            particle.init(
                position.x + (Math.random() - .5) * spawnAreaSize,
                position.y + (Math.random() - .5) * spawnAreaSize,
                (vector.x + (Math.random() - .5) * randomRange.x) * distanceMultiplier,
                (vector.y + (Math.random() - .5) * randomRange.y) * distanceMultiplier);
        }
    }*/
}
