<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-form>
                    <div class="d-flex">
                        <v-text-field :readonly="!can('update', group, 'name')" v-model="group.name" label="Name" class="flex-grow-1"></v-text-field>
                        <v-btn icon="mdi-content-save" flat round @click="save"></v-btn>
                    </div>
                    
                    <v-text-field v-model="group.description" label="Description"></v-text-field>
                    <v-select v-model="group.tags" label="Tags" :items="tags" multiple></v-select>
                </v-form>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                Members
            </v-card-title>
            <v-card-text>
                <v-row v-for="(member, index) in group.members" :key="index">
                    <v-col>
                        <edit-membership v-model="group.members[index]" :roles="roles" :users="users" @delete="onDeleteRow(index)"></edit-membership>
                    </v-col>
                </v-row>
                <v-row>
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
export default {
    components: {
        EditMembership
    },
    setup() {
        const authenticationStore = useAuthenticationStore();
        const { can } = useAbility();

    return { authenticationStore, can }
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
                members: [
                    {  }
                ]
            },
            tags: [],
            roles: [],
            users: []
        }
    },
    methods: {
        getGroup () {
            if (this.id) {
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
            if (this.group.id) {
                this.$api.putGroup(this.group);
            }
            else {
                this.$api.postGroup(this.group)
                .then(resp => this.$router.push({ name: 'EditGroup', params: { id: resp.data }}));
            }
        }
    }
}
</script>