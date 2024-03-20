import { Settings } from './Settings';
import { GTween } from '../../../gskinner/motion/GTween';
import { getTimer } from '../../../../flash/utils/getTimer';
export class Freezer {
    private static frozeAt: number;
    public static freeze (): void
    {
        Freezer.frozeAt = getTimer();
    }

    public static get multiplier (): number
    {
        let time: number = getTimer() - Freezer.frozeAt;
        if (time < Settings.EFFECT_FREEZE_FADE_IN_MS )
        {
            return Freezer.lerp(1, Settings.EFFECT_FREEZE_SPEED_MULTIPLIER, time / Settings.EFFECT_FREEZE_FADE_IN_MS);
        }
        time -= Settings.EFFECT_FREEZE_FADE_IN_MS;
        if (time < Settings.EFFECT_FREEZE_DURATION_MS )
        {
            return Settings.EFFECT_FREEZE_SPEED_MULTIPLIER;
        }
        time -= Settings.EFFECT_FREEZE_DURATION_MS;
        if (time < Settings.EFFECT_FREEZE_FADE_OUT_MS )
        {
            return Freezer.lerp(Settings.EFFECT_FREEZE_SPEED_MULTIPLIER, 1, time / Settings.EFFECT_FREEZE_FADE_OUT_MS);
        }
        return 1;
    }

    private static lerp (start: number, end: number, f: number): number
    {
        return start + (end - start) * f;
    }
}