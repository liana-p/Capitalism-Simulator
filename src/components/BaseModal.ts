import { Component, Prop, Vue } from 'vue-property-decorator';
import * as ModalsStore from '@/store/modules/modals';

/** Base class for modals, contains props for accessing common data of all modals
 * Also contains a close function so classes extending it can easily close themselves
 */
export class BaseModal extends Vue {
    @Prop(String) public uuid!: string;
    @Prop(String) public name!: string;
    @Prop(Object) public options!: {
        [key: string]: any;
    };

    public close() {
        ModalsStore.mutations.deleteModal(this.uuid);
    }
}
