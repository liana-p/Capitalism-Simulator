<template>
    <div class="managers-modal">
        <p>Managers will take care of your factories and run them automatically for you!</p>
        <transition-group el="div" name="fade">
            <div class="box manager-box" v-for="manager in availableManagers" :key="manager.factoryId">
                <div class="manager-info">
                    <span class="is-size-4 is-bold">{{ manager.name }}</span>
                    <span class="is-size-6">Manages {{ manager.factoryName }}</span>
                </div>
                <button class="button" v-on:click="buyManager(manager)" :disabled="!manager.canAfford">
                    {{ manager.cost | formatCurrency }}
                </button>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts">

/** Popup that shows available managers and allows purchasing them */
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseModal } from '../BaseModal';
import * as FactoriesStore from '@/store/modules/factories';
import * as MoneyStore from '@/store/modules/money';
import { IManagerInfo } from '@/interfaces/ManagerTypes';


@Component
export default class ManagersModal extends BaseModal {

    public buyManager(manager: IManagerInfo) {
        FactoriesStore.mutations.buyManager(manager.factoryId);
    }

    public get availableManagers() {
        return FactoriesStore.getters.availableManagers;
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
