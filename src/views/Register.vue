<template>
    <v-form>
        <v-card>
            <v-card-title>
                Welcome
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" label="Username"></v-text-field>
                <v-text-field v-model="user.email" label="Email"></v-text-field>
                <v-text-field v-model="user.password" label="Password"></v-text-field>

                <v-select v-model="user.groups" :items="availableGroups" multiple label="Groups"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register">
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
            user: {},
            availableGroups: []
        }
    },
    methods: {
        register() {
            this.apiService.register(this.user);
        }
    }
}
</script>