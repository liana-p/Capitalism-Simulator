<template>
    <div>
        <div class="columns is-mobile is-vcentered">
            <div class="column is-3">
                <div class="factory-info-box is-rounded">
                    <h3>Running</h3>
                    <p>Owned: {{ factory.owned | formatNumber }}</p>
                    <p>Upgrade at {{ factory.levelForNextUpgrade | formatNumber }}</p>
                </div>
            </div>
            <div class="column">
                <transition name="fade">
                    <div class="factory-buttons is-rounded" v-if="factory.owned">
                        <div class="factory-title-box is-rounded has-shadow" :class="titleBoxClass" v-on:click="run">
                            <div class="is-size-4 little-margin">
                                <span class="is-bold">{{ factory.data.name }}</span>
                            </div>
                            <progress class="progress is-primary factory-production-bar" :value="progress" max="100"
                              v-if="factory.running">{{progress}}%</progress>
                            <span class="is-bold" v-else>Not Running<br /></span>
                            <span class="little-margin">Revenue: {{ revenue }}</span>
                        </div>
                        <div class="columns is-mobile is-vcentered">
                            <div class="column is-8">
                                <button class="button big-button box is-full-width" :class="buyButtonClass" v-on:click="buy" :disabled="!canBuy">
                                    <div class="is-flex is-mobile is-size-5 buy-button-content">
                                        <div class="has-text-left">
                                            <span>Buy</span><br />
                                            <span>x {{ amountToBuy | formatNumber }}</span>
                                        </div>
                                        <div class="has-text-right">
                                            <span>{{ cost | formatCurrency}}</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div class="column">
                                <div class="tiny-box time-box is-rounded has-shadow is-size-5">
                                    <span>{{ timeLeft | formatTime }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="factory-buttons">
                        <button class="button big-button box is-full-width" :class="buyButtonClass" v-on:click="buy" :disabled="!canBuy">
                            <p class="is-size-3">Buy {{ factory.data.name }}</p>
                            <p class="is-size-5">{{ cost | formatCurrency}}</p>
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as MoneyStore from '@/store/modules/money';
import * as FactoryStore from '@/store/modules/factories';
import * as NotificationsStore from '@/store/modules/notifications';
import { timer } from '@/store/modules/timer';
import { BuyMode } from '@/interfaces/FactoryTypes';
import { formatCurrency } from '@/utils/NumberFormatters';
import { FactoryState } from '@/store/modules/FactoryState';
import store from '../store';

@Component
export default class FactoryWidget extends Vue {
    @Prop(String) public factoryId!: string;

    public factory!: FactoryState;

    public created() {
        this.factory = FactoryStore.findFactory(store.state.factories, this.factoryId);
    }

    public buy() {
        FactoryStore.mutations.buyFactory({
            factoryId: this.factoryId,
            amount: this.amountToBuy,
        });
    }

    public run() {
      if (!this.factory.running) {
        FactoryStore.mutations.runFactory(this.factoryId);
      }
    }

    get canBuy() {
        const amountToBuy = this.amountToBuy;
        if (amountToBuy === 0) {
            return false;
        }
        if (amountToBuy <= this.amountAvailable) {
            return true;
        }
        return false;
    }

    get cost() {
        return this.factory.costOfMultipleUpgrades(this.amountToBuy);
    }

    get amountToBuy() {
        let amountToBuy = 1;
        if (!this.factory.owned) {
            return amountToBuy;
        }
        switch (this.buyMode) {
            case 'ten':
                amountToBuy = 10;
                break;
            case 'next':
                amountToBuy = (this.nextUpgrade - this.factory.owned);
                break;
            case 'max':
                amountToBuy = this.amountAvailable;
                if (amountToBuy === 0) {
                    amountToBuy = 1;
                }
                break;
        }
        return amountToBuy;
    }

    get amountAvailable() {
        return this.factory.amountUpgradeable;
    }

    get nextUpgrade() {
        return this.factory.levelForNextUpgrade;
    }

    get money() {
        return MoneyStore.getters.currentMoney;
    }

    get buyMode(): BuyMode {
        return store.state.factories.buyMode;
    }

    get revenue(): string {
        if (this.factory.timeToTick >= 1) {
            return `${formatCurrency(this.factory.revenuePerTick)}`;
        } else {
            return `${formatCurrency(this.factory.revenuePerSecond)} /s`;
        }
    }

    get timeLeft(): number {
        if (!this.factory.running) {
            return this.factory.timeToTick;
        }
        return Math.floor(this.factory.timeToTick - (timer.time - this.factory.lastTick));
    }

    get buyButtonClass() {
        if (this.canBuy) {
            return 'can-buy';
        } else {
            return 'cant-buy';
        }
    }

    get progress(): number | undefined {
        return this.factory.progress;
    }

    get titleBoxClass() {
      if (this.factory.running) {
        return 'factory-title-running';
      } else {
        return 'factory-title-can-run';
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">



.factory-info-box {
    padding: 0.25rem;
    background-color: $scheme-main-ter;
}

.factory-title-box {
    padding: 0.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.factory-title-running {
    background-color: $blue-box;
}

.factory-title-can-run {
  background-color: $orange-box;
}

.tiny-box {
    padding: 0.2rem;
}

.buy-button {
    border-width: 0;
}

.factory-buttons {
    padding: 0.5rem;
    // border: 1px solid;
    // background-color: $scheme-main-bis;
}

.buy-button-content {
    justify-content: space-between;
}

.time-box {
    background-color: $scheme-main-ter;
    // background-color: white;
}

.little-margin {
    margin: 0.25rem;
}

.factory-production-bar {
    margin-bottom: 0.25rem !important;
}
</style>
