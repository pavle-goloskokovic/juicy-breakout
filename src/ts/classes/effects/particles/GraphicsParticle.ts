import { Particle } from './Particle';
import { applyColorTransform } from '../../utilities/ColorTransform';

export class GraphicsParticle extends Particle {

    constructor (scene: Phaser.Scene, color: number)
    {
        super(scene, .3 + Math.random() * .3);

        const shade = .8 + Math.random() * .2;

        this.add(scene.add.graphics()
            .fillStyle(applyColorTransform(color,
                shade, shade, shade)
            )
            .fillRect(-7, -7, 14, 14)
        );
    }

    init (xPos: number, yPos: number, vectorX = 0, vectorY = 0): void
    {
        this.x = xPos;
        this.y = yPos;

        this.setScale(1);

        this.tween = this.scene.tweens.add({
            targets: this,
            duration: this.lifespan * 1000,
            onComplete: () => { this.die(); },
            props: {
                x: xPos + vectorX,
                y: yPos + vectorY,
                scaleX: .1,
                scaleY: .1
            },
            ease: Phaser.Math.Easing.Quadratic.Out
        });
    }
}
