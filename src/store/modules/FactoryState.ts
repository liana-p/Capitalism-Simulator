/** Class representing the state of an individual factory.
 * Used by the factories store module.
 * Contains helper functions and getters for calculating the revenue/cost etc of factories
 */
import { IFactoryData } from '@/interfaces/FactoryTypes';
import { IFactorySave } from '@/interfaces/SaveTypes';
import { timer } from '@/store/modules/timer';
import * as MoneyStore from '@/store/modules/money';
import * as NotificationStore from '@/store/modules/notifications';
import { calculateDelta } from '@/utils/UtilityFunctions';

// state
export class FactoryState {
    public data: IFactoryData;
    public owned: number;
    /** Used as a base to calculate the time diff since the last factory tick */
    public lastTick: number;
    /** Current upgrade level (factories have upgrades obtained automatically at specific levels) */
    public upgradeLevel: number;
    /** Time to tick in seconds */
    public timeToTick: number;
    public hasManager: boolean = false;
    public running: boolean = false;
    /** Multiplier on top of the normal revenue, obtained from upgrades */
    public profitMultiplier: number = 1;

    public constructor(data: IFactoryData) {
        this.data = data;
        this.owned = 0;
        this.lastTick = timer.time;
        this.timeToTick = data.baseTimeToTick;
        this.upgradeLevel = 0;
    }

    /** Generates save data for a factory */
    public generateSave(): IFactorySave {
        return {
            owned: this.owned,
            lastTick: this.lastTick,
            hasManager: this.hasManager,
            running: this.running,
        };
    }

    /** Loads save data for a factory */
    public loadSave(save: IFactorySave) {
        this.owned = save.owned;
        this.lastTick = save.lastTick;
        this.hasManager = save.hasManager;
        this.running = save.running;
        // We calculate which upgrades are obtained when loading
        this.upgradeLevel = upgradeLevelForFactory(this, this.owned);
        this.timeToTick = tickTimeForFactory(this);
    }

    /** Helper to calculate the cost of doing X upgrades */
    public costOfMultipleUpgrades(amount: number) {
        return getMultipleUpgradesCost(this, amount);
    }

    /** Calculates how many factories can be bought with the current amount of money */
    public get amountUpgradeable() {
        const money = MoneyStore.getters.currentMoney;
        let amountUpgradeable = 0;
        let canStillUpgrade = true;
        while (canStillUpgrade) {
            // Check the cost of the next upgrade
            const cost = getMultipleUpgradesCost(this, amountUpgradeable + 1);
            if (money - cost >= 0) {
                // If upgrade can be afford, move on to checking the next
                amountUpgradeable++;
            } else {
                canStillUpgrade = false;
            }
        }
        return amountUpgradeable;
    }

    /** Revenue every time the factory produces once */
    public get revenuePerTick() {
        return this.data.baseMoneyPerTick * this.owned * this.profitMultiplier;
    }

    /** Revenue per second, based on how long ticks take */
    public get revenuePerSecond() {
        return this.revenuePerTick / this.timeToTick;
    }

    /** Finds the level needed to the next upgrade (used for the "next" purchase mode) */
    public get levelForNextUpgrade(): number {
        return this.data.upgradeLevels.find(upgrade => upgrade > this.owned)!;
    }

    /** Current tick progress, used to display a progress bar */
    public get progress(): number | undefined {
        if (!this.owned) {
            return 0;
        }
        if (this.running) {
            if (this.timeToTick >= 1 || !this.hasManager) {
                let delta = calculateDelta(0, this.timeToTick, timer.time - this.lastTick);
                delta *= 100;
                return delta;
            } else {
                return undefined;
            }
        }
        return 0;
    }
}


/** ===== Utility functions ====== */

/** Combined cost of buying multiple upgrades */
export function getMultipleUpgradesCost(factory: FactoryState, amount: number): number {
    let total = 0;
    for (let i = 1; i <= amount; i++) {
        total += getFactoryCost(factory, factory.owned + amount);
    }
    return total;
}

export function canAffordFactory(factory: FactoryState, amount: number) {
    return getMultipleUpgradesCost(factory, amount) <= MoneyStore.getters.currentMoney;
}

export function updateFactoryUpgrades(factory: FactoryState) {
    const oldUpgradeLevel = factory.upgradeLevel;
    const newUpgradeLevel = upgradeLevelForFactory(factory, factory.owned);
    if (newUpgradeLevel !== oldUpgradeLevel) {
        // We show a notification when upgrades happen so the player notices
        NotificationStore.mutations.addNotification(`Factory ${factory.data.name} upgraded! Now 2x faster.`);
        factory.upgradeLevel = newUpgradeLevel;
        factory.timeToTick = tickTimeForFactory(factory);
    }
}

/** Cost of a specific upgrade */
function getFactoryCost(factory: FactoryState, upgradeIndex: number): number {
    /** We use upgradeIndex - 1 because the price for upgrading is at the previous index
     * (ie. index 0 gives the price for upgrading from 0 to 1) */
    return compoundGrowth(factory.data.baseCost, factory.data.costIncreasePercent / 100, upgradeIndex - 1);
}


function compoundGrowth(baseValue: number, increaseRate: number, amount: number): number {
    return baseValue * Math.pow(1 + increaseRate, amount);
}

/** Calculates the tick time for a factory based on balance data and upgrade level */
function tickTimeForFactory(factory: FactoryState) {
    let speedMultiplier = 1;
    if (factory.upgradeLevel >= 1) {
        // For each upgrade we divide the speed even more
        speedMultiplier = factory.upgradeLevel * 2;
    }
    return factory.data.baseTimeToTick / speedMultiplier;
}

function upgradeLevelForFactory(factory: FactoryState, upgradeIndex: number): number {
    let upgradeLevel = 0;
    const upgradeFound = factory.data.upgradeLevels.findIndex(upgrade => upgrade > upgradeIndex);
    if (upgradeFound) {
        upgradeLevel = upgradeFound - 1;
    }
    return upgradeLevel;
}
