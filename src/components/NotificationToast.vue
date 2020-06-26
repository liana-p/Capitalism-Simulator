<template>
    <div class="notifications-container">
        <transition-group name="fade" tag="div">
            <div v-for="notification in state.notificationsToShow" :key="notification.id" class="notification has-shadow is-rounded">
                <p class="is-bold is-size-4">{{ notification.content }}</p>
            </div>
        </transition-group>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as NotificationStore from '@/store/modules/notifications';
import store from '../store';

@Component
export default class NotificationToast extends Vue {
    public get state() {
        return store.state.notifications;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.notifications-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    pointer-events: none;
    z-index: 999999;
}

.notification {
    padding: 0.15rem;
    margin: 0.25rem;
    background-color: white;
    width: 90%;
}
</style>
