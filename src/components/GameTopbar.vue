<template>
    <div class="game-topbar">
        <div class="game-title is-flex">
            <div class="game-name-left">
                <span class="is-size-4 is-bold">Capitalism Simulator</span>
            </div>
            <div class="game-name-right">
                <button class="can-buy buy-mode-button is-rounded is-size-5" v-on:click="changeBuyMode">{{ buyModeText }}</button>
            </div>
        </div>
        <span class="is-size-4 is-bold">You have {{ money | formatCurrency }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as MoneyStore from '@/store/modules/money';
import * as FactoriesStore from '@/store/modules/factories';
import { BuyMode } from '@/interfaces/FactoryTypes';

const buyModes: BuyMode[] = ['single', 'ten', 'next', 'max'];

@Component
export default class GameTopbar extends Vue {
    public buyModeIndex: number = 0;
    public buyMode: BuyMode = 'single';

    public changeBuyMode() {
        this.buyModeIndex++;
        if (this.buyModeIndex >= buyModes.length) {
            this.buyModeIndex = 0;
        }
        this.buyMode = buyModes[this.buyModeIndex];
        FactoriesStore.mutations.setBuyMode(this.buyMode);
    }

    get buyModeText() {
        switch (buyModes[this.buyModeIndex]) {
            case 'single':
                return 'x1';
                break;
            case 'ten':
                return 'x10';
                break;
            case 'next':
                return 'Next';
                break;
            case 'max':
                return 'Max';
                break;
        }
    }

    get money() {
        return MoneyStore.getters.currentMoney;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.game-topbar {
    box-sizing: border-box;
    background-color: $scheme-main-ter;
    padding: 0.4rem 2rem 0.4rem 2rem;
    width: 100%;
}
.game-title {
    margin-bottom: 0.25rem;
    justify-content: space-between;
}
.buy-mode-button {
    border-width: 0;
    color: $text;
    font-weight: bold;
}
</style>
