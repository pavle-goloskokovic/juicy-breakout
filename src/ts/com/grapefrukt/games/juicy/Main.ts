import {Shaker} from "./Shaker";
import {Toggler} from "./Toggler";
import {Slides} from "./Slides";
import {SoundManager} from "./SoundManager";
import {Settings} from "./Settings";
import {Freezer} from "./Freezer";
import {TXT} from "../../debug/TXT";
import {GameObjectCollection} from "../general/collections/GameObjectCollection";
import {ParticlePool} from "../general/particles/ParticlePool";
import {ParticleSpawn} from "../general/particles/ParticleSpawn";
import {BouncyLine} from "./effects/BouncyLine";
import {BallImpactParticle} from "./effects/particles/BallImpactParticle";
import {BlockShatterParticle} from "./effects/particles/BlockShatterParticle";
import {ConfettiParticle} from "./effects/particles/ConfettiParticle";
import {JuicyEvent} from "./events/JuicyEvent";
import {Ball} from "./gameobjects/Ball";
import {Block} from "./gameobjects/Block";
import {Paddle} from "./gameobjects/Paddle";
import {Shape} from "../../../../flash/display/Shape";
import {TimerEvent} from "../../../../flash/events/TimerEvent";
import {ColorTransform} from "../../../../flash/geom/ColorTransform";
import {Timer} from "../../../../flash/utils/Timer";
import {LazyKeyboard} from "../../input/LazyKeyboard";
import {Timestep} from "../../Timestep";
import {GTween} from "../../../gskinner/motion/GTween";
import {ColorTransformPlugin} from "../../../gskinner/motion/plugins/ColorTransformPlugin";
import {Sprite} from "../../../../flash/display/Sprite";
import {Event} from "../../../../flash/events/Event";
import {KeyboardEvent} from "../../../../flash/events/KeyboardEvent";
import {MouseEvent} from "../../../../flash/events/MouseEvent";
import {Point} from "../../../../flash/geom/Point";
import {SoundChannel} from "../../../../flash/media/SoundChannel";
import {Keyboard} from "../../../../flash/ui/Keyboard";
export class Main extends Sprite {
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
    public constructor() {
        super();
        ColorTransformPlugin.install();
        SoundManager.init();
        SoundManager.soundControl.addEventListener(Event.INIT, this.handleInit);
        this._preload = new TXT();
        this._preload.setText("Loading sounds...");
        addChild(this._preload);
        tabEnabled = false;
        tabChildren = false;
    }
    private handleInit(e: Event): void {
        removeChild(this._preload);
        this._particles_confetti = new ParticlePool(ConfettiParticle);
        addChild(this._particles_confetti);
        this._blocks = new GameObjectCollection();
        this._blocks.addEventListener(JuicyEvent.BLOCK_DESTROYED, this.handleBlockDestroyed, true);
        addChild(this._blocks);
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
        stage.addEventListener(KeyboardEvent.KEY_DOWN, this.handleKeyDown);
        stage.addEventListener(MouseEvent.MOUSE_DOWN, this.handleMouseToggle);
        stage.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseToggle);
        this._timestep = new Timestep();
        this._timestep.gameSpeed = 1;
        this._mouseVector = new Point();
        this._screenshake = new Shaker(this);
        this._background = new Shape();
        parent.addChildAt(this._background, 0);
        this._toggler = new Toggler(Settings);
        parent.addChild(this._toggler);
        this._slides = new Slides();
        this._slides.visible = false;
        parent.addChild(this._slides);
        this._keyboard = new LazyKeyboard(stage);
        this.updateColorUse();
        this.reset();
        let t: Timer = new Timer(50, 0);
        t.addEventListener(TimerEvent.TIMER, function(e: Event): void {
            stage.focus = stage;
        });
        t.start();
    }
    public drawBackground(): void {
        this._background.graphics.clear();
        if(Settings.EFFECT_SCREEN_COLOR_GLITCH && this._backgroundGlitchForce > 0.01 ) {
            this._background.graphics.beginFill(Settings.COLOR_BACKGROUND * (3 * Math.random()));
            this._backgroundGlitchForce *= 0.8;
        } else {
            this._background.graphics.beginFill(Settings.COLOR_BACKGROUND);
        }
        this._background.graphics.drawRect(5, 5, Settings.STAGE_W - 10, Settings.STAGE_H);
    }
    public reset(): void {
        this._soundBlockHitCounter = 0;
        this.drawBackground();
        this._blocks.clear();
        this._balls.clear();
        this._lines.clear();
        this._particles_impact.clear();
        for(let j: number = 0; j < Settings.NUM_BALLS; j++) {
            this.addBall();
        }
        for(let i: number = 0; i < 80; i++) {
            let block: Block = new Block(120 + i % 10 * (Settings.BLOCK_W + 10), 30 + 47.5 + int(i / 10) * (Settings.BLOCK_H + 10));
            this._blocks.add(block);
        }
        let buffer: number = Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        this._lines.add(new BouncyLine(buffer, buffer, Settings.STAGE_W - buffer, buffer));
        this._lines.add(new BouncyLine(buffer, buffer, buffer, Settings.STAGE_H));
        this._lines.add(new BouncyLine(Settings.STAGE_W - buffer, buffer, Settings.STAGE_W - buffer, Settings.STAGE_H));
        this._paddle = new Paddle();
        this._blocks.add(this._paddle);
    }
    private handleEnterFrame(e: Event): void {
        this._timestep.tick();
        this._soundLastTimeHit++;
        if(Settings.EFFECT_SCREEN_COLORS != this._useColors ) {
            this.updateColorUse();
        } 
        if(!Settings.SOUND_MUSIC ) {
            SoundManager.soundControl.stopSound("music-0");
        } else if(!SoundManager.soundControl.getSound("music-0").isPlaying ) {
            SoundManager.play("music");
        } 
        if(this._keyboard.keyIsDown(Keyboard.CONTROL) || this._slides.visible ) {
            this._timestep.gameSpeed = 0;
        } else if(this._keyboard.keyIsDown(Keyboard.SHIFT) ) {
            this._timestep.gameSpeed = .1;
        } else {
            this._timestep.gameSpeed = 1;
        }
        this._timestep.gameSpeed *= Freezer.multiplier;
        GTween.timeScaleAll = this._timestep.gameSpeed;
        this.drawBackground();
        this._balls.update(this._timestep.timeDelta);
        this._blocks.update(this._timestep.timeDelta);
        this._lines.update(this._timestep.timeDelta);
        this._screenshake.update(this._timestep.timeDelta);
        if(this._balls.collection.length ) {
            this._paddle.lookAt(Ball(this._balls.collection[0]))
        } 
        if(Settings.EFFECT_PADDLE_STRETCH ) {
            this._paddle.scaleX = 1 + Math.abs(this._paddle.x - mouseX) / 100;
            this._paddle.scaleY = 1.5 - this._paddle.scaleX * .5;
        } else {
            this._paddle.scaleX = (this._paddle.scaleY = 1);
        }
        this._paddle.x = mouseX;
        let screen_buffer: number = 0.5 * Settings.EFFECT_BOUNCY_LINES_WIDTH + Settings.EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS;
        for(let ball of this._balls.collection) {
            if(ball.x < screen_buffer && ball.velocityX < 0 ) {
                ball.collide(-1, 1)
            } 
            if(ball.x > Settings.STAGE_W - screen_buffer && ball.velocityX > 0 ) {
                ball.collide(-1, 1)
            } 
            if(ball.y < screen_buffer && ball.velocityY < 0 ) {
                ball.collide(1, -1)
            } 
            if(ball.y > Settings.STAGE_H && ball.velocityY > 0 ) {
                ball.collide(1, -1)
            } 
            ball.velocityY += Settings.BALL_GRAVITY / 100 * this._timestep.timeDelta;
            for(let line of this._lines.collection) {
                line.checkCollision(ball);
            }
            if(this._mouseDown ) {
                _mouseArrayx = (ball.x - mouseX) * Settings.MOUSE_GRAVITY_POWER * this._timestep.timeDelta;
                _mouseArrayy = (ball.y - mouseY) * Settings.MOUSE_GRAVITY_POWER * this._timestep.timeDelta;
                if(_mouseArraylength > Settings.MOUSE_GRAVITY_MAX ) {
                    _mouseArraynormalize(Settings.MOUSE_GRAVITY_MAX)
                } 
                ball.velocityX -= _mouseArrayx;
                ball.velocityY -= _mouseArrayy;
            } 
            if(ball.velocity < Settings.BALL_MIN_VELOCITY ) {
                ball.velocity = Settings.BALL_MIN_VELOCITY;
            } 
            if(ball.velocity > Settings.BALL_MAX_VELOCITY ) {
                ball.velocity -= ball.velocity * Settings.BALL_VELOCITY_LOSS * this._timestep.timeDelta;
            } 
            for(let block of this._blocks.collection) {
                if(block.collidable && this.isColliding(ball, block) ) {
                    let v: Point = new Point(ball.velocityX, ball.velocityY);
                    v.normalize(2);
                    while(this.isColliding(ball, block)) {
                        ball.x -= v.x;
                        ball.y -= v.y;
                    }
                    block.collide(ball);
                    if(Settings.POWERUP_SLICER_BALL && !(block instanceof Paddle) ) {
                        ball.collide(1, 1, block)
                    } else if(ball.y <= block.y - block.collisionH / 2 && ball.velocityY > 0 ) {
                        ball.collide(1, -1, block)
                    } else if(ball.y >= block.y + block.collisionH / 2 && ball.velocityY < 0 ) {
                        ball.collide(1, -1, block)
                    } else if(ball.x <= block.x - block.collisionW / 2 ) {
                        ball.collide(-1, 1, block)
                    } else if(ball.x >= block.x + block.collisionW / 2 ) {
                        ball.collide(-1, 1, block)
                    } else {
                        ball.collide(-1, -1, block)
                    }
                    break;;
                } 
            }
        }
    }
    private isColliding(ball: Ball, block: Block): boolean {
        return ((ball.x > block.x - block.collisionW / 2 && ball.x < block.x + block.collisionW / 2) && ball.y > block.y - block.collisionH / 2) && ball.y < block.y + block.collisionH / 2;
    }
    private handleBallCollide(e: JuicyEvent): void {
        if(e.block != null && e.block != this._paddle ) {
            this._backgroundGlitchForce = 0.05
        } 
        if(Settings.EFFECT_PARTICLE_BALL_COLLISION ) {
            ParticleSpawn.burst(e.ball.x, e.ball.y, 5, 90, -Math.atan2(e.ball.velocityX, e.ball.velocityY) * 180 / Math.PI, e.ball.velocity * 5, .5, this._particles_impact);
        } 
        if(Settings.EFFECT_SCREEN_SHAKE ) {
            this._screenshake.shake(-e.ball.velocityX * Settings.EFFECT_SCREEN_SHAKE_POWER, -e.ball.velocityY * Settings.EFFECT_SCREEN_SHAKE_POWER)
        } 
        if(Settings.EFFECT_BLOCK_JELLY ) {
            for(let block of this._blocks.collection) {
                block.jellyEffect(.2, Math.random() * .02);
            }
        } 
        e.ball.velocity = Settings.BALL_MAX_VELOCITY;
        if(e.block instanceof Paddle ) {
            if(Settings.SOUND_PADDLE ) {
                SoundManager.play("ball-paddle")
            } 
            if(Settings.EFFECT_PARTICLE_PADDLE_COLLISION ) {
                ParticleSpawn.burst(e.ball.x, e.ball.y, 20, 90, -180, 600, 1, this._particles_confetti);
            } 
        } else if(e.block ) {
            this._soundBlockHitCounter++;
            if(this._soundLastTimeHit > 60 ) {
                this._soundBlockHitCounter = 0
            } 
            this._soundLastTimeHit = 0;
            if(Settings.SOUND_BLOCK ) {
                SoundManager.playSoundId("ball-block", this._soundBlockHitCounter)
            } 
        } else {
            if(Settings.SOUND_WALL ) {
                SoundManager.play("ball-wall")
            } 
        }
    }
    private handleBlockDestroyed(e: JuicyEvent): void {
        if(Settings.EFFECT_PARTICLE_BLOCK_SHATTER ) {
            ParticleSpawn.burst(e.ball.x, e.ball.y, 5, 45, -Math.atan2(e.ball.velocityX, e.ball.velocityY) * 180 / Math.PI, 50 + e.ball.velocity * 10, .5, this._particles_shatter);
        } 
    }
    private handleKeyDown(e: KeyboardEvent): void {
        if(e.keyCode == Keyboard.SPACE ) {
            this.reset()
        } 
        if(e.keyCode == Keyboard.B ) {
            this.addBall()
        } 
        if(e.keyCode == Keyboard.ENTER ) {
            this._toggler.setAll(true);
            Settings.EFFECT_SCREEN_COLORS = true;
        } 
        if(e.keyCode == Keyboard.NUMBER_2 ) {
            this._toggler.setAll(false)
        } 
        if(e.keyCode == Keyboard.P ) {
            let b: Ball = this._balls.collection[0] as Ball;
            ParticleSpawn.burst(b.x, b.y, 10, 360, Math.atan2(b.velocityY, b.velocityX) * 180 / Math.PI, 100, .1, this._particles_impact);
        } 
    }
    private handleMouseToggle(e: MouseEvent): void {
        this._mouseDown = e.type == MouseEvent.MOUSE_DOWN;
    }
    private addBall(): void {
        this._balls.add(new Ball(Settings.STAGE_W / 2, Settings.STAGE_H / 2 + 100));
    }
    private updateColorUse(): void {
        if(Settings.EFFECT_SCREEN_COLORS ) {
            transform.colorTransform = new ColorTransform();
            this._background.transform.colorTransform = new ColorTransform();
        } else {
            transform.colorTransform = new ColorTransform(1, 1, 1, 1, 255, 255, 255);
            this._background.transform.colorTransform = new ColorTransform(0, 0, 0);
        }
        this._useColors = Settings.EFFECT_SCREEN_COLORS;
    }
}