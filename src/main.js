import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { loadFonts } from './plugins/webfontloader'
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

loadFonts()

import { abilitiesPlugin } from '@casl/vue';
import ability from '@/services/ability';

const Vue = createApp(App)
  .use(vuetify)
  .use(abilitiesPlugin, ability);


import { pinia, useAuthenticationStore } from '@/plugins/pinia.js';
  Vue.use(pinia);

Vue
  .use(router);

import api from '@/plugins/apiplugin.js';
  Vue.use(api, { useAuthenticationStore });

Vue.use(Toast, {
  position: POSITION.BOTTOM_CENTER
})

import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
Vue.component('confirm-dialog', ConfirmDialog);

Vue
  .mount('#app');
