<template>
    <v-form>
        <v-card>
            <v-card-title>
                Welcome
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" label="Username"></v-text-field>
                <v-text-field v-model="user.email" label="Email"></v-text-field>
                <v-text-field v-model="user.password" label="Password" type="password"></v-text-field>

                <v-select v-model="user.groups" :items="availableGroups" multiple label="Groups"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register" :loading="loading">
                    Register
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
export default {
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
                .finally(() => this.loading = false);
        }
    }
}
</script>