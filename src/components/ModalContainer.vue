<template>
    <transition name="fade">
        <div class="modal is-active is-clipped">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="modal-container">
                    <div class="container-box">
                        <div class="modal-title-area">
                            <span class="is-bold is-size-4">{{ modal.title }}</span>
                            <button class="is-large" aria-label="close" v-on:click="close">x</button>
                        </div>
                        <!-- This is the magic that allows us to display any component dynamically for modals -->
                        <component v-bind="modal" :is="modal.name" />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IModal } from '@/interfaces/ModalTypes';
import * as ModalsStore from '@/store/modules/modals';
import * as UpgradesStore from '@/store/modules/upgrades';

// Modals
import ManagersModal from '@/components/modals/ManagersModal.vue';
import UpgradesModal from '@/components/modals/UpgradesModal.vue';

@Component({
    components: {
        ManagersModal,
        UpgradesModal,
    },
})
export default class ModalContainer extends Vue {
    @Prop() public modal!: IModal;

    public created() {
        /** Little hack to pass modal options as actual props
         * by pushing them to the top level of the object to make it flat */
        Object.assign(this.modal, this.modal.options);
    }
    public close() {
        ModalsStore.mutations.deleteModal(this.modal.uuid);
    }
}


</script>

<style lang="scss">
.modal-container {
    margin: 0 1rem 0 1rem;
}
.modal-title-area {
    display: flex;
    justify-content: space-between;
}

.container-box {
    background-color: $scheme-main-bis;
    border-radius: 0.5rem;
    padding: 0.5rem;
}
</style>
