export type BuyMode = 'single' | 'ten' | 'next' | 'max';

export interface IManagerData {
    name: string;
    cost: number;
}

/** Represents the game balance data for a factory */
export interface IFactoryData {
    id: string;
    name: string;
    baseCost: number;
    /** The cost of a factory is calculated using compound growth of the base cost,
     * with the costIncreasePercent and how many factories are owned */
    costIncreasePercent: number;
    /** Array of the levels at which an upgrade is gained */
    upgradeLevels: number[];
    baseMoneyPerTick: number;
    /** base time to tick in seconds, the time is shortened every time an upgrade is obtained */
    baseTimeToTick: number;
    manager: IManagerData;
}
