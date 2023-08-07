<template>
    <v-container>
        <v-card v-for="(role, index) in roles" :key="index" class="mb-2">
            <v-card-title class="d-flex">
                <div class="flex-grow-1">
                    {{ role.name }}
                    
                </div>
                <v-btn :icon="role.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="role.expand = !role.expand" variant="text"></v-btn>
            </v-card-title>
            <v-card-text>
                {{ role.description }}
            </v-card-text>
            <v-card-text v-if="role.expand">
                <permissions-overview :permissions="role.rolePermissions" :actions="actions" :subjects="subjects"></permissions-overview>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="save(index)"><v-icon start>mdi-content-save</v-icon>Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import PermissionsOverview from '../Permissions/Overview.vue'
export default {
    components: {
        PermissionsOverview
    },
    setup() {
        
    },
    mounted() {
        this.getRoles();
        this.getActions();
        this.getSubjects();
    },
    data () {
        return {
            roles: [],
            actions: [],
            subjects: []
        }
    },
    methods: {
        getRoles () {
            this.$api.getRolesOverview()
                .then(resp => this.roles = resp.data.items);
        },
        getActions() {
            this.$api.getActions()
                .then(resp => this.actions = resp.data);
        },
        getSubjects() {
            this.$api.getSubjects()
                .then(resp => this.subjects = resp.data);
        },
        save (index) {
            this.$api.putRole(this.roles[index]);
        }

        // getFields(subjectId) {
        //     var subjectIndex = this.subjects.findIndex(s => s.id === subjectId);
        //     var subject = this.subjects[subjectIndex]
        //     return subject ? subject.fields : [];
        // }
    }
}
</script>