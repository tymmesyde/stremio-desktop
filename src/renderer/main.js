import { createApp } from 'vue';
import App from './App.vue';
import Ionicons from './plugins/ionicons';

createApp(App)
    .use(Ionicons)
    .mount('#app');
