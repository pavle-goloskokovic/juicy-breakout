import type { ParticlePool } from './ParticlePool';
import type { Particle } from './Particle';
import { GameObjectCollection } from '../collections/GameObjectCollection';
import { GameObject } from '../gameobjects/GameObject';
import { Point } from '../../../../../flash/geom/Point';
export class ParticleSpawn {
    public static burst (spawnX: number, spawnY: number, count: number, spread: number, baseAngle: number, speed: number, speedVariance: number, pool: ParticlePool): void
    {
        let speedRnd: number;
        const angleVector: Point = new Point();
        let spreadRnd: number = 0;
        for (let i: number = 0; i < count; i++)
        {
            const particle: Particle = pool.add();
            particle.x = spawnX;
            particle.y = spawnY;
            speedRnd = Math.random() * speedVariance - speedVariance / 2;
            spreadRnd = Math.random() * spread - spread / 2;
            angleArrayx = Math.sin((-baseAngle + spreadRnd) / 180 * Math.PI) * speed * (1 + speedRnd);
            angleArrayy = Math.cos((-baseAngle + spreadRnd) / 180 * Math.PI) * speed * (1 + speedRnd);
            particle.init(spawnX, spawnY, angleArrayx, angleArrayy);
        }
    }

    public static explode (spawnX: number, spawnY: number, count: number, distanceMultiplier: number, pool: ParticlePool, randomRange: number = 2, vector: Point = null, spawnAreaSize: number = 0): void
    {
        if (vector == null )
        {
            vector = new Point(0, 0);
        }
        for (let i: number = 0; i < count; i++)
        {
            const particle: Particle = pool.add();
            particle.init(spawnX + (Math.random() - .5) * spawnAreaSize, spawnY + (Math.random() - .5) * spawnAreaSize, (vector.x + (Math.random() - .5) * randomRange) * distanceMultiplier, (vector.y + (Math.random() - .5) * randomRange) * distanceMultiplier);
        }
    }

    public static explode2 (position: Point, pool: ParticlePool, count: number, randomRange: Point = null, vector: Point = null, spawnAreaSize: number = 0, distanceMultiplier: number = 1): void
    {
        if (randomRange == null )
        {
            randomRange = new Point(0, 0);
        }
        if (vector == null )
        {
            vector = new Point(0, 0);
        }
        for (let i: number = 0; i < count; i++)
        {
            const particle: Particle = pool.add();
            particle.init(position.x + (Math.random() - .5) * spawnAreaSize, position.y + (Math.random() - .5) * spawnAreaSize, (vector.x + (Math.random() - .5) * randomRange.x) * distanceMultiplier, (vector.y + (Math.random() - .5) * randomRange.y) * distanceMultiplier);
        }
    }
}