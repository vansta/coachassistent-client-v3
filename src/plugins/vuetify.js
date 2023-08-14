// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/lib/util/colors'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    defaults: {
      VTextField: {
          variant: 'outlined',
          density: 'compact'
      },
      VSelect: {
          variant: 'outlined',
          density: 'compact'
      },
      VFileInput: {
          variant: 'outlined',
          density: 'compact'
      },
      VAutocomplete: {
        variant: 'outlined',
        density: 'compact'
      }
  },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: colors.blue.darken1
          }
        }
      }
    }
  }
)
