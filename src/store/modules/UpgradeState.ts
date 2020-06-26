/** Class representing the state of an individual upgrade in the store */
import { IUpgradeData, IMultiplyRevenueOptions } from '@/interfaces/UpgradeTypes';
import { IUpgradeSave } from '@/interfaces/SaveTypes';
import * as FactoriesStore from './factories';
import * as MoneyStore from './money';
import { factoriesData } from '@/data/factories.data';

export class UpgradeState {
    public data: IUpgradeData;
    public owned: boolean = false;

    constructor(data: IUpgradeData) {
        this.data = data;
    }

    public loadSave(save: IUpgradeSave) {
        if (save.owned) {
            this.enable();
        }
    }

    /** Called when the upgrade is bought, or when it's loaded from a game save */
    public enable() {
        this.owned = true;
        this.applyEffect();
    }

    /** When the upgrade is enabled, this makes its effects happen */
    public applyEffect() {
        switch (this.data.effect.type) {
            case 'multiply-revenue':
                this.boostRevenue(this.data.effect.options);
                break;
        }
    }

    /** Generates flavour text for the upgrade based on what it does */
    public get upgradeText() {
        switch (this.data.effect.type) {
            case 'multiply-revenue':
                let thingToBoost = '';
                const target = this.data.effect.options.target;
                if (target === 'all') {
                    thingToBoost = 'everything';
                } else {
                    thingToBoost = factoriesData.find(factory => factory.id === target)!.name;
                }
                return `Boosts revenue of ${thingToBoost} by x${this.data.effect.options.amount}`;
        }
    }

    public get canAfford() {
        const money = MoneyStore.getters.currentMoney;
        return money >= this.data.cost;
    }

    private boostRevenue(options: IMultiplyRevenueOptions) {
        FactoriesStore.mutations.multiplyRevenue(options);
    }
}
