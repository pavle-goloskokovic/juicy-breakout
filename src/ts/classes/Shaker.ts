export class Shaker {

    private vel = new Phaser.Math.Vector2();
    private pos = new Phaser.Math.Vector2();

    private drag = .1;
    private elasticity = .1;

    constructor (private camera: Phaser.Cameras.Scene2D.Camera) { }

    shake (powerX: number, powerY: number): void
    {
        this.vel.x += powerX;
        this.vel.y += powerY;
    }

    /*shakeRandom (power: number): void
    {
        this.vel // Point.polar
            .set(1, 0)
            .scale(power)
            .setAngle(Math.random() * Math.PI * 2);
    }*/

    update (deltaFactor: number): void
    {
        this.vel.x -= this.vel.x * this.drag * deltaFactor;
        this.vel.y -= this.vel.y * this.drag * deltaFactor;
        this.vel.x -= this.pos.x * this.elasticity * deltaFactor;
        this.vel.y -= this.pos.y * this.elasticity * deltaFactor;
        this.pos.x += this.vel.x * deltaFactor;
        this.pos.y += this.vel.y * deltaFactor;
        this.camera.scrollX = this.pos.x;
        this.camera.scrollY = this.pos.y;
    }
}
