/**
 * Part of the store that manages the money.
 * Handles storing and spending money.
 */
import { storeBuilder } from '@/store/RootState';
import { timer } from './timer';
import { MoneyUpdate, MoneySave } from '@/interfaces/SaveTypes';

/** Main state for the money store */
export class MoneyState {
    public lastUpdate: MoneyUpdate = {
        time: timer.time,
        money: 10,
    };
}

const builder = storeBuilder.module<MoneyState>('money', new MoneyState());

// getters
const currentMoney = builder.read((state) => {
    return calculateMoneySinceLastTick(state);
}, 'currentMoney');

const moneySave = builder.read((state) => {
    return state.lastUpdate;
}, 'moneySave');

export const getters = {
    get currentMoney() {
        return currentMoney();
    },
    get moneySave() {
        return moneySave();
    },
};

// mutations

function spendMoney(state: MoneyState, amount: number) {
    addMoney(state, amount * -1);
}

function addMoney(state: MoneyState, amount: number) {
    const current = calculateMoneySinceLastTick(state);
    state.lastUpdate.money = current + amount;
    state.lastUpdate.time = timer.time;
}

function setMoney(state: MoneyState, amount: number) {
    state.lastUpdate.money = amount;
    state.lastUpdate.time = timer.time;
}

function loadSave(state: MoneyState, save: MoneySave) {
    state.lastUpdate.money = save.money;
    state.lastUpdate.time = save.time;
}

export const mutations = {
    setMoney: builder.commit(setMoney),
    spendMoney: builder.commit(spendMoney),
    addMoney: builder.commit(addMoney),
    loadSave: builder.commit(loadSave),
};

// Internal functions
function calculateMoneySinceLastTick(state: MoneyState): number {
    return state.lastUpdate.money;
}
