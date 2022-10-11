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
            <v-btn @click="login">
                Login
            </v-btn>
            <v-btn :to="{ name: 'Register' }">
                Register
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    setup() {
        
    },
    data() {
        return {
            valid: false,
            credentials: {}
        }
    },
    methods: {
        login () {
            this.$api.login(this.credentials);
        }
    }
}
</script>