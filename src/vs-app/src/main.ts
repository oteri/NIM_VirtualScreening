// import './assets/main.css'
import './assets/index.css'


import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')

declare global {
    interface Window {
        RDKit: RDKitModule
    }
}
window.initRDKitModule()
.then((instance: RDKitModule) => {
    // window.RDKit is loaded and will be typed as RDKitModule
    window.RDKit = instance;
    return instance;
})