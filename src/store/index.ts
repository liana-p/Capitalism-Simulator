import Vue from 'vue';
import Vuex from 'vuex';
import './modules/money';
import './modules/factories';
import { storeBuilder } from './RootState';

Vue.use(Vuex);

export default storeBuilder.vuexStore();
