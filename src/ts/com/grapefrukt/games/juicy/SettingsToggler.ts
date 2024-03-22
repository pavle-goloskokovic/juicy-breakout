import * as dat from 'dat.gui';
import { Settings } from './Settings';
import { title } from '../../../../game.config';

type Controller = dat.GUIController & {
    __min?: number;
    __max?: number;
};

export class SettingsToggler {

    private gui: dat.GUI;

    constructor (scene: Phaser.Scene)
    {
        const gui = this.gui = new dat
            .GUI({ width: 320 })
            .addFolder(title);
        gui.open();

        const colors = gui.addFolder('Colors');
        colors.add(Settings, 'EFFECT_SCREEN_COLORS')
            .name('SCREEN COLORS');

        const tweening = gui.addFolder('Tweening');
        tweening.add(Settings, 'EFFECT_TWEENIN_ENABLED')
            .name('ENABLED');
        tweening.add(Settings, 'EFFECT_TWEENIN_PROPERTY_Y')
            .name('PROPERTY Y');
        tweening.add(Settings, 'EFFECT_TWEENIN_PROPERTY_ROTATION')
            .name('PROPERTY ROTATION');
        tweening.add(Settings, 'EFFECT_TWEENIN_PROPERTY_SCALE')
            .name('PROPERTY SCALE');
        tweening.add(Settings, 'EFFECT_TWEENIN_DELAY')
            .name('DELAY').min(0).max(1).step(0.01);
        tweening.add(Settings, 'EFFECT_TWEENIN_DURATION')
            .name('DURATION').min(0.01).max(3);
        tweening.add(Settings, 'EFFECT_TWEENIN_EQUATION')
            .name('EQUATION').min(0).max(3).step(1);

        const stretchAndSqueeze = gui.addFolder('Stretch and squeeze');
        stretchAndSqueeze.add(Settings, 'EFFECT_PADDLE_STRETCH')
            .name('PADDLE STRETCH');

        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_EXTRA_SCALE')
            .name('BALL EXTRA SCALE');
        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_ROTATE')
            .name('BALL ROTATE');
        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_ROTATE_ANIMATED')
            .name('BALL ROTATE ANIMATED');
        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_STRETCH')
            .name('BALL STRETCH');
        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_STRETCH_ANIMATED')
            .name('BALL STRETCH ANIMATED');
        stretchAndSqueeze.add(Settings, 'EFFECT_BALL_GLOW')
            .name('BALL GLOW');
        stretchAndSqueeze.add(Settings, 'BALL_GRAVITY')
            .name('BALL GRAVITY').min(0).max(20).step(0.1);

        stretchAndSqueeze.add(Settings, 'EFFECT_BLOCK_JELLY')
            .name('BLOCK JELLY');
        stretchAndSqueeze.add(Settings, 'EFFECT_BOUNCY_LINES_ENABLED')
            .name('BOUNCY LINES ENABLED');

        const sounds = gui.addFolder('Sounds');
        sounds.add(Settings, 'SOUND_WALL')
            .name('WALL');
        sounds.add(Settings, 'SOUND_BLOCK')
            .name('BLOCK');
        sounds.add(Settings, 'SOUND_PADDLE')
            .name('PADDLE');
        sounds.add(Settings, 'SOUND_MUSIC')
            .name('MUSIC');

        const particles = gui.addFolder('Particles');
        particles.add(Settings, 'EFFECT_PARTICLE_BALL_COLLISION')
            .name('PARTICLE BALL COLLISION');

        particles.add(Settings, 'EFFECT_BLOCK_DESTRUCTION_DURATION')
            .name('BLOCK DESTRUCTION DURATION').min(0).max(3);
        particles.add(Settings, 'EFFECT_BLOCK_SCALE')
            .name('BLOCK SCALE');
        particles.add(Settings, 'EFFECT_BLOCK_GRAVITY')
            .name('BLOCK GRAVITY');
        particles.add(Settings, 'EFFECT_BLOCK_PUSH')
            .name('BLOCK PUSH');
        particles.add(Settings, 'EFFECT_BLOCK_ROTATE')
            .name('BLOCK ROTATE');
        particles.add(Settings, 'EFFECT_BLOCK_DARKEN')
            .name('BLOCK DARKEN');
        particles.add(Settings, 'EFFECT_BLOCK_SHATTER')
            .name('BLOCK SHATTER');

        particles.add(Settings, 'EFFECT_PARTICLE_BLOCK_SHATTER')
            .name('PARTICLE BLOCK SHATTER');
        particles.add(Settings, 'EFFECT_PARTICLE_PADDLE_COLLISION')
            .name('PARTICLE PADDLE COLLISION');

        particles.add(Settings, 'EFFECT_BALL_TRAIL')
            .name('BALL TRAIL');
        particles.add(Settings, 'EFFECT_BALL_TRAIL_SCALE')
            .name('BALL TRAIL SCALE');
        particles.add(Settings, 'EFFECT_BALL_TRAIL_LENGTH')
            .name('BALL TRAIL LENGTH').min(5).max(100).step(1);

        const screenShake = gui.addFolder('Screen shake');
        screenShake.add(Settings, 'EFFECT_SCREEN_SHAKE')
            .name('SCREEN SHAKE');
        screenShake.add(Settings, 'EFFECT_SCREEN_SHAKE_POWER')
            .name('SCREEN SHAKE POWER').min(0).max(1);

        const freezeSleep = gui.addFolder('Freeze/Sleep');
        freezeSleep.add(Settings, 'EFFECT_FREEZE_DURATION_MS')
            .name('FREEZE DURATION MS').min(0).max(320).step(1);
        freezeSleep.add(Settings, 'EFFECT_FREEZE_SPEED_MULTIPLIER')
            .name('FREEZE SPEED MULTIPLIER').min(0).max(1).step(0.01);
        freezeSleep.add(Settings, 'EFFECT_FREEZE_FADE_IN_MS')
            .name('FREEZE FADE IN MS').min(0).max(160).step(1);
        freezeSleep.add(Settings, 'EFFECT_FREEZE_FADE_OUT_MS')
            .name('FREEZE FADE OUT MS').min(0).max(160).step(1);

        const personality = gui.addFolder('Personality');
        personality.add(Settings, 'EFFECT_PADDLE_FACE')
            .name('PADDLE FACE');
        personality.add(Settings, 'EFFECT_PADDLE_LOOK_AT_BALL')
            .name('PADDLE LOOK AT BALL');
        personality.add(Settings, 'EFFECT_PADDLE_SMILE')
            .name('PADDLE SMILE').min(0).max(100).step(1);
        personality.add(Settings, 'EFFECT_PADDLE_EYE_SIZE')
            .name('PADDLE EYE SIZE').min(1).max(300).step(1);
        personality.add(Settings, 'EFFECT_PADDLE_EYE_SEPARATION')
            .name('PADDLE EYE SEPARATION').min(10).max(60).step(1);

        const finishHim = gui.addFolder('Finish him');
        finishHim.add(Settings, 'EFFECT_SCREEN_COLOR_GLITCH')
            .name('SCREEN COLOR GLITCH');
        finishHim.add(Settings, 'POWERUP_SLICER_BALL')
            .name('POWERUP SLICER BALL');

        const other = gui.addFolder('Other');
        other.add(Settings, 'NUM_BALLS')
            .name('NUM BALLS').min(0).max(1).step(1);

        other.add(Settings, 'EFFECT_BLOCK_SHATTER_ROTATION')
            .name('BLOCK SHATTER ROTATION').min(0).max(20);
        other.add(Settings, 'EFFECT_BLOCK_SHATTER_FORCE')
            .name('BLOCK SHATTER FORCE').min(0).max(5);

        other.add(Settings, 'EFFECT_BOUNCY_LINES_STRENGHT')
            .name('BOUNCY LINES STRENGHT').min(0).max(100);
        other.add(Settings, 'EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS')
            .name('BOUNCY LINES DISTANCE FROM WALLS');
        other.add(Settings, 'EFFECT_BOUNCY_LINES_WIDTH')
            .name('BOUNCY LINES WIDTH').min(1).max(100);

        this.forEach((controller) =>
        {
            const value = controller.getValue();

            // default min/max values
            if (typeof value === 'number')
            {
                if (typeof controller.__min === 'undefined')
                {
                    controller.min(value / 2);
                }

                if (typeof controller.__max === 'undefined')
                {
                    controller.max(value * 2);
                }
            }
        });

        scene.input.keyboard.on('keydown-TAB', (e: KeyboardEvent) =>
        {
            (<any>dat.GUI).toggleHide();

            e.preventDefault();
        });

        this.injectCss(require('../../../../../css/dat.css?raw'));
    }

    private forEach (callbackfn: (controller: Controller) => void): void
    {
        const folders = this.gui.__folders;

        for (const folderKey in folders)
        {
            folders[folderKey].__controllers.forEach(callbackfn);
        }
    }

    setAll (value: boolean): void
    {
        this.forEach((controller) =>
        {
            switch (controller.property)
            {
                case 'EFFECT_SCREEN_COLORS':
                    value && controller.setValue(value);
                    return;

                case 'EFFECT_PADDLE_SMILE':
                    controller.setValue(value ? 100 : 0);
                    break;
            }

            if (typeof controller.getValue() === 'boolean')
            {
                controller.setValue(value);
            }
        });
    }

    private injectCss (cssContent: string, indoc?: Document)
    {
        const doc = indoc || document;
        const injected = document.createElement('style');
        // injected.type = 'text/css';
        injected.innerHTML = cssContent;
        const head = doc.getElementsByTagName('head')[0];
        try
        {
            head.appendChild(injected);
        }
        catch (e)
        {
            // Unable to inject CSS, probably because of a Content Security Policy
            console.error(e);
        }
    }

}
