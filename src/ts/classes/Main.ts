import TXT from 'com.grapefrukt.debug';
import GameObjectCollection from 'com.grapefrukt.games.general.collections';
import ParticlePool from 'com.grapefrukt.games.general.particles';
import ParticleSpawn from 'com.grapefrukt.games.general.particles';
import BouncyLine from 'com.grapefrukt.games.juicy.effects';
import BallImpactParticle from 'com.grapefrukt.games.juicy.effects.particles';
import BlockShatterParticle from 'com.grapefrukt.games.juicy.effects.particles';
import ConfettiParticle from 'com.grapefrukt.games.juicy.effects.particles';
import JuicyEvent from 'com.grapefrukt.games.juicy.events';
import Ball from 'com.grapefrukt.games.juicy.gameobjects';
import Block from 'com.grapefrukt.games.juicy.gameobjects';
import Paddle from 'com.grapefrukt.games.juicy.gameobjects';
import Shape from 'flash.display';
import TimerEvent from 'flash.events';
import ColorTransform from 'flash.geom';
import Timer from 'flash.utils';

import LazyKeyboard from 'com.grapefrukt.input';
import Timestep from 'com.grapefrukt';
import GTween from 'com.gskinner.motion';
import ColorTransformPlugin from 'com.gskinner.motion.plugins';
import Sprite from 'flash.display';
import Event from 'flash.events';
import KeyboardEvent from 'flash.events';
import MouseEvent from 'flash.events';
import Point from 'flash.geom';
// import SoundChannel from 'flash.media';
import Keyboard from 'flash.ui';

import Shaker from 'TODO';
import Toggler from 'TODO';
import Slides from 'TODO';
import SoundManager from 'TODO';
import Settings from './Settings';
import Freezer from './Freezer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOOP = (...args: any[]): any => {};
const addChild = NOOP;
const removeChild = NOOP;

/*let tabEnabled: boolean;
let tabChildren: boolean;*/
const mouseX = 0;
const mouseY = 0;

export default class Main extends Sprite {

    private _blocks: GameObjectCollection;
    private _balls: GameObjectCollection;
    private _lines: GameObjectCollection;
    private _timestep: Timestep;
    private _screenshake: Shaker;

    private _paddle: Paddle;

    private _particles_impact: ParticlePool;
    private _particles_shatter: ParticlePool;
    private _particles_confetti: ParticlePool;

    private _mouseDown: boolean;
    private _mouseVector: Point;

    private _toggler: Toggler;

    private _backgroundGlitchForce: number;
    private _soundBlockHitCounter: number;
    private _soundLastTimeHit: number;

    private _keyboard: LazyKeyboard;
    private _slides: Slides;
    private _background: Shape;
    private _useColors: boolean;
    private _preload: TXT;

    private stage: any;
    private parent: any;
    private transform: any;

    constructor ()
    {
        super();

        ColorTransformPlugin.install();

        SoundManager.init();
        SoundManager.soundControl.addEventListener(Event.INIT, this.handleInit);

        this._preload = new TXT();
        this._preload.setText('Loading sounds...');
        addChild(this._preload);

        /*tabEnabled = false;
        tabChildren = false;*/
    }

