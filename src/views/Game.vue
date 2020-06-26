<template>
    <div class="game">
        <factories-container />
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import GameTopbar from '@/components/GameTopbar.vue';
import FactoriesContainer from '@/components/FactoriesContainer.vue';

export default {
    name: 'Game',
    components: {
        HelloWorld,
        GameTopbar,
        FactoriesContainer,
    },
};

</script>
<style scoped lang="scss">

</style>
