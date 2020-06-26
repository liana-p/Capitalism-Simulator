<template>
    <div class="factories-container">
        <factory-widget v-for="factory in visibleFactories" :factoryId="factory.data.id" :key="factory.data.id" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as FactoryStore from '@/store/modules/factories';
import FactoryWidget from '@/components/FactoryWidget.vue';
import { BuyMode } from '@/interfaces/FactoryTypes';
import store from '../store';

const DISTANCE_TO_SEE_FACTORIES = 5;

@Component({
    components: {
        FactoryWidget,
    },
})
export default class FactoriesContainer extends Vue {

    get factories() {
        return store.state.factories.factories;
    }

    get visibleFactories() {
        return this.factories.filter((factory, index) => {
            if (index < DISTANCE_TO_SEE_FACTORIES) {
                return true;
            } else {
                return this.factories[index - DISTANCE_TO_SEE_FACTORIES].owned;
            }
        });
    }
}
</script>

<style scoped lang="scss">

.buy-mode-button {
    right: 0;
    text-align: right;
}
</style>
