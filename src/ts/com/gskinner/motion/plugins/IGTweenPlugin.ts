import type { GTween } from '../GTween';
export interface IGTweenPlugin {
    init(tween: GTween, name: string, value: number): number;
    tween(tween: GTween, name: string, value: number, initValue: number, rangeValue: number, ratio: number, end: boolean): number;
}