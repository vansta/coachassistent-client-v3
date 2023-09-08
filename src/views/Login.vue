<template>
    <v-card>
        <v-card-title>
            {{ t('welcome') }}
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="form" validate-on="blur">
                <v-text-field v-model="credentials.userName" :label="t('username')" :rules="[required]" prepend-icon="mdi-account-circle"></v-text-field>
                <v-text-field v-model="credentials.password" :label="t('password')" type="password" :rules="[required]" prepend-icon="mdi-lock"></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="login" :loading="loading" color="primary">
                <v-icon start>mdi-login</v-icon>
                {{ t('login') }}
            </v-btn>
            <v-btn :to="{ name: 'Register' }" color="secondary">
                <v-icon start>mdi-account-plus</v-icon>
                {{ t('register') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { buildRules } from '@/services/ability';
import { useI18n } from 'vue-i18n';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useValidation } from '@/services/validation.js';

const authenticationStore = useAuthenticationStore();
const toast = useToast();
const ability = useAbility();
const { t } = useI18n();
const { required } = useValidation(t);
const router = useRouter();

const api = inject('api');

const loading = ref(false);
const valid = ref(false);
const credentials = ref({});
const form = ref(null);

const login = async () => {
    await form.value.validate();
    if (valid.value){
        loading.value = true;
        api.login(credentials.value)
            .then(token => {
                getPermissions();
                authenticationStore.login(token);
                toast.success(t('welcome'));
                router.push({ name: 'Home' });
            })
            .finally(() => loading.value = false);
    }
}

const getPermissions = () => {
    api.getPermissions()
        .then(resp => {
            ability.update(buildRules(resp.data));
            authenticationStore.setPermissions(resp.data);
    })
}
</script>
