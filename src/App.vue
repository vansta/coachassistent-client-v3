<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Coach Assistent</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authenticationStore.isAuthenticated" :to="{ name: 'Login' }">Login</v-btn>
      <div v-else class="d-flex">
        <v-chip class="flex-grow-1">{{ authenticationStore.user.name }}</v-chip>
        <v-btn icon="mdi-logout" @click="logout"></v-btn>
      </div>
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
import { useAuthenticationStore } from '@/plugins/pinia.js';

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
        title: 'Trainings',
        props: {
          prependIcon: 'mdi-checkbox-blank',
          to: { name: 'Trainings' }
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
      },
      {
        title: 'Create group',
        props: {
            prependIcon: 'mdi-account-group',
            to: { name: 'CreateGroup' }
        }
      }
    ]
  }),
  methods: {
    logout() {
      this.authenticationStore.logout();
      this.$router.push({ name: 'Login' });
    },
  }
}
</script>
