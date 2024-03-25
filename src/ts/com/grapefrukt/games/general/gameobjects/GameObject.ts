export class GameObject extends Phaser.GameObjects.Container {

    velocityX = 0;
    velocityY = 0;

    update (deltaFactor = 1): void
    {
        this.x += this.velocityX * deltaFactor;
        this.y += this.velocityY * deltaFactor;
    }

    get velocity (): number
    {
        return Math.sqrt(
            this.velocityX * this.velocityX +
            this.velocityY * this.velocityY
        );
    }

    set velocity (value: number)
    {
        const ratio = value / this.velocity;
        this.velocityX = this.velocityX * ratio;
        this.velocityY = this.velocityY * ratio;
    }
}
