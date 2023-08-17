<template>
    <v-form>
        <v-card>
            <v-card-title>
                {{ t('welcome') }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" :label="t('username')"></v-text-field>
                <v-text-field v-model="user.email" :label="t('email')"></v-text-field>
                <v-text-field v-model="user.password" :label="t('password')" type="password"></v-text-field>

                <v-autocomplete v-model="user.groupIds" :items="availableGroups" multiple :label="t('request_membership')" chips></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register" :loading="loading">
                    {{ t('register') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const api = inject('api');

const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const loading = ref(false);
const user = ref({});
const availableGroups = ref([]);

const register = () => {
    loading.value = true;
    api.register(user.value)
        .then(token => {
            authenticationStore.login(token);
            toast.success(t('welcome'));
            router.push({ name: 'Home' });
        })
        .finally(() => loading.value = false);
}

api.getAvailableGroups()
    .then(resp => availableGroups.value = resp.data);
</script>
