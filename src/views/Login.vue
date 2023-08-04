<template>
    <v-card>
        <v-card-title>
            Welcome
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid">
                <v-text-field v-model="credentials.userName" label="Username"></v-text-field>
                <v-text-field v-model="credentials.password" label="Password" type="password"></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="login" :loading="loading">
                Login
            </v-btn>
            <v-btn :to="{ name: 'Register' }">
                Register
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { buildRules } from '@/services/ability';
export default {
    setup () {
        const authenticationStore = useAuthenticationStore();
        const toast = useToast();
        const ability = useAbility();
        return { authenticationStore, toast, ability }
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
                })
        }
    }
}
</script>