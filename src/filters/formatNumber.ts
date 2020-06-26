/** vue.js filter for easily formatting numbers directly in components */
import numeral from 'numeral';
import Vue from 'vue';
import { formatCurrency, formatNumber, formatTime } from '@/utils/NumberFormatters';

Vue.filter('formatCurrency', formatCurrency);

Vue.filter('formatNumber', formatNumber);

Vue.filter('formatTime', formatTime);
