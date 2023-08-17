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
                <permissions-overview :role="role" :permissions="role.rolePermissions" :actions="actions" :subjects="subjects"></permissions-overview>
            </v-card-text>
            <v-card-actions>
                <v-btn :disabled="!can('update', role)" @click="save(index)" :loading="loading.save"><v-icon start>mdi-content-save</v-icon>Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { useAbility } from '@casl/vue';
import PermissionsOverview from '@/views/Permissions/Overview.vue'
import { useToast } from 'vue-toastification';

export default {
    components: {
        PermissionsOverview
    },
    setup() {
        const { can } = useAbility();
        const toast = useToast();
        return {
            can, toast
        }
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
            subjects: [],
            loading: {
                save: false
            }
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
            this.loading.save = true;
            this.$api.putRole(this.roles[index])
                .then(() => this.toast.success(t('saved')))
                .finally(() => this.loading.save = false);
        }

        // getFields(subjectId) {
        //     var subjectIndex = this.subjects.findIndex(s => s.id === subjectId);
        //     var subject = this.subjects[subjectIndex]
        //     return subject ? subject.fields : [];
        // }
    }
}
</script>