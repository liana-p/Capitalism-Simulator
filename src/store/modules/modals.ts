/**
 * Part of the store that manages popups
 * Contains a list of modals that can display any component with arbitrary options
 * The modals themselves are displayed by the <ModalContainer>
 * and getting revenue from them.
 */

import { storeBuilder } from '@/store/RootState';
import Vue from 'vue';
import { IModal, IModalPayload } from '@/interfaces/ModalTypes';

// state
export class ModalState {
    public modals: {
        [key: string]: IModal;
    } = {};
}

const builder = storeBuilder.module<ModalState>('modals', new ModalState());

// getters
const modals = builder.read((state) => {
    return state.modals;
}, 'modal');

export const getters = {
    get modals() {
        return modals();
    },
};

// mutations

/** Adds a modal to the store, displaying it.
 * The title really shouldn't be hardcoded, but at the moment it is.
 */
function addModal(state: ModalState, payload: IModalPayload) {
    const uuid = `${Date.now()}-${Math.random() * 1000}`;
    const modal: IModal = Object.assign({
        uuid,
        addedAt: Date.now(),
    }, payload);
    Vue.set(state.modals, uuid, modal);
}

function deleteModal(state: ModalState, uuid: string) {
    Vue.delete(state.modals, uuid);
}
export const mutations = {
    addModal: builder.commit(addModal),
    deleteModal: builder.commit(deleteModal),
};
