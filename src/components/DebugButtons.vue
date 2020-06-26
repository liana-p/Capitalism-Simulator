<template>
    <div class="debug-buttons">
        <button class="is-warn" v-on:click="$emit('reset')">Reset</button>
        <button class="is-success" v-on:click="cheat">Speed x{{ speedCheat }}</button>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { setTimeSpeed } from '@/store/modules/timer';

@Component
export default class DebugButtons extends Vue {
    public speedCheat = 1;

    public cheat() {
        this.speedCheat *= 10;
        if (this.speedCheat > 100) {
            this.speedCheat = 1;
        }
        setTimeSpeed(this.speedCheat);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.debug-buttons {
    position: fixed;
    bottom: 3rem;
    left: 0;
    display: flex;
}
</style>
