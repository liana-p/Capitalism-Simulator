<template>
<div id="app">
        <game-topbar />
        <div class="game-screen">
            <game />
        </div>
        <debug-buttons v-on:reset="resetGame"/>
        <notification-toast />
        <game-bottom-bar />
        <modal-container v-for="modal in modals" :key="modal.uuid" :modal="modal" />
    </div>
</template>

<script lang="ts">
/** Main component driving the game */

import { Component, Prop, Vue } from 'vue-property-decorator';
import { createTimeSave, loadTimeSave, timer, updateTimer } from '@/store/modules/timer';
import { IGameSave } from '@/interfaces/SaveTypes';

// Store modules
import * as FactoriesStore from '@/store/modules/factories';
import * as MoneyStore from '@/store/modules/money';
import * as ModalsStore from '@/store/modules/modals';
import * as UpgradesStore from '@/store/modules/upgrades';
// Components
import Game from '@/views/Game.vue';
import DebugButtons from '@/components/DebugButtons.vue';
import NotificationToast from '@/components/NotificationToast.vue';
import GameTopbar from '@/components/GameTopbar.vue';
import GameBottomBar from '@/components/GameBottomBar.vue';
import ModalContainer from '@/components/ModalContainer.vue';


const SAVE_SLOT = 'game-save';

@Component({
    components: {
        Game,
        DebugButtons,
        NotificationToast,
        GameTopbar,
        GameBottomBar,
        ModalContainer,
    },
})
export default class App extends Vue {

    // "game loop" to update money gain from factories at a reasonable framerate
    public animationFrameRequest!: number;
    public created() {
        this.loadGame();
        this.gameLoop();
    }

    public gameLoop() {
        const timeBefore = timer.time;
        const moneyBefore = MoneyStore.getters.currentMoney;
        updateTimer();
        const newTime = timer.time;
        FactoriesStore.mutations.updateFactoriesProduction();
        const newMoney = MoneyStore.getters.currentMoney;
        this.saveGame();
        // Only show the away earnings summary screen if offline for more than 5 minutes
        if (newTime - timeBefore >= 1 && newMoney > moneyBefore) {
            this.showAwayEarningsSummary(newMoney - moneyBefore);
        }
        this.animationFrameRequest = window.requestAnimationFrame(() => {
            this.gameLoop();
        });
    }

    public showAwayEarningsSummary(money: number) {
        ModalsStore.mutations.addModal({
            name: 'offline-summary-modal',
            title: 'Offline Earnings',
            options: {
                moneyEarned: money,
            },
        });
    }

    /** debug tool to restart the game from scratch */
    public resetGame() {
        window.cancelAnimationFrame(this.animationFrameRequest);
        localStorage.clear();
        window.location.reload();
    }

    public saveGame() {
        const factories = FactoriesStore.getters.factorySave;
        const money = MoneyStore.getters.moneySave;
        const upgrades = UpgradesStore.getters.upgradesSave;
        const save: IGameSave = {
            factories,
            money,
            time: createTimeSave(),
            upgrades,
        };
        localStorage.setItem(SAVE_SLOT, JSON.stringify(save));
    }

    public loadGame(): boolean {
        const saveString = localStorage.getItem(SAVE_SLOT);
        if (saveString !== null) {
            const save = JSON.parse(saveString) as IGameSave;
            loadTimeSave(save.time);
            FactoriesStore.mutations.loadSave(save.factories);
            // Load order important: Upgrades will act on factories during loading
            UpgradesStore.mutations.loadSave(save.upgrades);
            MoneyStore.mutations.loadSave(save.money);
            return true;
        }
        return false;
    }

    public get modals() {
        return ModalsStore.getters.modals;
    }
}


</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

.game-topbar {
    position: fixed;
    opacity: 0.8;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}
.game-bottom-bar {
    position: fixed;
    opacity: 0.8;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}
.game-screen {
    margin-top: 6rem;
    margin-bottom: 5rem;
}

</style>
