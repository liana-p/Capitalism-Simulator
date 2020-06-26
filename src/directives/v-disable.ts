/** Utility for disabling buttons based on a condition directly in templates */
import { Vue } from 'vue-property-decorator';

Vue.directive('disabled', {
    update: (el, binding) => {
        if (binding.value === true) {
            el.classList.add('disabled');
        } else {
            el.classList.remove('disabled');
        }
    },
});
