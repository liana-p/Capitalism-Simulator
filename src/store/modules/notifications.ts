/**
 * Part of the store containing notifications
 * Used to display notification toasts when the player achieves something
 */
import { storeBuilder } from '@/store/RootState';
import Vue from 'vue';
// state
export interface INotification {
    content: string;
    id: string;
}

export interface IShownNotification {
    notification: INotification;
    appearedAt: number;
}

/** Main state for the notification store */
export class NotificationState {
    public notificationsToShow: INotification[] = [];
    public currentNotification: IShownNotification | undefined;
}

const builder = storeBuilder.module<NotificationState>('notifications', new NotificationState());

// mutations

function addNotification(state: NotificationState, content: string) {
    state.notificationsToShow.push({
        content,
        // Quick UUID placeholder
        id: `${Math.floor(Math.random() * 10000)}-${Date.now()}`,
    });
    setTimeout(() => {
        state.notificationsToShow.splice(0, 1);
    }, 2000);
}

export const mutations = {
    addNotification: builder.commit(addNotification),
};
