import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#C59D5F',
        secondary: '#6B3FA0',
        accent: '#2E2A24',
      }
    }
  }
})