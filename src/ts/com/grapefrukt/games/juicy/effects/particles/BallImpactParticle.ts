import { Particle } from '../../../general/particles/Particle';
import { Settings } from '../../Settings';
import { applyColorTransform } from '../ColorTransform';

export class BallImpactParticle extends Particle {

    constructor (scene: Phaser.Scene)
    {
        super(scene, .3 + Math.random() * .3);

        const shade = .8 + Math.random() * .2;

        this.add(scene.add.graphics()
            .fillStyle(applyColorTransform(Settings.COLOR_SPARK,
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
