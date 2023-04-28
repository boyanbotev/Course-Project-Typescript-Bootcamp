import configJSON from './config.json';

interface Config {
    reelCount: number;
    reelLength: number;
    reelSize: number;

    topMargin: number;
    initialBalance: number;
    bet: number;

    symbolSize?: number;

    testMode?: boolean;
}

export const config: Config = JSON.parse(JSON.stringify(configJSON));

config.symbolSize = 660/config.reelLength;

if (
    typeof config.reelCount !== 'number' ||
    typeof config.reelLength !== 'number' ||
    typeof config.reelSize !== 'number' ||
    typeof config.topMargin !== 'number' ||
    typeof config.initialBalance !== 'number' ||
    typeof config.bet !== 'number'
) {
    throw new Error('Config is invalid');
}

if (config.symbolSize && typeof config.symbolSize !== 'number') {
    throw new Error('Config is invalid');
}

if (config.testMode && typeof config.testMode !== 'boolean') {
    throw new Error('Config is invalid');
}

if (config.testMode === true) {
    if (config.reelCount !== 4 || config.reelLength !== 4) {
        console.log(config.reelCount, config.reelLength, config.testMode);
        throw new Error('Test mode only works with 4x4 reels');
    }
}
