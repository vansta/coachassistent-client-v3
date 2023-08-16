<template>
    <v-card>
        <v-card-title>
            {{ t('welcome') }}
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid">
                <v-text-field v-model="credentials.userName" :label="t('username')"></v-text-field>
                <v-text-field v-model="credentials.password" :label="t('password')" type="password"></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="login" :loading="loading">
                {{ t('login') }}
            </v-btn>
            <v-btn :to="{ name: 'Register' }">
                {{ t('register') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { buildRules } from '@/services/ability';
import { useI18n } from 'vue-i18n';
export default {
    setup () {
        const authenticationStore = useAuthenticationStore();
        const toast = useToast();
        const ability = useAbility();
        const { t } = useI18n();
        return { authenticationStore, toast, ability, t }
    },
    data() {
        return {
            loading: false,
            valid: false,
            credentials: {}
        }
    },
    methods: {
        login () {
            this.loading = true;
            this.$api.login(this.credentials)
                .then(token => {
                    this.getPermissions();
                    this.authenticationStore.login(token);
                    this.toast.success('Welcome');
                    this.$router.push({ name: 'Home' });
                })
                .finally(() => this.loading = false);
        },

        getPermissions() {
            this.$api.getPermissions()
                .then(resp => {
                    console.log(buildRules(resp.data));
                    this.ability.update(buildRules(resp.data));
                    this.authenticationStore.setPermissions(resp.data);
                })
        }
    }
}
</script>