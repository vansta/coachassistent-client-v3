<template>
    <v-container>
        <v-system-bar window>
            
            <v-chip>
                <v-icon class="mr-3">mdi-account-group</v-icon>
                {{ group.name }}
            </v-chip>
            <v-chip v-if="parentGroup.name" class="ml-2" @click="goToParent">
                <v-icon class="mr-3">mdi-account-network</v-icon>
                {{ parentGroup.name }}
                <v-tooltip activator="parent" location="bottom" :text="parentGroup.description"></v-tooltip>
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn v-if="can(action, group)" icon="mdi-content-save" variant="text" round @click="save" :loading="loading.save"></v-btn>
        </v-system-bar>
        <v-card>
            <v-card-title v-if="!group.id">
                {{ t('create_new_group') }}
            </v-card-title>
            <v-card-text>
                <v-form>
                    <div class="d-flex">
                        <v-text-field v-model="group.name" :readonly="!can(action, group, 'name')" :label="t('field.name')" class="flex-grow-1"></v-text-field>
                        <!-- <v-btn v-if="can(action, group)" icon="mdi-content-save" flat round @click="save" :loading="loading.save"></v-btn> -->
                    </div>
                    
                    <v-text-field v-model="group.description" :readonly="!can(action, group, 'description')" :label="t('field.description')"></v-text-field>
                    <v-select v-model="group.tags" :readonly="!can(action, group, 'tags')" :label="t('field.tags')" :items="tags" multiple chips prepend-icon="mdi-tag"></v-select>
                </v-form>
            </v-card-text>
            <v-card-subtitle>
                {{ t('members') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-row v-for="(member, index) in group.members" :key="index">
                    <v-col>
                        <edit-membership v-model="group.members[index]" :readonly="!can(action, group, 'member')" :roles="roles" :members="members" @remove="onDeleteRow(index)"></edit-membership>
                    </v-col>
                </v-row>
                <v-row v-if="can(action, group, 'member')">
                    <v-col>
                        <v-btn block @click="addMember">{{ t('add') }}</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-subtitle v-if="can('update', group, 'member')">
                {{ t('membership_requests') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text v-if="can('update', group, 'member')">
                <v-row v-for="(member, index) in group.membershipRequests" :key="index">
                    <v-col>
                        <edit-membership-request v-model="group.membershipRequests[index]" :roles="roles" @onAccept="getGroup"></edit-membership-request>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-subtitle v-if="can('update', group, 'subgroup')">
                {{ t('field.subgroup') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text v-if="can('update', group, 'subgroup')">
                <v-table>
                    <thead>
                        <tr>
                            <td>
                                {{ t('field.name') }}
                            </td>
                            <td>
                                {{ t('field.description') }}
                            </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(subgroup, index) in group.subGroups" :key="index">
                            <td>{{ subgroup.name }}</td>
                            <td>{{ subgroup.description }}</td>
                            <td class="d-flex justify-end">
                                <v-btn icon="mdi-pencil" variant="text" @click="editSubGroup(subgroup)"></v-btn>
                                <v-btn icon="mdi-delete" variant="text" @click="group.subGroups.splice(index, 1)"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                    <template #bottom v-if="can('update', group, 'subgroup')">
                        <v-select :label="t('add_existing_group')" :items="availableGroups" hide-details="auto" @update:modelValue="onGroupSelect" return-object>
                            <template #prepend>
                                <v-btn icon @click="addSubGroup" color="primary">
                                    <v-icon>mdi-plus</v-icon>
                                    <v-tooltip activator="parent" location="bottom" :text="t('create_new_group')"></v-tooltip>
                                </v-btn>
                            </template>
                        </v-select>
                    </template>
                </v-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import EditMembership from '@/components/Membership/Edit.vue';
import EditMembershipRequest from '@/components/Membership/Request.vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { getDefaultGroup } from '@/services/defaults';

const authenticationStore = useAuthenticationStore();
const { can } = useAbility();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const api = inject('api');
const toast = useToast();

const props = defineProps({
    id: [Number, String],
    parentGroupId: [Number, String]
});

const group = ref(props.id ? {} : getDefaultGroup(authenticationStore.user.id, props.parentGroupId));
const tags = ref([]);
const roles = ref([]);
const members = ref([]);
const action = ref('create');
const loading = ref({ save: false });
const groups = ref([]);
const parentGroup = ref({});

api.getTags()
    .then(resp => tags.value = resp.data);
if (props.id){
    api.getMembersForGroup(props.id)
        .then(({ data }) => members.value = data);
}
else {
    members.value = [{ value: authenticationStore.user.id, title: authenticationStore.user.name }]
}
api.getRoles()
    .then(resp => roles.value = resp.data);
api.getAvailableGroups('', 'update')
    .then(resp => groups.value = resp.data);

const getGroup = async () => {
    var { data } = await api.getGroup(props.id);
    group.value = data;
    if (data.parentGroupId) {
        getParentGroup(data.parentGroupId);
    }
}
const addMember = () => {
    group.value.members.push({});
}
const onDeleteRow = (index) => {
    group.value.members.splice(index, 1);
}
const save = async () => {
    loading.value.save = true;
    if (props.id) {
        await api.putGroup(group.value);
    }
    else {
        const { data } = await api.postGroup(group.value);
        router.push({ name: 'EditGroup', params: { id: data }});
    }
    loading.value.save = false;
    toast.success(t('saved'))
}

const addSubGroup = async () => {
    await router.push({ name: 'CreateGroup', params: { parentGroupId: group.value.id }});
    router.go(0);
}
const editSubGroup = async (subgroup) => {
    await router.push({ name: 'EditGroup', params: { id: subgroup.id }});
    router.go(0);
}
const onGroupSelect = (value) => {
    group.value.subGroups.push({
        id: value.value,
        name: value.title
    });
}
const getParentGroup = (id) => {
    api.getGroupMinimal(id)
        .then(({ data }) => parentGroup.value = data);
}
const goToParent = async () => {
    await router.push({ name: 'EditGroup', params: { id: parentGroup.value.id }});
    router.go(0);
}
if (props.id) {
    action.value = 'update';
    getGroup();
}
else if (props.parentGroupId){
    getParentGroup(props.parentGroupId);
}

if (props.parentGroupId || group.value.parentGroupId) {
    api.getGroupMinimal(props.parentGroupId ?? group.value.parentGroupId)
        .then(({ data }) => parentGroup.value = data);
}

const availableGroups = computed(() => {
    return groups.value.filter(g => !group.value.subGroups.map(sg => sg.id).includes(g.value));
})
</script>
