import { Settings } from './classes/Settings';

/**
 * Game title used for page title tag and metadata.
 * @type {string}
 */
export const title =
    'JUICEATRON 5002 XX'; // TODO 2024 RI
/**
 * Game description used for html page metadata.
 * @type {string}
 */
export const description = 'TODO add description'; // TODO update
/**
 * Setting which enables us to quickly mute game sounds.
 * @type {boolean}
 */
export const mute = false;
/**
 * Setting which determines if stats should be enabled in game.
 * @type {boolean}
 */
export const stats = true;
/**
 * Game dimensions
 * @type {{w: number; h: number}}
 */
export const size: {
    readonly w: number;
    readonly h: number;
} = {
    w: Settings.STAGE_W,
    h: Settings.STAGE_H
};
/**
 * Google Analytics 4 tag ID
 * @type {string}
 */
export const tagId: string = null; // 'TAG_ID'; // TODO update
