<template>
    <div class="game-bottom-bar">
        <div class="bottom-button">
            <button class="accent is-rounded is-size-5" v-on:click="showManagers">Managers</button>
            <transition name="fade">
                <notification-badge :amount="managersPurchasable" v-if="managersPurchasable > 0"/>
            </transition>
        </div>
        <div class="bottom-button">
            <button class="accent is-rounded is-size-5" v-on:click="showUpgrades">Upgrades</button>
            <transition name="fade">
                <notification-badge :amount="upgradesPurchasable" v-if="upgradesPurchasable > 0"/>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as ModalsStore from '@/store/modules/modals';
import * as FactoriesStore from '@/store/modules/factories';
import * as UpgradesStore from '@/store/modules/upgrades';
import * as MoneyStore from '@/store/modules/money';
import { IManagerInfo } from '@/interfaces/ManagerTypes';
import NotificationBadge from '@/components/NotificationBadge.vue';
import { IUpgradeUIData } from '../interfaces/UpgradeTypes';
import { UpgradeState } from '@/store/modules/UpgradeState';

@Component({
    components: {
        NotificationBadge,
    },
})
export default class GameBottomBar extends Vue {
    public showManagers() {
        ModalsStore.mutations.addModal({
            name: 'managers-modal',
            title: 'Managers',
            options: {},
        });
    }

    public showUpgrades() {
        ModalsStore.mutations.addModal({
            name: 'upgrades-modal',
            title: 'Upgrades',
            options: {},
        });
    }

    public get availableManagers(): IManagerInfo[] {
        return FactoriesStore.getters.availableManagers;
    }

    public get availableUpgrades(): UpgradeState[] {
        return UpgradesStore.getters.availableUpgrades;
    }

    public get upgradesPurchasable(): number {
        return this.availableUpgrades.filter(upgrade => upgrade.canAfford).length;
    }

    public get managersPurchasable(): number {
        return this.availableManagers.filter(manager => manager.canAfford).length;
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.game-bottom-bar {
    box-sizing: border-box;
    background-color: $scheme-main-ter;
    padding: 0.4rem 2rem 0.4rem 2rem;
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.bottom-button {
    position: relative;
}
</style>
