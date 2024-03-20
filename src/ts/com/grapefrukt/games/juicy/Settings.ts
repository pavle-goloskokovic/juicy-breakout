export default class Settings {

    static STAGE_W = 800;
    static STAGE_H = 600;

    static BLOCK_W = 50;
    static BLOCK_H = 20;

    static PADDLE_W = 100;
    static PADDLE_H = 30;

    /* [header("Colors")] */
    /* [o("91")] */ static EFFECT_SCREEN_COLORS = false;

    /* [header("Tweening")] */
    /* [o("A1")] */ static EFFECT_TWEENIN_ENABLED = false;
    /* [o("A2")] */ static EFFECT_TWEENIN_PROPERTY_Y = true;
    /* [o("A3")] */ static EFFECT_TWEENIN_PROPERTY_ROTATION = false;
    /* [o("A4")] */ static EFFECT_TWEENIN_PROPERTY_SCALE = false;
    /* [min("0")] [max("1")] */
    /* [o("A5")] */ static EFFECT_TWEENIN_DELAY = 0;
    /* [min("0.01")] [max("3")] */
    /* [o("A6")] */ static EFFECT_TWEENIN_DURATION = .7;
    /* [min("0")] [max("3")] */
    /* [o("A7")] */ static EFFECT_TWEENIN_EQUATION = 0;

    /* [header("Stretch and squeeze")] */
    /* [o("B1")] */ static EFFECT_PADDLE_STRETCH = false;

    /* [o("B2")] */ static EFFECT_BALL_EXTRA_SCALE = false;
    /* [o("B3")] */ static EFFECT_BALL_ROTATE = false;
    /* [o("B4")] */ static EFFECT_BALL_ROTATE_ANIMATED = false;
    /* [o("B5")] */ static EFFECT_BALL_STRETCH = false;
    /* [o("B6")] */ static EFFECT_BALL_STRETCH_ANIMATED = false;
    /* [o("B7")] */ static EFFECT_BALL_GLOW = false;
    /* [min("0")] [max("20")] */
    /* [o("B8")] */ static BALL_GRAVITY = 0;

    /* [o("C1")] */ static EFFECT_BLOCK_JELLY = false;
    /* [o("C2")] */ static EFFECT_BOUNCY_LINES_ENABLED = false;

    /* [header("Sounds")] */
    /* [o("E1")] */ static SOUND_WALL = false;
    /* [o("E2")] */ static SOUND_BLOCK = false;
    /* [o("E3")] */ static SOUND_PADDLE = false;
    /* [o("E4")] */ static SOUND_MUSIC = false;

    /* [header("Particles")] */
    /* [o("G0")] */ static EFFECT_PARTICLE_BALL_COLLISION = false;

    /* [min("0")] [max("3")] */
    /* [o("G01")] */ static EFFECT_BLOCK_DESTRUCTION_DURATION = 2;
    /* [o("G02")] */ static EFFECT_BLOCK_SCALE = false;
    /* [o("G03")] */ static EFFECT_BLOCK_GRAVITY = false;
    /* [o("G04")] */ static EFFECT_BLOCK_PUSH = false;
    /* [o("G05")] */ static EFFECT_BLOCK_ROTATE = false;
    /* [o("G06")] */ static EFFECT_BLOCK_DARKEN = false;
    /* [o("G07")] */ static EFFECT_BLOCK_SHATTER = false;

    /* [o("G08")] */ static EFFECT_PARTICLE_BLOCK_SHATTER = false;
    /* [o("G09")] */ static EFFECT_PARTICLE_PADDLE_COLLISION = false;

    /* [o("G10")] */ static EFFECT_BALL_TRAIL = false;
    /* [min("5")] [max("100")] */
    /* [o("G11")] */ static EFFECT_BALL_TRAIL_SCALE = true;
    /* [o("G12")] */ static EFFECT_BALL_TRAIL_LENGTH = 30;

    /* [header("Screen shake")] */
    /* [o("H0")] */ static EFFECT_SCREEN_SHAKE = false;
    /* [min("0")] [max("1")] */
    /* [o("H1")] */ static EFFECT_SCREEN_SHAKE_POWER = .5;

    /* [header("Freeze/Sleep")] */
    /* [min("0")] [max("320")] */
    /* [o("H10")] */ static EFFECT_FREEZE_DURATION_MS = 0;
    /* [min("0")] [max("1")] */
    /* [o("H12")] */ static EFFECT_FREEZE_SPEED_MULTIPLIER = 0;
    /* [min("0")] [max("160")] */
    /* [o("H14")] */ static EFFECT_FREEZE_FADE_IN_MS = 0;
    /* [min("0")] [max("160")] */
    /* [o("H16")] */ static EFFECT_FREEZE_FADE_OUT_MS = 0;

    /* [header("Personality")] */
    /* [o("I1")] */ static EFFECT_PADDLE_FACE = false;
    /* [o("I2")] */ static EFFECT_PADDLE_LOOK_AT_BALL = false;
    /* [min("1")] [max("100")] */
    /* [o("I3")] */ static EFFECT_PADDLE_SMILE = 0;
    /* [min("1")] [max("300")] */
    /* [o("I4")] */ static EFFECT_PADDLE_EYE_SIZE = 1;
    /* [min("10")] [max("60")] */
    /* [o("I5")] */ static EFFECT_PADDLE_EYE_SEPARATION = 25;

    /* [header("Finish him")] */
    /* [o("J1")] */ static EFFECT_SCREEN_COLOR_GLITCH = false;
    /* [o("J2")] */ static POWERUP_SLICER_BALL = false;

    /* [header("Other")] */
    /* [min("0")] [max("1")] */
    static NUM_BALLS = 1;

    /* [min("0")] [max("20")] */
    static EFFECT_BLOCK_SHATTER_ROTATION = 5;
    /* [min("0")] [max("5")] */
    static EFFECT_BLOCK_SHATTER_FORCE = 2;

    /* [min("0")] [max("100")] */
    static EFFECT_BOUNCY_LINES_STRENGHT = 10;
    static EFFECT_BOUNCY_LINES_DISTANCE_FROM_WALLS = 5;
    /* [min("1")] [max("100")] */
    static EFFECT_BOUNCY_LINES_WIDTH = 20;

    static BALL_MAX_VELOCITY = 5;
    static BALL_MIN_VELOCITY = 4;

    static MOUSE_GRAVITY_POWER = .001;
    static MOUSE_GRAVITY_MAX = .05;
    static BALL_VELOCITY_LOSS = .01;

    static COLOR_BACKGROUND = 0xF8F2B3;
    static COLOR_BLOCK = 0x62bd84;
    static COLOR_BALL = 0xd26635;
    static COLOR_PADDLE = 0xCF3746;
    static COLOR_TRAIL = 0xf7d37a;
    static COLOR_SPARK = 0xeba17f;
    static COLOR_BOUNCY_LINES = 0x88D1A3;

}
