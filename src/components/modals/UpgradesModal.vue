<template>
    <div class="upgrades-modal">
        <p>Invest in upgrades to maximise profits!</p>
        <transition-group el="div" name="fade" v-if="availableUpgrades.length > 0">
            <div class="box upgrade-box" v-for="upgrade in availableUpgrades" :key="upgrade.data.id">
                <div class="manager-info">
                    <span class="is-size-4 is-bold">{{ upgrade.data.name }}</span>
                    <span class="is-size-6">{{ upgrade.upgradeText}}</span>
                </div>
                <button class="button" v-on:click="buyUpgrade(upgrade)" :disabled="!upgrade.canAfford">
                    {{ upgrade.data.cost | formatCurrency }}
                </button>
            </div>
        </transition-group>
        <p v-else>Wow, you bought all upgrades!</p>
    </div>
</template>

<script lang="ts">

/** Popup that shows available upgrades and allows purchasing them */
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseModal } from '../BaseModal';
import * as UpgradesStore from '@/store/modules/upgrades';
import * as MoneyStore from '@/store/modules/money';
import { IManagerInfo } from '@/interfaces/ManagerTypes';
import { IUpgradeUIData } from '@/interfaces/UpgradeTypes';
import { UpgradeState } from '@/store/modules/UpgradeState';


@Component
export default class UpgradesModal extends BaseModal {

    public buyUpgrade(upgrade: UpgradeState) {
        UpgradesStore.mutations.buyUpgrade(upgrade.data.id);
    }

    public get availableUpgrades() {
        return UpgradesStore.getters.availableUpgrades;
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.manager-box {
    background-color: $scheme-main-ter;
    display: flex;
    justify-content: space-between;
}

.manager-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
