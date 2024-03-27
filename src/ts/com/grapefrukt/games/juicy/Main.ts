import { Shaker } from './Shaker';
import { SettingsToggler } from './SettingsToggler';
// import { Slides } from './Slides';
import { Settings } from './Settings';
import { Freezer } from './Freezer';
// import { ParticlePool } from '../general/particles/ParticlePool';
// import { ParticleSpawn } from '../general/particles/ParticleSpawn';
// import { BouncyLine } from './effects/BouncyLine';
// import { BallImpactParticle } from './effects/particles/BallImpactParticle';
// import { BlockShatterParticle } from './effects/particles/BlockShatterParticle';
// import { ConfettiParticle } from './effects/particles/ConfettiParticle';
import { JuicyEvent } from './events/JuicyEvent';
import { Ball } from './gameobjects/Ball';
import { Block } from './gameobjects/Block';
import { Paddle } from './gameobjects/Paddle';
// import { ColorTransformPlugin } from '../../../gskinner/motion/plugins/ColorTransformPlugin';
import spritesData from '../../../../../data/sprites.json';

export class Main extends Phaser.Scene {

    private blocks: Block[] = [];
    private balls: Ball[] = [];
    // private _lines: GameObjectCollection<BouncyLine>; // TODO wobbly lines

    private shaker: Shaker;

    private paddle: Paddle;

    // private _particles_impact: ParticlePool; // TODO particles
    // private _particles_shatter: ParticlePool;
    // private _particles_confetti: ParticlePool;

    private pointerDown = false;
    private pointerVector = new Phaser.Math.Vector2();

    private toggler: SettingsToggler;

    private bgGlitchForce: number;

    private blockHitCount: number;
    private blockHitTime: number;

    private keyCtrl: Phaser.Input.Keyboard.Key;
    private keyShift: Phaser.Input.Keyboard.Key;

    // private _slides: Slides; // TODO slides
    private bg: Phaser.GameObjects.Graphics;
    private useColors: boolean;
    private preloadText: Phaser.GameObjects.Text;

    private music: Phaser.Sound.BaseSound;
    private tempVector = new Phaser.Math.Vector2();

    constructor () { super('main'); }

    boot (): void
    {
        // ColorTransformPlugin.install(); // TODO
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

        load.atlas('sprites',
            require('../../../../../assets/images/sprites.png'),
            spritesData);

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

        // this._particles_confetti = new ParticlePool(ConfettiParticle);
        // this.addChild(this._particles_confetti);

        this.events
            .on(JuicyEvent.BLOCK_DESTROYED, this.handleBlockDestroyed, this)
            .on(JuicyEvent.BALL_COLLIDE, this.handleBallCollide, this);

        // this._lines = new GameObjectCollection();
        // this.addChild(this._lines);

        // this._particles_impact = new ParticlePool(BallImpactParticle);
        // this.addChild(this._particles_impact);
        // this._particles_shatter = new ParticlePool(BlockShatterParticle);
        // this.addChild(this._particles_shatter);

        this.toggler = new SettingsToggler(this);

        this.handleKeyDown();

        this.input.on('pointerdown', () =>
        {
            this.pointerDown = true;
        }
        ).on('pointerup', () =>
        {
            this.pointerDown = false;
        });

        this.shaker = new Shaker(this.cameras.main);

        // this._slides = new Slides();
        // this._slides.visible = false;
        // this.parent.addChild(this._slides);

        const keyboard = this.input.keyboard;
        this.keyCtrl = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.keyShift = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

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

        this.blocks.forEach((block) =>
        {
            block.destroy();
        });
        this.blocks.length = 0;

        this.balls.forEach((ball) =>
        {
            ball.destroy();
        });
        this.balls.length = 0;

        // this._lines.clear();

        // this._particles_impact.clear();

        for (let j = 0; j < Settings.NUM_BALLS; j++)
        {
            this.addBall();
        }

        for (let i = 0; i < 80; i++)
        {
            this.blocks.push(
                this.add.existing(
                    new Block(this,
                        120 + i % 10 * (Settings.BLOCK_W + 10),
                        30 + 47.5 + Math.trunc(i / 10) * (Settings.BLOCK_H + 10)
                    )
                )
            );
        }

        // const buffer = Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        // this._lines.add(new BouncyLine(buffer, buffer, Settings.STAGE_W - buffer, buffer));
        // this._lines.add(new BouncyLine(buffer, buffer, buffer, Settings.STAGE_H));
        // this._lines.add(new BouncyLine(Settings.STAGE_W - buffer, buffer, Settings.STAGE_W - buffer, Settings.STAGE_H));

        this.blocks.push(
            this.paddle = this.add.existing(new Paddle(this))
        );
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
        if (this.keyCtrl.isDown /*|| this._slides.visible*/)
        {
            clock.timeScale = 0;
        }
        else if (this.keyShift.isDown)
        {
            clock.timeScale = .1;
        }
        else
        {
            clock.timeScale = 1;
        }
        clock.timeScale *= Freezer.multiplier;

        const deltaFactor = delta / 1000 * 60 * clock.timeScale;

        this.drawBackground();

        this.balls.forEach((ball) =>
        {
            ball.update(deltaFactor);
        });

        this.blocks.forEach((block) =>
        {
            block.update(deltaFactor);
        });

        // this._lines.update(deltaFactor);

        this.shaker.update(deltaFactor);

        if (this.balls.length)
        {
            this.paddle.lookAt(this.balls[0]);
        }

        const input = this.input;
        if (Settings.EFFECT_PADDLE_STRETCH)
        {
            this.paddle.scaleX = 1 + Math.abs(this.paddle.x - input.x) / 100;
            this.paddle.scaleY = 1.5 - this.paddle.scaleX * .5;
        }
        else
        {
            this.paddle.scaleX =
                this.paddle.scaleY = 1;
        }
        this.paddle.x = input.x;

        const screen_buffer = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH
            + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;

        for (const ball of this.balls)
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

            // for (const line of this._lines.collection)
            // {
            //     line.checkCollision(ball);
            // }

            if (this.pointerDown)
            {
                const pointerVector = this.pointerVector;

                pointerVector.x = (ball.x - input.x)
                    * Settings.MOUSE_GRAVITY_POWER * deltaFactor;
                pointerVector.y = (ball.y - input.y)
                    * Settings.MOUSE_GRAVITY_POWER * deltaFactor;

                if (pointerVector.length() > Settings.MOUSE_GRAVITY_MAX)
                {
                    pointerVector
                        .normalize()
                        .scale(Settings.MOUSE_GRAVITY_MAX);
                }

                ball.velocityX -= pointerVector.x;
                ball.velocityY -= pointerVector.y;
            }

            if (ball.velocity < Settings.BALL_MIN_VELOCITY)
            {
                ball.velocity = Settings.BALL_MIN_VELOCITY;
            }

            if (ball.velocity > Settings.BALL_MAX_VELOCITY)
            {
                ball.velocity -= ball.velocity
                    * Settings.BALL_VELOCITY_LOSS * deltaFactor;
            }

            for (const block of this.blocks)
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
        return ((ball.x > block.x - block.collisionW / 2 &&
                    ball.x < block.x + block.collisionW / 2) &&
                ball.y > block.y - block.collisionH / 2) &&
            ball.y < block.y + block.collisionH / 2;
    }

