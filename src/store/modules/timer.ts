import Vue from 'vue';

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

export function createTimeSave() {
    return timer.time;
}

export function loadTimeSave(time: number) {
    timer.time = time;
    timer.lastUpdate = Date.now() / 1000;
}

export function updateTimer() {
  const now = Date.now() / 1000;
  const delta = now - timer.lastUpdate;
  const elapsedGameTime = delta * timeModifier;
  timer.time += elapsedGameTime;
  timer.lastUpdate = now;
}
