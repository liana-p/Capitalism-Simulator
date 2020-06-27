<template>
    <div class="game">
        <factories-container />
    </div>
</template>

<script>
// @ is an alias to /src
import FactoriesContainer from '@/components/FactoriesContainer.vue';

export default {
    name: 'Game',
    components: {
        FactoriesContainer,
    },
};

</script>
<style scoped lang="scss">

</style>