    private handleInit (/*e: Event*/): void
    {
        removeChild(this._preload);

        this._particles_confetti = new ParticlePool(ConfettiParticle);
        addChild(this._particles_confetti);

        this._blocks = new GameObjectCollection();
        this._blocks.addEventListener(JuicyEvent.BLOCK_DESTROYED, this.handleBlockDestroyed, true);
        addChild(this._blocks);

        // we want to draw these under the ball, that's why it's added here
        this._lines = new GameObjectCollection();
        addChild(this._lines);

        this._balls = new GameObjectCollection();
        this._balls.addEventListener(JuicyEvent.BALL_COLLIDE, this.handleBallCollide, true);
        addChild(this._balls);

        this._particles_impact = new ParticlePool(BallImpactParticle);
        addChild(this._particles_impact);

        this._particles_shatter = new ParticlePool(BlockShatterParticle);
        addChild(this._particles_shatter);


        addEventListener(Event.ENTER_FRAME, this.handleEnterFrame);
        this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKeyDown);
        this.stage.addEventListener(MouseEvent.MOUSE_DOWN, this.handleMouseToggle);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseToggle);

        this._timestep = new Timestep();
        this._timestep.gameSpeed = 1;

        this._mouseVector = new Point;

        this._screenshake = new Shaker(this);

        this._background = new Shape;
        this.parent.addChildAt(this._background, 0);

        this._toggler = new Toggler(Settings);
        this.parent.addChild(this._toggler);

        this._slides = new Slides();
        this._slides.visible = false;
        this.parent.addChild(this._slides);

        this._keyboard = new LazyKeyboard(this.stage);

        this.updateColorUse();

        this.reset();

        // hack to set focus to stage all the time
        const t: Timer = new Timer(50, 0);
        t.addEventListener(TimerEvent.TIMER, (/*e:Event*/) =>
        {
            this.stage.focus = this.stage;
        });
        t.start();
    }

    drawBackground (): void
    {
        this._background.graphics.clear();
        if (Settings.EFFECT_SCREEN_COLOR_GLITCH && this._backgroundGlitchForce > 0.01)
        {
            this._background.graphics.beginFill(Settings.COLOR_BACKGROUND * (3 * Math.random()));
            this._backgroundGlitchForce *= 0.8;
        }
        else
        {
            this._background.graphics.beginFill(Settings.COLOR_BACKGROUND);
        }
        this._background.graphics.drawRect(5, 5, Settings.STAGE_W-10, Settings.STAGE_H);
    }

    reset (): void
    {

        this._soundBlockHitCounter = 0;
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
            const block: Block = new Block(120 + (i % 10) * (Settings.BLOCK_W + 10), 30 + 47.5 + Math.floor(i / 10) * (Settings.BLOCK_H + 10));
            this._blocks.add(block);
        }

        const buffer = Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        this._lines.add(new BouncyLine(buffer, buffer, Settings.STAGE_W - buffer, buffer));
        this._lines.add(new BouncyLine(buffer, buffer, buffer, Settings.STAGE_H));
        this._lines.add(new BouncyLine(Settings.STAGE_W - buffer, buffer, Settings.STAGE_W - buffer, Settings.STAGE_H));

        this._paddle = new Paddle();
        this._blocks.add(this._paddle);
    }

    private handleEnterFrame (/*e:Event*/): void
    {
        this._timestep.tick();

        this._soundLastTimeHit++;

        if (Settings.EFFECT_SCREEN_COLORS != this._useColors)
        {
            this.updateColorUse();
        }

        if (!Settings.SOUND_MUSIC)
        {
            SoundManager.soundControl.stopSound('music-0');
        }
        else if (!SoundManager.soundControl.getSound('music-0').isPlaying)
        {
            SoundManager.play('music');
        }

        if (this._keyboard.keyIsDown(Keyboard.CONTROL) || this._slides.visible)
        {
            this._timestep.gameSpeed = 0;
        }
        else if (this._keyboard.keyIsDown(Keyboard.SHIFT))
        {
            this._timestep.gameSpeed = .1;
        }
        else
        {
            this._timestep.gameSpeed = 1;
        }

        this._timestep.gameSpeed *= Freezer.multiplier;

        GTween.timeScaleAll = this._timestep.gameSpeed;

        this.drawBackground();

        this._balls.update(this._timestep.timeDelta);
        this._blocks.update(this._timestep.timeDelta);
        this._lines.update(this._timestep.timeDelta);
        this._screenshake.update(this._timestep.timeDelta);

        if (this._balls.collection.length) this._paddle.lookAt(Ball(this._balls.collection[0]));

        if (Settings.EFFECT_PADDLE_STRETCH)
        {
            this._paddle.scaleX = 1 + Math.abs(this._paddle.x - mouseX) / 100;
            this._paddle.scaleY = 1.5 - this._paddle.scaleX * .5;
        }
        else
        {
            this._paddle.scaleX = this._paddle.scaleY = 1;
        }
        this._paddle.x = mouseX;

        const screen_buffer = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        for (const ball/*:Ball*/ of this._balls.collection)
        {
            if (ball.x < screen_buffer 						&& ball.velocityX < 0) ball.collide(-1, 1);
            if (ball.x > Settings.STAGE_W - screen_buffer 	&& ball.velocityX > 0) ball.collide(-1, 1);
            if (ball.y < screen_buffer 						&& ball.velocityY < 0) ball.collide(1, -1);
            if (ball.y > Settings.STAGE_H 					&& ball.velocityY > 0) ball.collide(1, -1);

            ball.velocityY += Settings.BALL_GRAVITY / 100 * this._timestep.timeDelta;

            // line ball collision
            for (const line/*:BouncyLine*/ of this._lines.collection)
            {
                line.checkCollision(ball);
            }


            if (this._mouseDown)
            {
                this._mouseVector.x = (ball.x - mouseX) * Settings.MOUSE_GRAVITY_POWER * this._timestep.timeDelta;
                this._mouseVector.y = (ball.y - mouseY) * Settings.MOUSE_GRAVITY_POWER * this._timestep.timeDelta;
                if (this._mouseVector.length > Settings.MOUSE_GRAVITY_MAX) this._mouseVector.normalize(Settings.MOUSE_GRAVITY_MAX);

                ball.velocityX -= this._mouseVector.x;
                ball.velocityY -= this._mouseVector.y;
            }

            // hard limit for min vel
            if (ball.velocity < Settings.BALL_MIN_VELOCITY)
            {
                ball.velocity = Settings.BALL_MIN_VELOCITY;
            }

            // soft limit for max vel
            if (ball.velocity > Settings.BALL_MAX_VELOCITY)
            {
                ball.velocity -= ball.velocity * Settings.BALL_VELOCITY_LOSS * this._timestep.timeDelta;
            }

            for (const block/*: Block*/ of this._blocks.collection)
            {
                // check for collisions
                if (block.collidable && this.isColliding(ball, block))
                {

                    // back the ball out of the block
                    const v: Point = new Point(ball.velocityX, ball.velocityY);
                    v.normalize(2);
                    while (this.isColliding(ball, block))
                    {
                        ball.x -= v.x;
                        ball.y -= v.y;
                    }

                    block.collide(ball);

                    // figure out which way to bounce

                    // slicer powerup
                    if (Settings.POWERUP_SLICER_BALL && !(typeof block === Paddle))
                        ball.collide(1, 1, block);
                    // top
                    else if (ball.y <= block.y - block.collisionH / 2 && ball.velocityY > 0) ball.collide(1, -1, block);
                    // bottom
                    else if (ball.y >= block.y + block.collisionH / 2 && ball.velocityY < 0) ball.collide(1, -1, block);
                    // left
                    else if (ball.x <= block.x - block.collisionW / 2) ball.collide(-1, 1, block);
                    // right
                    else if (ball.x >= block.x + block.collisionW / 2) ball.collide(-1, 1, block);
                    // wtf!
                    else ball.collide(-1, -1, block);

                    break; // only collide with one block per update
                }
            }
        }
    }

    private isColliding (ball: Ball, block: Block): boolean
    {
        return 	ball.x > block.x - block.collisionW / 2 && ball.x < block.x + block.collisionW / 2 &&
            ball.y > block.y - block.collisionH / 2 && ball.y < block.y + block.collisionH / 2;
    }

    private handleBallCollide (e: JuicyEvent): void
    {

        if(e.block != null && e.block != this._paddle)
            this._backgroundGlitchForce = 0.05;

        if (Settings.EFFECT_PARTICLE_BALL_COLLISION)
        {
            ParticleSpawn.burst(
                e.ball.x,
                e.ball.y,
                5,
                90,
                -Math.atan2(e.ball.velocityX, e.ball.velocityY) * 180 / Math.PI,
                e.ball.velocity * 5,
                .5,
                this._particles_impact
            );
        }

        if (Settings.EFFECT_SCREEN_SHAKE) this._screenshake.shake(-e.ball.velocityX * Settings.EFFECT_SCREEN_SHAKE_POWER, -e.ball.velocityY * Settings.EFFECT_SCREEN_SHAKE_POWER);

        if (Settings.EFFECT_BLOCK_JELLY)
        {
            for (const block/*:Block*/ of this._blocks.collection)
            {
                // let dist: number = block.getDistance(e.ball);
                // dist = dist / Settings.STAGE_W;
                // dist = MathUtil.clamp(dist, 1, 0) * .2;
                block.jellyEffect(.2, Math.random() * .02);
            }
        }

        e.ball.velocity = Settings.BALL_MAX_VELOCITY;

        // wall collision
        if (typeof e.block === Paddle)
        {
            if (Settings.SOUND_PADDLE) SoundManager.play('ball-paddle');

            if (Settings.EFFECT_PARTICLE_PADDLE_COLLISION)
            {
                ParticleSpawn.burst(
                    e.ball.x,
                    e.ball.y,
                    20,
                    90,
                    -180,
                    600,
                    1,
                    this._particles_confetti
                );
            }

        }
        else if (e.block)
        {
            // SoundManager.play("ball-block");
            this._soundBlockHitCounter++;

            if (this._soundLastTimeHit > 60)
                this._soundBlockHitCounter = 0;

            this._soundLastTimeHit = 0;
            if (Settings.SOUND_BLOCK) SoundManager.playSoundId('ball-block', this._soundBlockHitCounter);
        }
        else
        {
            if (Settings.SOUND_WALL) SoundManager.play('ball-wall');
        }
    }

    private handleBlockDestroyed (e: JuicyEvent): void
    {
        if (Settings.EFFECT_PARTICLE_BLOCK_SHATTER)
        {
            ParticleSpawn.burst(
                e.ball.x,
                e.ball.y,
                5,
                45,
                -Math.atan2(e.ball.velocityX, e.ball.velocityY) * 180 / Math.PI,
                50 + e.ball.velocity * 10,
                .5,
                this._particles_shatter
            );
        }
    }

    private handleKeyDown (e: KeyboardEvent): void
    {
        if (e.keyCode == Keyboard.SPACE) this.reset();
        if (e.keyCode == Keyboard.B) this.addBall();
        //if (e.keyCode == Keyboard.S) this._screenshake.shakeRandom(4);
        if (e.keyCode == Keyboard.ENTER)
        {
            this._toggler.setAll(true);
            Settings.EFFECT_SCREEN_COLORS = true;
        }
        if (e.keyCode == Keyboard.NUMBER_2) this._toggler.setAll(false);
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
        if (Settings.EFFECT_SCREEN_COLORS)
        {
            this.transform.colorTransform = new ColorTransform();
            this._background.transform.colorTransform = new ColorTransform();
        }
        else
        {
            this.transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            this._background.transform.colorTransform = new ColorTransform(0, 0, 0);
        }

        this._useColors = Settings.EFFECT_SCREEN_COLORS;
    }

}
