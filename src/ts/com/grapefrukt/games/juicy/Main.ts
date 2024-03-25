import { Shaker } from './Shaker';
import { SettingsToggler } from './SettingsToggler';
import { Slides } from './Slides';
import { Settings } from './Settings';
import { Freezer } from './Freezer';
import { GameObjectCollection } from '../general/collections/GameObjectCollection';
import { ParticlePool } from '../general/particles/ParticlePool';
import { ParticleSpawn } from '../general/particles/ParticleSpawn';
import { BouncyLine } from './effects/BouncyLine';
import { BallImpactParticle } from './effects/particles/BallImpactParticle';
import { BlockShatterParticle } from './effects/particles/BlockShatterParticle';
import { ConfettiParticle } from './effects/particles/ConfettiParticle';
import { JuicyEvent } from './events/JuicyEvent';
import { Ball } from './gameobjects/Ball';
import { Block } from './gameobjects/Block';
import { Paddle } from './gameobjects/Paddle';
import { ColorTransform } from '../../../../flash/geom/ColorTransform';
import { LazyKeyboard } from '../../input/LazyKeyboard';
import { GTween } from '../../../gskinner/motion/GTween';
import { ColorTransformPlugin } from '../../../gskinner/motion/plugins/ColorTransformPlugin';
import { KeyboardEvent } from '../../../../flash/events/KeyboardEvent';
import { MouseEvent } from '../../../../flash/events/MouseEvent';
import { Keyboard } from '../../../../flash/ui/Keyboard';

export class Main extends Phaser.Scene {

    private _blocks: GameObjectCollection<Block>;
    private _balls: GameObjectCollection<Ball>;
    private _lines: GameObjectCollection<BouncyLine>;
    private _screenshake: Shaker;
    private _paddle: Paddle;
    private _particles_impact: ParticlePool;
    private _particles_shatter: ParticlePool;
    private _particles_confetti: ParticlePool;
    private _mouseDown: boolean;
    private _mouseVector: Phaser.Math.Vector2;
    private toggler: SettingsToggler;
    private bgGlitchForce: number;
    private blockHitCount: number;
    private blockHitTime: number;
    private _keyboard: LazyKeyboard;
    private _slides: Slides;
    private bg: Phaser.GameObjects.Graphics;
    private useColors: boolean;
    private preloadText: Phaser.GameObjects.Text;

    private music: Phaser.Sound.BaseSound;
    private tempVector = new Phaser.Math.Vector2();

    constructor () { super('main'); }

    boot (): void
    {
        ColorTransformPlugin.install(); // TODO
    }

    preload (): void
    {
        const load = this.load;

        load.audio('music',
            require('../../../../../assets/sound/juicy_breakout-theme.mp3'));
        load.audio('ball-paddle',
            require('../../../../../assets/sound/ball-paddle.mp3'));
        load.audio('ball-wall',
            require('../../../../../assets/sound/ball-wall.mp3'));
        for (let i = 0; i < 12; i++)
        {
            load.audio(`ball-block${i}`,
                require(`../../../../../assets/sound/pling${i + 1}.mp3`));
        }

        // TODO preload visual assets

        this.preloadText = this.add.text(0, 0, 'Loading sounds...', {
            color: '#ffffff',
            fontSize: 12,
            fontFamily: 'Arial'
        });
    }

