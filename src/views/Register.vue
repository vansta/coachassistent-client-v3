<template>
    <v-form v-model="valid" ref="form" validate-on="blur">
        <v-card>
            <v-card-title>
                {{ t('welcome') }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" :label="t('username')" :rules="[required, unique]" validate-on="input" prepend-icon="mdi-account-circle"></v-text-field>
                <v-text-field v-model="user.email" :label="t('email')" :rules="[required, email]" prepend-icon="mdi-email"></v-text-field>
                <v-text-field v-model="user.password" :label="t('password')" type="password" :rules="[required, password]" prepend-icon="mdi-lock"></v-text-field>
            </v-card-text>
            <v-card-subtitle>
                {{ t('request_membership') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-switch v-model="newGroup" :label="t('register_with_new_group')" color="primary"></v-switch>
                <div v-show="!newGroup">
                    <v-autocomplete v-model="user.groupIds" :items="availableGroups" multiple :label="t('request_membership')" chips @update:search="getAvailableGroups" prepend-icon="mdi-account-group"></v-autocomplete>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register" :loading="loading" color="primary">
                    <v-icon start>mdi-account-plus</v-icon>
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
import { useValidation } from '@/services/validation.js';

const api = inject('api');

const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();
const { required, email, password } = useValidation(t);
const router = useRouter();

const loading = ref(false);
const user = ref({});
const availableGroups = ref([]);
const newGroup = ref(false);
const valid = ref(true);
const form = ref(null);

const register = async () => {
    await form.value.validate();
    if (!valid.value){
        return;
    }
    loading.value = true;
    api.register(user.value)
        .then(token => {
            authenticationStore.login(token);
            toast.success(t('welcome'));
            if (newGroup.value){
                router.push({ name: 'CreateGroup' });    
            }
            else{
                router.push({ name: 'Home' });
            }
        })
        .finally(() => loading.value = false);
}

var timeout;
const getAvailableGroups = (input) => {
    clearTimeout(timeout);
    if (input && input.length > 3){
        timeout = setTimeout(() => {
            api.getAvailableGroups(input)
                .then(resp => availableGroups.value = resp.data);
        }, 300);
    }
}

const unique = async (value) => {
    var { data } = await api.checkUserName(value);
    return data || t('validate.username.unique');
}
</script>
