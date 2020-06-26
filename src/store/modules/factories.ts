/**
 * Module of the store that manages factories.
 * Contains the state, mutation and getters related to purchasing factories,
 * and getting revenue from them.
 * Factories are displayed in the <FactoriesContainer>
 */
import { storeBuilder } from '@/store/RootState';
import { timer } from './timer';
import * as MoneyStore from './money';
import { FactoriesSave } from '@/interfaces/SaveTypes';
import { BuyMode } from '@/interfaces/FactoryTypes';
import { FactoryState, getMultipleUpgradesCost, canAffordFactory, updateFactoryUpgrades } from '@/store/modules/FactoryState';
import { factoriesData } from '@/data/factories.data';
import { UpgradeEffectOptions } from '@/interfaces/UpgradeTypes';


/** Main state container for the factories */
export class FactoriesState {
    public factories: FactoryState[] = [];
    public buyMode: BuyMode = 'single';

    public constructor() {
        factoriesData.forEach((factory) => {
            this.factories.push(new FactoryState(factory));
        });
    }
}

const builder = storeBuilder.module<FactoriesState>('factories', new FactoriesState());

/** Getter for generating the save data for factories */
const factorySave = builder.read((state) => {
    const save: FactoriesSave = [];
    state.factories.forEach(factory => {
        save.push(factory.generateSave());
    });
    return save;
}, 'factorySave');

const availableManagers = builder.read((state) => {
    const money = MoneyStore.getters.currentMoney;
    return state.factories.filter(factory => !factory.hasManager).map(factory => {
        return {
            cost: factory.data.manager.cost,
            name: factory.data.manager.name,
            factoryId: factory.data.id,
            factoryName: factory.data.name,
            canAfford: money >= factory.data.manager.cost,
        };
    });
}, 'availableManagers');

const factories = builder.read((state) => {
    return state.factories;
}, 'factories');

export const getters = {
    get factorySave() {
        return factorySave();
    },
    get factories() {
        return factories();
    },
    get availableManagers() {
        return availableManagers();
    },
};

// Mutations

export interface IBuyFactoryPayload {
    factoryId: string;
    amount: number;
}

/** Finds the cost of buying a certain amount of factories and adds the factories + spend the cost */
function buyFactory(state: FactoriesState, payload: IBuyFactoryPayload) {
    const amount = payload.amount;
    const factory = findFactory(state, payload.factoryId);
    const cost = getMultipleUpgradesCost(factory, amount);
    if (canAffordFactory(factory, amount)) {
        if (factory.owned === 0) {
            factory.lastTick = timer.time;
        }
        factory.owned += amount;
        updateFactoryUpgrades(factory);
        MoneyStore.mutations.spendMoney(cost);
    }
}

/** Buys the manager for a given factory */
function buyManager(state: FactoriesState, factoryId: string) {
    const factory = findFactory(state, factoryId);
    const cost = factory.data.manager.cost;
    const money = MoneyStore.getters.currentMoney;
    if (money >= cost) {
        factory.hasManager = true;
        if (!factory.running) {
            factory.running = true;
            factory.lastTick = timer.time;
        }
        MoneyStore.mutations.spendMoney(cost);
    }
}

/** Called when the player presses the run button for a factory, starting its tick cycle */
function runFactory(state: FactoriesState, factoryId: string) {
    const factory = findFactory(state, factoryId);
    if (factory.running) {
        // Ignore request if the factory is already running
        return;
    }
    factory.lastTick = timer.time;
    factory.running = true;
}

/** Called to multiply the profits of factories, used by upgrades */
function multiplyRevenue(state: FactoriesState, payload: UpgradeEffectOptions) {
    const target = payload.target;
    let factoriesToMultiply: FactoryState[] = [];
    if (target === 'all') {
        // All is a shortcut for upgrades that boost all profits
        factoriesToMultiply = state.factories;
    } else {
        factoriesToMultiply.push(findFactory(state, target));
    }
    factoriesToMultiply.forEach(factoryToMultiply => {
        // Multipliers are stacked in a multiplicative way
        factoryToMultiply.profitMultiplier *= payload.amount;
    });
}

/** Changes the buy mode for the player to easily buy multiple factories (x1, x10, next upgrade, max available) */
function setBuyMode(state: FactoriesState, buyMode: BuyMode) {
    state.buyMode = buyMode;
}

/** Called on every update to calculate the earnings of owned factories */
function updateFactoriesProduction(state: FactoriesState) {
    const moneyGained = state.factories.reduce((total, current) => {
        const gained = updateFactoryGains(current);
        return total + gained;
    }, 0);
    MoneyStore.mutations.addMoney(moneyGained);
}

/** Called on game start to load the save of owned factories  */
function loadSave(state: FactoriesState, save: FactoriesSave) {
    state.factories.forEach((factory, index) => {
        if (save.length > index) {
            factory.loadSave(save[index]);
        }
    });
}

export const mutations = {
    updateFactoriesProduction: builder.commit(updateFactoriesProduction),
    runFactory: builder.commit(runFactory),
    buyFactory: builder.commit(buyFactory),
    multiplyRevenue: builder.commit(multiplyRevenue),
    buyManager: builder.commit(buyManager),
    loadSave: builder.commit(loadSave),
    setBuyMode: builder.commit(setBuyMode),
};

// Internal functions

/** Main factory update function, checks the current time and calculates how many ticks
 * the factory has gained since last update (can potentially be multiple ones per update)
 */
function updateFactoryGains(factory: FactoryState) {
    if (!factory.hasManager && !factory.running) {
        // If we don't have a manager, only run the update if the factory is actually running.
        return 0;
    }
    const deltaSeconds = timer.time - factory.lastTick;
    const newTicks = Math.floor(deltaSeconds / factory.timeToTick);
    const usedTime = newTicks * factory.timeToTick;
    const moneyGained = factory.revenuePerTick * newTicks;
    const newTime = factory.lastTick + usedTime;
    if (factory.hasManager) {
        // If we have a manager, set last tick time to the tick that just happened, so it can start running immediately
        factory.lastTick = newTime;
    }
    if (!factory.hasManager && newTicks > 0) {
        // If we don't have a manager, stop running now that the factory has finished a tick
        factory.running = false;
    }
    return moneyGained;
}

/** Helper to find a factory by id */
export function findFactory(state: FactoriesState, factoryId: string) {
    const factoryState = state.factories.find(factory => factory.data.id === factoryId);
    if (!factoryState) {
        throw new Error(`Factory type ${factoryId} doesn't exist in the state.`);
    }
    return factoryState;
}
