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

                <v-select v-model="user.groups" :items="availableGroups" multiple :label="t('groups')"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register" :loading="loading">
                    {{ t('register') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
export default {
    setup () {
        const authenticationStore = useAuthenticationStore();
        const toast = useToast();
        const { t } = useI18n();
        return { authenticationStore, toast, t }
    },
    data() {
        return {
            loading: false,
            user: {},
            availableGroups: []
        }
    },
    methods: {
        register() {
            this.loading = true;
            this.$api.register(this.user)
                .then(token => {
                    this.authenticationStore.login(token);
                    this.toast.success('Welcome');
                    this.$router.push({ name: 'Home' });
                })
                .finally(() => this.loading = false);
        }
    }
}
</script>