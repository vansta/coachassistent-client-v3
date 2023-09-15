<template>
    <v-card>
        <v-card-title>
            {{ t('reset_password') }}
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="form" validate-on="blur">
                <v-text-field v-model="userName" :label="t('username')" :rules="[required]" prepend-icon="mdi-account-circle"></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="secondary" @click="requestPasswordReset" :loading="loading">
                <v-icon start>mdi-lock-question</v-icon>
                {{ t('reset_password') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { inject, ref } from 'vue';
import { useValidation } from '@/services/validation.js';

const toast = useToast();
const { t } = useI18n();
const { required } = useValidation(t);

const api = inject('api');

const loading = ref(false);
const valid = ref(false);
const userName = ref(null);
const form = ref(null);

const requestPasswordReset = async () => {
    await form.value.validate();
    if (valid.value){
        loading.value = true;
        api.requestPasswordReset(userName.value)
            .then(() => {
                toast.success(t('password_reset_sent'));
            })
            .finally(() => loading.value = false);
    }
}
</script>
