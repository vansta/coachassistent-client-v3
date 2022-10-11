<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Coach Assistent</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authenticationStore.isAuthenticated" :to="{ name: 'Login' }">Login</v-btn>
      <span v-else>{{ authenticationStore.user.name }}</span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" rail expand-on-hover="">
      <v-list :items="navDrawerItems">
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useAuthenticationStore } from '@/plugins/pinia.js'

export default {
  name: 'App',
  setup () {
    const authenticationStore = useAuthenticationStore();

    return { authenticationStore }
  },

  data: () => ({
    drawer: true,
    navDrawerItems: [
      {
        title: 'Drafts',
        props: {
            prependIcon: 'mdi-home',
            to: { name: 'Home' }
        }
      },
      {
        title: 'Segments',
        props: {
          prependIcon: 'mdi-view-agenda',
          to: { name: 'Segments' }
        }
      },
      {
        title: 'Exercises',
        props: {
            prependIcon: 'mdi-view-module',
            to: { name: 'Exercises' }
        }
      }
    ]
  }),
}
</script>
