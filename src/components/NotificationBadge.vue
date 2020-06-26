<template>
    <div class="notification-badge">
        <span class="notification-amount">{{ amount }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NotificationBadge extends Vue {
    @Prop(Number) public amount!: number;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

$size: 20px;
.notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1rem;
    margin-top: -$size / 2;
    margin-right: -$size / 2;
    width: $size;
    height: $size;
    background-color: red;
    color: white;
    border-radius: 99999999rem;
}
</style>