    private handleBallCollide (ball: Ball, block: Block): void
    {
        const sound = this.sound;

        if (block && block !== this.paddle)
        {
            this.bgGlitchForce = 0.05;
        }

        /*if (Settings.EFFECT_PARTICLE_BALL_COLLISION)
        {
            ParticleSpawn.burst(ball.x, ball.y, 5, 90, -Math.atan2(ball.velocityX, ball.velocityY) * 180 / Math.PI, ball.velocity * 5, .5, this._particles_impact);
        }*/

        if (Settings.EFFECT_SCREEN_SHAKE)
        {
            this.shaker.shake(
                -ball.velocityX * Settings.EFFECT_SCREEN_SHAKE_POWER,
                -ball.velocityY * Settings.EFFECT_SCREEN_SHAKE_POWER
            );
        }

        if (Settings.EFFECT_BLOCK_JELLY)
        {
            for (const block of this.blocks)
            {
                block.jellyEffect(.2, Math.random() * .02);
            }
        }

        ball.velocity = Settings.BALL_MAX_VELOCITY;

        if (block instanceof Paddle)
        {
            if (Settings.SOUND_PADDLE)
            {
                sound.play('ball-paddle');
            }

            /*if (Settings.EFFECT_PARTICLE_PADDLE_COLLISION)
            {
                ParticleSpawn.burst(ball.x, ball.y, 20, 90, -180, 600, 1, this._particles_confetti);
            }*/
        }
        else if (block)
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

    private handleBlockDestroyed (ball: Ball, block: Block): void
    {
        /*if (Settings.EFFECT_PARTICLE_BLOCK_SHATTER)
        {
            ParticleSpawn.burst(ball.x, ball.y, 5, 45,
                -Math.atan2(ball.velocityX, ball.velocityY) * 180 / Math.PI,
                50 + ball.velocity * 10,
                .5, this._particles_shatter);
        }*/

        const index = this.blocks.indexOf(block);
        if (index > -1) // only splice array when item is found
        {
            // 2nd parameter means remove one item only
            this.blocks.splice(index, 1);
        }
    }

    private handleKeyDown (): void
    {
        const toggler = this.toggler;

        this.input.keyboard
            .on('keydown-SPACE', this.reset, this)
            .on('keydown-B', this.addBall, this)
            .on('keydown-ENTER', () =>
            {
                toggler.setAll(true);
            })
            .on('keydown-TWO', () =>
            {
                toggler.setAll(false);
            })
            .on('keydown-P', () =>
            {
                /*const b = this.balls[0];

                ParticleSpawn.burst(b.x, b.y,
                    10, 360,
                    Math.atan2(b.velocityY, b.velocityX) * 180 / Math.PI,
                    100, .1,
                    this._particles_impact
                );*/
            });
    }

    private addBall (): void
    {
        this.balls.push(
            this.add.existing(new Ball(this,
                Settings.STAGE_W / 2,
                Settings.STAGE_H / 2 + 100)
            )
        );
    }

    private updateColorUse (): void
    {
        const useColors = Settings.EFFECT_SCREEN_COLORS;
        // const bg = this.bg;

        if (useColors === this.useColors) { return; }

        if (useColors)
        {
            // TODO recreate color transform
            // this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
            // bg.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
        }
        else
        {
            // this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            // bg.transform.colorTransform = new ColorTransform(0, 0, 0, 1, 0, 0, 0, 0);
        }

        this.useColors = Settings.EFFECT_SCREEN_COLORS;
    }
}
