/** Part of the store representing upgrades that can be purchased
 * Upgrades have data-driven effects based on their data in upgrades.data.ts
 * Uses UpgradeState for managing individual upgrades.
 * Upgrades are displayed/purchased in <UpgradesModal>
 */
import { storeBuilder } from '@/store/RootState';
import * as MoneyStore from './money';
import { UpgradesSave } from '@/interfaces/SaveTypes';
import { upgradesData } from '@/data/upgrades.data';
import { UpgradeState } from './UpgradeState';



// state
export class UpgradesState {
    public upgrades: UpgradeState[] = [];

    public constructor() {
        upgradesData.forEach(upgrade => {
            this.upgrades.push(new UpgradeState(upgrade));
        });
    }
}

const builder = storeBuilder.module<UpgradesState>('upgrades', new UpgradesState());

// getters
const upgrades = builder.read((state) => {
    return state.upgrades;
}, 'upgrades');

const availableUpgrades = builder.read((state) => {
    return state.upgrades.filter(upgrade => !upgrade.owned);
}, 'availableUpgrades');

const upgradesSave = builder.read((state) => {
    return state.upgrades.map(upgrade => {
        return {
            owned: upgrade.owned,
        };
    });
}, 'upgradesSave');

export const getters = {
    get upgrades() {
        return upgrades();
    },
    get availableUpgrades() {
        return availableUpgrades();
    },
    get upgradesSave() {
        return upgradesSave();
    },
};

// mutations

/** Purchases an upgrade, spending money and applying its effect */
function buyUpgrade(state: UpgradesState, upgradeId: string) {
    const upgrade = findUpgrade(state, upgradeId);
    const cost = upgrade.data.cost;
    const money = MoneyStore.getters.currentMoney;
    if (money >= cost) {
        upgrade.enable();
        MoneyStore.mutations.spendMoney(cost);
    }
}

/** Called on game start to load the save of owned factories  */
function loadSave(state: UpgradesState, save: UpgradesSave) {
    state.upgrades.forEach((upgrade, index) => {
        if (save.length > index) {
            upgrade.loadSave(save[index]);
        }
    });
}

export const mutations = {
    buyUpgrade: builder.commit(buyUpgrade),
    loadSave: builder.commit(loadSave),
};

function findUpgrade(state: UpgradesState, upgradeId: string) {
    const upgrade = state.upgrades.find(upgradeTest => upgradeTest.data.id === upgradeId);
    if (!upgrade) {
        throw new Error(`Upgrade ${upgradeId} doesn't exist in the state.`);
    }
    return upgrade;
}
