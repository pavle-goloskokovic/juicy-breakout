export class PaddleFace extends Phaser.GameObjects.Container {

    mouth: Phaser.GameObjects.Image;
    eyeL: Phaser.GameObjects.Image;
    eyeR: Phaser.GameObjects.Image;

    constructor (scene: Phaser.Scene)
    {
        super(scene);

        this.add(
            this.mouth = scene.add
                .image(0, 2.3, 'sprites', 'Mouth0002')
                .setVisible(false)
        );

        const eyeL = this.eyeL = scene.add
            .image(-24.35, -2.2, 'sprites', 'EyeOpen');

        const eyeR = this.eyeR = scene.add
            .image(24.35, -2.2, 'sprites', 'EyeOpen');

        this.add([eyeL, eyeR]);

        const clock = scene.time;
        const delay = 1000 / 60 * 99; // frames

        clock.addEvent({ // blink
            delay,
            loop: true,
            callback: () =>
            {
                eyeL.setTexture('sprites', 'EyeClosed');
                eyeR.setTexture('sprites', 'EyeClosed');
            }
        });

        clock.delayedCall(1000 / 60 * 7, () =>
        {
            clock.addEvent({ // open
                delay,
                loop: true,
                callback: () =>
                {
                    eyeL.setTexture('sprites', 'EyeOpen');
                    eyeR.setTexture('sprites', 'EyeOpen');
                }
            });
        });
    }

    smile (frame: number): void
    {
        frame = Phaser.Math.Clamp(frame, 1, 100);

        if (frame === 1)
        {
            this.mouth.visible = false;
        }
        else
        {
            this.mouth
                .setVisible(true)
                .setTexture('sprites', `Mouth0${('00' + frame).slice(-3)}`);
        }
    }

}
