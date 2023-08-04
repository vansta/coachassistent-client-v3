<template>
    <v-card>
        <v-card-title>
            <v-select v-model="modelValue.sharingLevel" :items="sharingLevels" label="Share with"></v-select>
        </v-card-title>
        <v-card-text>
            <v-select v-if="modelValue.sharingLevel == 1" multiple :items="groups" label="Groups"></v-select>
            <v-autocomplete v-model="modelValue.editors" multiple :items="editors" label="Editors"></v-autocomplete>
        </v-card-text>
    </v-card>
</template>

<script>
import { useAuthenticationStore } from '@/plugins/pinia.js';

export default {
    props: {
        modelValue: Object
    },
    setup() {
        const authenticationStore = useAuthenticationStore();

        return { authenticationStore }
    },
    mounted () {
        this.getSharingLevels();
        this.getGroups();
        this.getEditors();
        this.getAssignedEditors();
    },
    data () {
        return {
            sharingLevels: [],
            groups: [],
            editors: []
        }
    },
    methods: {
        getSharingLevels() {
            this.$api.getSharingLevels()
                .then(resp => this.sharingLevels = resp.data);
        },
        getGroups () {
            this.$api.getGroupsForUser()
                .then(resp => this.groups = resp.data);
        },
        getAssignedEditors() {
            if (this.modelValue.shareableId) {
                this.$api.getAssignedEditors(this.modelValue.shareableId)
                    .then(resp => this.modelValue.editors = resp.data);
            }
            else {
                this.modelValue.editors = [this.authenticationStore.user.id];
            }
        },
        getEditors () {
            this.$api.getEditors()
                .then(resp => this.editors = resp.data);
        }
    }
}
</script>

