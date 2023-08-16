<template>
    <v-form>
        <v-card :loading="loading.save">
            <v-card-title>
                {{ t('profile') }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" :label="t('username')"></v-text-field>
                <v-text-field v-model="user.email" :label="t('email')"></v-text-field>

                <v-select v-model="user.memberships" :items="availableGroups" multiple :label="t('groups')"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="save" :loading="loading.save">
                    {{ t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { inject, ref } from 'vue';

const api = inject('api');
const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();

const loading = ref({ get: true, save: false });
const user = ref({});
const availableGroups = ref([]);

const save = () => {
    loading.value.save = true;
    api.putUser(user.value)
        .finally(() => loading.value.save = false);

}

api.getUser()
    .then(resp => user.value = resp.data)
    .finally(() => loading.value.get = false);

api.getAvailableGroups()
    .then(resp => availableGroups.value = resp.data);
</script>
