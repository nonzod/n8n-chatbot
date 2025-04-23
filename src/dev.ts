// File di sviluppo per testare il componente durante lo sviluppo
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// Crea l'app e montala sul DOM
const app = createApp(App);
app.mount('#app');

// Esporta l'app per eventuali utilizzi in altri file
export default app;