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

        // TODO timers to animate eyes

        this.add(
            this.eyeL = scene.add
                .image(-24.35, -2.2, 'sprites', 'Eye0001')
        );

        this.add(
            this.eyeR = scene.add
                .image(24.35, -2.2, 'sprites', 'Eye0001')
        );
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
