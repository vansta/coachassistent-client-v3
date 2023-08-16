<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-form>
                    <div class="d-flex">
                        <v-text-field v-model="group.name" :readonly="!can(action, group, 'name')" :label="t('field.name')" class="flex-grow-1"></v-text-field>
                        <v-btn v-if="can(action, group)" icon="mdi-content-save" flat round @click="save" :loading="loading.save"></v-btn>
                    </div>
                    
                    <v-text-field v-model="group.description" :readonly="!can(action, group, 'description')" :label="t('field.description')"></v-text-field>
                    <v-select v-model="group.tags" :readonly="!can(action, group, 'tags')" :label="t('field.tags')" :items="tags" multiple></v-select>
                </v-form>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                {{ t('members') }}
            </v-card-title>
            <v-card-text>
                <v-row v-for="(member, index) in group.members" :key="index">
                    <v-col>
                        <edit-membership v-model="group.members[index]" :readonly="!can(action, group, 'members')" :roles="roles" :users="users" @delete="onDeleteRow(index)"></edit-membership>
                    </v-col>
                </v-row>
                <v-row v-if="can(action, group, 'members')">
                    <v-col>
                        <v-btn block @click="addMember">Add</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import EditMembership from '@/components/Membership/Edit.vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
export default {
    components: {
        EditMembership
    },
    setup() {
        const authenticationStore = useAuthenticationStore();
        const { can } = useAbility();
        const { t } = useI18n();

    return { authenticationStore, can, t }
    },
    props: {
        id: [Number, String]
    },
    mounted() {
        this.getGroup();
        this.getTags();
        this.getRoles();
        this.getUsers();
    },
    data () {
        return {
            group: {
                constructor: { modelName: 'group' },
                members: [
                    {  }
                ]
            },
            tags: [],
            roles: [],
            users: [],
            action: 'create',
            loading: {
                save: false
            }
        }
    },
    methods: {
        getGroup () {
            if (this.id) {
                this.action = 'update';
                this.$api.getGroup(this.id)
                    .then(resp => this.group = resp.data);
            }
        },
        getTags() {
            this.$api.getTags()
                .then(resp => this.tags = resp.data);
        },
        getRoles() {
            this.$api.getRoles()
                .then(resp => this.roles = resp.data);
        },
        //TODO filter for group
        getUsers() {
            this.$api.getEditors()
                .then(resp => this.users = resp.data);
        },

        addMember() {
            this.group.members.push({ })
        },

        onDeleteRow (index) {
            this.group.members.splice(index, 1);
        },

        save() {
            this.loading.save = true;
            if (this.group.id) {
                this.$api.putGroup(this.group)
                    .finally(() => this.loading.save = false);
            }
            else {
                this.$api.postGroup(this.group)
                    .then(resp => this.$router.push({ name: 'EditGroup', params: { id: resp.data }}))
                    .finally(() => this.loading.save = false);
            }
        }
    }
}
</script>