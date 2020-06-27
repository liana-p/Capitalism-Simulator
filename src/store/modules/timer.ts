import Vue from 'vue';
import { ITimeSave } from '@/interfaces/SaveTypes';

/** Hack to have reactive time that can be used in the store
 * without having to commit new mutations at a high framerate */
export const timer = new Vue({
    data: {
        time: 0,
        lastUpdate: Date.now() / 1000,
    },
});

let timeModifier = 1;
export function setTimeSpeed(speed: number) {
    timeModifier = speed;
}

export function createTimeSave(): ITimeSave {
    return {
        time: timer.time,
        lastUpdate: timer.lastUpdate,
    };
}

export function loadTimeSave(save: ITimeSave) {
    timer.time = save.time;
    timer.lastUpdate = save.lastUpdate;
}

export function updateTimer() {
  const now = Date.now() / 1000;
  const delta = now - timer.lastUpdate;
  const elapsedGameTime = delta * timeModifier;
  timer.time += elapsedGameTime;
  timer.lastUpdate = now;
}
