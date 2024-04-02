import { ColorConverter } from '../../utilities/ColorConverter';
import { Particle } from './Particle';

export class ConfettiParticle extends Particle {

    private gfx: Phaser.GameObjects.Sprite;

    private vectorX = 0;
    private vectorY = 0;

    constructor (
        scene: Phaser.Scene,
        lifespan = 2
    )
    {
        super(scene, lifespan);

        this.add(this.gfx = scene.add
            .sprite(0, 0, 'sprites')
            .setTint(ColorConverter.HSBtoUINT(Math.random(), 1, 1)));
    }

    init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        this.vectorY = vectorY;
        this.vectorX = vectorX;

        this.x = xPos;
        this.y = yPos;

        this.angle = 0;

        this.particleScale = .8;

        this.alpha = 1;

        this.tween = this.scene.tweens.add({
            targets: this,
            duration: this.lifespan * 1000,
            onComplete: () => { this.die(); },
            onUpdate: () => { this.update(); },
            delay: Math.random() * .3,
            props: {
                scaleX: .01,
                scaleY: .01,
                angle: Math.random() * 360
            }
        });

        this.gfx.play({
            key: 'confetti',
            randomFrame: true
        });
    }

    update (): void
    {
        const scene = this.scene;
        const timeScale = scene.time.timeScale;
        const delta = scene.sys.game.loop.delta;
        const deltaFactor = delta / 1000 * 60 * timeScale;

        this.x += this.vectorX / 100 * deltaFactor;
        this.y += this.vectorY / 100 * deltaFactor;

        this.vectorY += 10 * deltaFactor;

        this.vectorX -= this.vectorX * .05 * deltaFactor;
        this.vectorY -= this.vectorY * .05 * deltaFactor;
    }
}
