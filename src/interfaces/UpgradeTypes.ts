export type UpgradeEffect = 'multiply-revenue';

export interface IMultiplyRevenueOptions {
    target: string;
    amount: number;
}
// Can become a union type later for multiple types of upgrades
export type UpgradeEffectOptions = IMultiplyRevenueOptions;

export interface IUpgradeData {
    id: string;
    cost: number;
    name: string;
    effect: {
        type: UpgradeEffect;
        options: UpgradeEffectOptions;
    };
}

export interface IUpgradeUIData extends IUpgradeData {
    owned: boolean;
    canAfford: boolean;
}
