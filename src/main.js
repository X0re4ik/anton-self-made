import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import './styles/base.css'

// флаг «JS жив» — CSS прячет контент только при нём.
// В кривых webview (VS Code и пр.) сайт всё равно останется читаемым.
document.documentElement.classList.add('js')

createApp(App).directive('reveal', vReveal).mount('#app')
