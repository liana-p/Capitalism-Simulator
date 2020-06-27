<template>
    <div class="managers-modal">
        <h3 class="subtitle">Investments never sleep!</h3>
        <p>While you were gone, your factories generated {{ moneyEarned | formatCurrency }}!</p>
        <button class="button is-big" v-on:click="close">Ok</button>
    </div>
</template>

<script lang="ts">

/** Popup that shows available managers and allows purchasing them */
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseModal } from '../BaseModal';

@Component
export default class OfflineSummaryModal extends BaseModal {
    @Prop(Number) public moneyEarned!: number;
}

</script>

<style scoped lang="scss">
</style>
