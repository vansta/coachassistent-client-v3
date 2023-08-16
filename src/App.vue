<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Coach Assistent</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authenticationStore.isAuthenticated" :to="{ name: 'Login' }">{{ t('login') }}</v-btn>
      <div v-else class="d-flex">
        <v-chip class="flex-grow-1 mt-1 mr-4" :to="{ name: 'Profile', params: { id: authenticationStore.user.id } }" size="x-large" prepend-icon="mdi-account" color="primary" variant="outlined">{{ authenticationStore.user.name }}</v-chip>
        <v-btn icon="mdi-logout" @click="logout">
          <v-icon>mdi-logout</v-icon>
          <v-tooltip activator="parent" location="bottom" :text="t('logout')"></v-tooltip>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" rail expand-on-hover="">
      <v-list :items="filteredNavbar" nav></v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useAbility } from '@casl/vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const { can } = useAbility();
const router = useRouter();
const ability = useAbility();
import { buildRules } from '@/services/ability';

const api = inject('api');

const drawer = ref(true);
const navDrawerItems = ref([
      {
        title: t('drafts'),
        props: {
            prependIcon: 'mdi-home',
            to: { name: 'Home' }
        },
        meta: {
          action: 'read',
          subject: 'shareable'
        }
      },
      {
        title: t('trainings'),
        props: {
          prependIcon: 'mdi-checkbox-blank',
          to: { name: 'Trainings' }
        },
        meta: {
          action: 'read',
          subject: 'shareable'
        }
      },
      {
        title: t('segments'),
        props: {
          prependIcon: 'mdi-view-agenda',
          to: { name: 'Segments' }
        },
        meta: {
          action: 'read',
          subject: 'shareable'
        }
      },
      {
        title: t('exercises'),
        props: {
            prependIcon: 'mdi-view-module',
            to: { name: 'Exercises' }
        },
        meta: {
          action: 'read',
          subject: 'shareable'
        }
      },
      {
        title: t('administration'),
        props: {
          prependIcon: 'mdi-office-building'
        },
        children: [
        {
          title: t('groups'),
          props: {
              prependIcon: 'mdi-account-group',
              to: { name: 'Groups' }
          },
          meta: {
            action: 'read',
            subject: 'group'
          }
        },
        {
          title: t('roles'),
          props: {
              prependIcon: 'mdi-security',
              to: { name: 'Roles' }
          },
          meta: {
            action: 'read',
            subject: 'role'
          }
        }
        ]
      },
      
    ])

const logout = () => {
  authenticationStore.logout();
  router.push({ name: 'Login' });
}
const filterItems = (items) => {
  return items.filter(i => {
    if (i.children){
      i.children = filterItems(i.children);
      if (i.children.length === 0) {
        return false;
      }
    }
    if (i.meta) {
      return can(i.meta.action, i.meta.subject);
    }
    return true;
  })
}

const filteredNavbar = computed(() => filterItems(navDrawerItems.value));
api.getPermissions()
  .then(resp => {
    ability.update(buildRules(resp.data));
    authenticationStore.setPermissions(resp.data);
})
// setInterval(() => {
//   api.checkToken();
// }, 60000);
</script>
