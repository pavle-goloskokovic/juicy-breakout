export function applyColorTransform (
    baseColor: number,
    redMultiplier = 1,
    greenMultiplier = 1,
    blueMultiplier = 1,
    redOffset = 0,
    greenOffset = 0,
    blueOffset = 0,
): number
{
    const r = baseColor >> 16 & 0xFF;
    const g = baseColor >> 8 & 0xFF;
    const b = baseColor >> 0 & 0xFF;

    return calculateColorComponent(r, redMultiplier, redOffset) << 16
         | calculateColorComponent(g, greenMultiplier, greenOffset) << 8
         | calculateColorComponent(b, blueMultiplier, blueOffset);
}

function calculateColorComponent (
    value: number,
    multiplier: number,
    offset: number
): number
{
    return Phaser.Math.Clamp(value
        * Phaser.Math.Clamp(multiplier, 0, 1)
        + Phaser.Math.Clamp(offset, -255, 255),
    0, 255);
}
