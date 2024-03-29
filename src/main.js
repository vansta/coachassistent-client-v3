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
  .use(abilitiesPlugin, ability);


import { pinia, useAuthenticationStore } from '@/plugins/pinia.js';
  Vue.use(pinia);

Vue
  .use(router);

import api from '@/plugins/apiplugin.js';
Vue.use(api, { useAuthenticationStore });

Vue.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true
})

import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
Vue.component('confirm-dialog', ConfirmDialog);

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
Vue.component('quill-editor', QuillEditor);

import { messages } from '../public/translations';
import { createI18n } from 'vue-i18n';
const i18n = createI18n({
  legacy: false,
  locale: 'nl',
  messages: messages
});
Vue.use(i18n);
Vue.use(vuetify);

import VueKonva from 'vue-konva';
Vue.use(VueKonva);

Vue
  .mount('#app');