    create (): void
    {
        this.preloadText.destroy();
        this.preloadText = null;

        this.music = this.sound.add('music', {
            volume: .8,
            loop: true
        });

        this.bg = this.add.graphics();

        this._particles_confetti = new ParticlePool(ConfettiParticle);
        this.addChild(this._particles_confetti);
        this._blocks = new GameObjectCollection();

        this.events.on(JuicyEvent.BLOCK_DESTROYED, this.handleBlockDestroyed, this);

        this.addChild(this._blocks);
        this._lines = new GameObjectCollection();
        this.addChild(this._lines);
        this._balls = new GameObjectCollection();
        this._balls.addEventListener(JuicyEvent.BALL_COLLIDE, this.handleBallCollide, true);
        this.addChild(this._balls);
        this._particles_impact = new ParticlePool(BallImpactParticle);
        this.addChild(this._particles_impact);
        this._particles_shatter = new ParticlePool(BlockShatterParticle);
        this.addChild(this._particles_shatter);

        this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKeyDown);
        this.stage.addEventListener(MouseEvent.MOUSE_DOWN, this.handleMouseToggle);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseToggle);

        this._mouseVector = new Phaser.Math.Vector2();
        this._screenshake = new Shaker(this);

        this.toggler = new SettingsToggler(this);

        this._slides = new Slides();
        this._slides.visible = false;
        this.parent.addChild(this._slides);
        this._keyboard = new LazyKeyboard(this.stage);

        this.updateColorUse();

        this.reset();
    }

    private drawBackground (): void
    {
        const bg = this.bg;

        bg.clear();

        if (Settings.EFFECT_SCREEN_COLOR_GLITCH && this.bgGlitchForce > 0.01)
        {
            bg.fillStyle(Settings.COLOR_BACKGROUND * (3 * Math.random()));

            this.bgGlitchForce *= 0.8;
        }
        else
        {
            bg.fillStyle(Settings.COLOR_BACKGROUND);
        }

        bg.fillRect(5, 5, Settings.STAGE_W - 10, Settings.STAGE_H);
    }

    private reset (): void
    {
        this.blockHitCount =
            this.blockHitTime = 0;

        this.drawBackground();

        this._blocks.clear();
        this._balls.clear();
        this._lines.clear();
        this._particles_impact.clear();
        for (let j = 0; j < Settings.NUM_BALLS; j++)
        {
            this.addBall();
        }
        for (let i = 0; i < 80; i++)
        {
            const block: Block = new Block(120 + i % 10 * (Settings.BLOCK_W + 10), 30 + 47.5 + int(i / 10) * (Settings.BLOCK_H + 10));
            this._blocks.add(block);
        }
        const buffer: number = Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        this._lines.add(new BouncyLine(buffer, buffer, Settings.STAGE_W - buffer, buffer));
        this._lines.add(new BouncyLine(buffer, buffer, buffer, Settings.STAGE_H));
        this._lines.add(new BouncyLine(Settings.STAGE_W - buffer, buffer, Settings.STAGE_W - buffer, Settings.STAGE_H));
        this._paddle = new Paddle();
        this._blocks.add(this._paddle);
    }

    update (time: number, delta: number): void
    {
        this.updateColorUse();

        const music = this.music;
        if (!Settings.SOUND_MUSIC)
        {
            music.stop();
        }
        else if (!music.isPlaying)
        {
            music.play();
        }

        const clock = this.time;
        if (this._keyboard.keyIsDown(Keyboard.CONTROL) || this._slides.visible)
        {
            clock.timeScale = 0;
        }
        else if (this._keyboard.keyIsDown(Keyboard.SHIFT))
        {
            clock.timeScale = .1;
        }
        else
        {
            clock.timeScale = 1;
        }
        clock.timeScale *= Freezer.multiplier;
        GTween.timeScaleAll = clock.timeScale; // TODO

        const deltaFactor = delta / 1000 * 60 * clock.timeScale;

        this.drawBackground();

        this._balls.update(deltaFactor);
        this._blocks.update(deltaFactor);
        this._lines.update(deltaFactor);
        this._screenshake.update(deltaFactor);
        if (this._balls.collection.length)
        {
            this._paddle.lookAt(Ball(this._balls.collection[0]));
        }
        if (Settings.EFFECT_PADDLE_STRETCH)
        {
            this._paddle.scaleX = 1 + Math.abs(this._paddle.x - this.mouseX) / 100;
            this._paddle.scaleY = 1.5 - this._paddle.scaleX * .5;
        }
        else
        {
            this._paddle.scaleX = (this._paddle.scaleY = 1);
        }
        this._paddle.x = this.mouseX;
        const screen_buffer: number = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        for (const ball of this._balls.collection)
        {
            if (ball.x < screen_buffer && ball.velocityX < 0)
            {
                ball.collide(-1, 1);
            }
            if (ball.x > Settings.STAGE_W - screen_buffer && ball.velocityX > 0)
            {
                ball.collide(-1, 1);
            }
            if (ball.y < screen_buffer && ball.velocityY < 0)
            {
                ball.collide(1, -1);
            }
            if (ball.y > Settings.STAGE_H && ball.velocityY > 0)
            {
                ball.collide(1, -1);
            }
            ball.velocityY += Settings.BALL_GRAVITY / 100 * deltaFactor;
            for (const line of this._lines.collection)
            {
                line.checkCollision(ball);
            }
            if (this._mouseDown)
            {
                this._mouseVector.x = (ball.x - this.mouseX) * Settings.MOUSE_GRAVITY_POWER * deltaFactor;
                this._mouseVector.y = (ball.y - this.mouseY) * Settings.MOUSE_GRAVITY_POWER * deltaFactor;
                if (this._mouseVector.length() > Settings.MOUSE_GRAVITY_MAX)
                {
                    this._mouseVector.normalize().scale(Settings.MOUSE_GRAVITY_MAX);
                }
                ball.velocityX -= this._mouseVector.x;
                ball.velocityY -= this._mouseVector.y;
            }
            if (ball.velocity < Settings.BALL_MIN_VELOCITY)
            {
                ball.velocity = Settings.BALL_MIN_VELOCITY;
            }
            if (ball.velocity > Settings.BALL_MAX_VELOCITY)
            {
                ball.velocity -= ball.velocity * Settings.BALL_VELOCITY_LOSS * deltaFactor;
            }
            for (const block of this._blocks.collection)
            {
                if (block.collidable && this.isColliding(ball, block))
                {
                    const v = this.tempVector
                        .set(ball.velocityX, ball.velocityY)
                        .normalize()
                        .scale(2);

                    while (this.isColliding(ball, block))
                    {
                        ball.x -= v.x;
                        ball.y -= v.y;
                    }
                    block.collide(ball);
                    if (Settings.POWERUP_SLICER_BALL && !(block instanceof Paddle))
                    {
                        ball.collide(1, 1, block);
                    }
                    else if (ball.y <= block.y - block.collisionH / 2 && ball.velocityY > 0)
                    {
                        ball.collide(1, -1, block);
                    }
                    else if (ball.y >= block.y + block.collisionH / 2 && ball.velocityY < 0)
                    {
                        ball.collide(1, -1, block);
                    }
                    else if (ball.x <= block.x - block.collisionW / 2)
                    {
                        ball.collide(-1, 1, block);
                    }
                    else if (ball.x >= block.x + block.collisionW / 2)
                    {
                        ball.collide(-1, 1, block);
                    }
                    else
                    {
                        ball.collide(-1, -1, block);
                    }
                    break;
                }
            }
        }
    }

    private isColliding (ball: Ball, block: Block): boolean
    {
        return ((ball.x > block.x - block.collisionW / 2 && ball.x < block.x + block.collisionW / 2) && ball.y > block.y - block.collisionH / 2) && ball.y < block.y + block.collisionH / 2;
    }

    private handleBallCollide (e: JuicyEvent): void
    {
        const sound = this.sound;

        if (e.block != null && e.block != this._paddle)
        {
            this.bgGlitchForce = 0.05;
        }

        if (Settings.EFFECT_PARTICLE_BALL_COLLISION)
        {
            ParticleSpawn.burst(e.ball.x, e.ball.y, 5, 90, -Math.atan2(e.ball.velocityX, e.ball.velocityY) * 180 / Math.PI, e.ball.velocity * 5, .5, this._particles_impact);
        }
        if (Settings.EFFECT_SCREEN_SHAKE)
        {
            this._screenshake.shake(-e.ball.velocityX * Settings.EFFECT_SCREEN_SHAKE_POWER, -e.ball.velocityY * Settings.EFFECT_SCREEN_SHAKE_POWER);
        }
        if (Settings.EFFECT_BLOCK_JELLY)
        {
            for (const block of this._blocks.collection)
            {
                block.jellyEffect(.2, Math.random() * .02);
            }
        }

        e.ball.velocity = Settings.BALL_MAX_VELOCITY;

        if (e.block instanceof Paddle)
        {
            if (Settings.SOUND_PADDLE)
            {
                sound.play('ball-paddle');
            }
            if (Settings.EFFECT_PARTICLE_PADDLE_COLLISION)
            {
                ParticleSpawn.burst(e.ball.x, e.ball.y, 20, 90, -180, 600, 1, this._particles_confetti);
            }
        }
        else if (e.block)
        {
            const now = Date.now();

            if (now - this.blockHitTime > 1000)
            {
                this.blockHitCount = 0;
            }
            else
            {
                this.blockHitCount =
                    (this.blockHitCount + 1) % 12;
            }

            this.blockHitTime = now;

            if (Settings.SOUND_BLOCK)
            {
                sound.play(`ball-block${this.blockHitCount}`);
            }
        }
        else
        {
            if (Settings.SOUND_WALL)
            {
                sound.play('ball-wall');
            }
        }
    }

    private handleBlockDestroyed (ball: Ball/*, block: Block*/): void
    {
        if (Settings.EFFECT_PARTICLE_BLOCK_SHATTER)
        {
            ParticleSpawn.burst(ball.x, ball.y, 5, 45,
                -Math.atan2(ball.velocityX, ball.velocityY) * 180 / Math.PI,
                50 + ball.velocity * 10,
                .5, this._particles_shatter);
        }
    }

    private handleKeyDown (e: KeyboardEvent): void
    {
        if (e.keyCode == Keyboard.SPACE)
        {
            this.reset();
        }
        if (e.keyCode == Keyboard.B)
        {
            this.addBall();
        }

        const toggler = this.toggler;
        if (e.keyCode == Keyboard.ENTER)
        {
            toggler.setAll(true);
        }
        if (e.keyCode == Keyboard.NUMBER_2)
        {
            toggler.setAll(false);
        }

        if (e.keyCode == Keyboard.P)
        {
            const b: Ball = this._balls.collection[0] as Ball;
            ParticleSpawn.burst(b.x, b.y, 10, 360, Math.atan2(b.velocityY, b.velocityX) * 180 / Math.PI, 100, .1, this._particles_impact);
        }
    }

    private handleMouseToggle (e: MouseEvent): void
    {
        this._mouseDown = e.type == MouseEvent.MOUSE_DOWN;
    }

    private addBall (): void
    {
        this._balls.add(new Ball(Settings.STAGE_W / 2, Settings.STAGE_H / 2 + 100));
    }

    private updateColorUse (): void
    {
        const useColors = Settings.EFFECT_SCREEN_COLORS;
        const bg = this.bg;

        if (useColors === this.useColors) { return; }

        if (useColors)
        {
            this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
            bg.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
        }
        else
        {
            this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            bg.transform.colorTransform = new ColorTransform(0, 0, 0, 1, 0, 0, 0, 0);
        }

        this.useColors = Settings.EFFECT_SCREEN_COLORS;
    }
}
