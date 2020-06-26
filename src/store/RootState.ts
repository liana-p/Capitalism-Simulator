/** Full state of the app stored in VueX
 * Comprised of individual modules to make code easier to maintain */

import { getStoreBuilder } from 'vuex-typex';
import { MoneyState } from './modules/money';
import { ModalState } from './modules/modals';
import { NotificationState } from './modules/notifications';
import { UpgradesState } from './modules/upgrades';
import { FactoriesState } from './modules/factories';

export interface RootState {
    money: MoneyState;
    factories: FactoriesState;
    modals: ModalState;
    notifications: NotificationState;
    upgrades: UpgradesState;
}

export const storeBuilder = getStoreBuilder<RootState>();
