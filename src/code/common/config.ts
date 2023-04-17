import configJSON from './config.json';

interface Config {
    reelCount: number;
    reelLength: number;
    reelSize: number;

    topMargin: number;
    initialBalance: number;
    bet: number;

    symbolSize?: number;
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

console.log(config);
