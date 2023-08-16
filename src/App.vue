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
      <v-list :items="filteredNavbar" nav></v-list>
      <!-- <v-list>
        <div v-for="(item, index) in navDrawerItems" :key="index">
          <v-list-item :prepend-icon=""
        </div>
      </v-list> -->
      <!-- <v-list>
        <v-list-item prepend-icon="mdi-checkbox-blank" title="Trainings" :to="{ name: 'Trainings' }"></v-list-item>
        <v-list-item prepend-icon="mdi-view-agenda" title="Segments" :to="{ name: 'Segments' }"></v-list-item>
        <v-list-item prepend-icon="mdi-view-module" title="Exercises" :to="{ name: 'Exercises' }"></v-list-item>

        <v-list-group value="Administration">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Administration"
            ></v-list-item>
          </template>
          <v-list-item v-if="can('read', 'group')" prepend-icon="mdi-account-group" title="Groups" :to="{ name: 'Groups' }"></v-list-item>
          <v-list-item v-if="can('read', 'role')" prepend-icon="mdi-security" title="Roles" :to="{ name: 'Roles' }"></v-list-item>
        </v-list-group>
      </v-list> -->
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useAbility } from '@casl/vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const { can } = useAbility();
const router = useRouter();

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
</script>
