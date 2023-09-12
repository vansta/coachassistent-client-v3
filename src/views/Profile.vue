<template>
    <v-form v-model="valid" ref="form" validate-on="blur">
        <v-system-bar window>
            <v-chip>
                <v-icon icon="mdi-account" class="mr-3"></v-icon>
                {{ user.userName }}
            </v-chip>
            <v-spacer></v-spacer>
            <span>{{ user.email }}</span>
            <v-btn @click="save" :loading="loading.save" icon="mdi-content-save" variant="text" class="ms-2"></v-btn>
        </v-system-bar>
        <v-card :loading="loading.save">
            <v-card-text>
                <!-- <v-text-field v-model="user.userName" :label="t('username')" readonly></v-text-field> -->
                <v-text-field v-model="user.email" :label="t('email')" :rules="[required, email]" prepend-icon="mdi-email"></v-text-field>
            </v-card-text>
            <v-card-subtitle>
                {{ t('preferences') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-combobox v-model="user.tags" :label="t('field.tags')" :items="tags" multiple chips class="mt-3" hide-details="auto" prepend-icon="mdi-tag" clearable></v-combobox>
            </v-card-text>
            <v-card-subtitle>
                {{ t('groups') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th>{{ t('subject.group') }}</th>
                            <th>{{ t('subject.role') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(membership, index) in user.memberships" :key="index">
                            <td>{{ membership.group }}</td>
                            <td v-if="membership.id">{{ membership.role }}</td>
                            <td v-else>
                                {{ t('requested') }}
                                <v-tooltip activator="parent" location="bottom">{{ t('membership_requested') }}</v-tooltip>
                            </td>
                            <td class="d-flex justify-end">
                                <v-btn v-if="membership.id" icon="mdi-eye" variant="text" :to="{ name: 'EditGroup', params: { id: membership.groupId }}">
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent">{{ t('tooltip.view') }}</v-tooltip>
                                </v-btn>
                                <v-btn v-if="membership.id" icon="mdi-logout" variant="text" @click="leaveGroup(index)">
                                    <v-icon>mdi-exit-run</v-icon>
                                    <v-tooltip activator="parent">{{ t('tooltip.leave_group') }}</v-tooltip>
                                </v-btn>
                                <span v-if="!membership.id">
                                    <v-progress-circular indeterminate size="30" class="ma-3" width="3"></v-progress-circular>
                                    <v-tooltip activator="parent" location="bottom">{{ t('membership_requested') }}</v-tooltip>
                                </span>
                                
                            </td>
                        </tr>
                    </tbody>
                    <template #bottom>
                        <v-autocomplete v-model="groupId" :items="availableGroups" :label="t('request_membership')" @update:modelValue="addMembership" :loading="loading.addMembership" @update:search="getAvailableGroups" prepend-icon="mdi-account-group"></v-autocomplete>
                    </template>
                </v-table>
            </v-card-text>
            <v-card-actions>
                
                <v-btn @click="save" :loading="loading.save" color="primary">
                    <v-icon start>mdi-content-save</v-icon>
                    {{ t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-form>
</template>

<script setup>
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { computed, inject, ref } from 'vue';
import { useConfirmDialog } from '@vueuse/core';
import { useValidation } from '@/services/validation.js';

const api = inject('api');
const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
const { required, email } = useValidation(t);

const loading = ref({ get: true, save: false, addMembership: false });
const user = ref({
    memberships: []
});
const groups = ref([]);
const tags = ref([]);
const valid = ref(false);
const form = ref(null);
const groupId = ref(null);

const save = async () => {
    await form.value.validate();
    if (!valid.value){
        return;
    }

    loading.value.save = true;
    await api.putUser(user.value);
    loading.value.save = false;
    toast.success(t('saved'));

    var { data } = await api.refreshToken();
    authenticationStore.login(data);
}

const getUser = () => {
    api.getUser()
        .then(resp => user.value = resp.data)
        .finally(() => loading.value.get = false);
}

var timeout;
const getAvailableGroups = (input) => {
    clearTimeout(timeout);
    if (input && input.length > 3){
        timeout = setTimeout(() => {
            api.getAvailableGroups(input)
                .then(resp => groups.value = resp.data);
        }, 300);
    }
}

const leaveGroup = async (index) =>{
    const { data } = await reveal();
    if (data) {
        user.value.memberships.splice(index, 1);
    }
}
const addMembership = async (value) => {
    loading.value.addMembership = true;
    await api.requestMembership(value);
    loading.value.addMembership = false;
    toast.success(t('membership_requested'));
    groupId.value = null;
    getUser();
}

const availableGroups = computed(() => {
    return groups.value.filter(g => !user.value.memberships.map(ms => ms.groupId).includes(g.value));
})

getUser();
api.getTags()
    .then(resp => tags.value = resp.data);
</script>
