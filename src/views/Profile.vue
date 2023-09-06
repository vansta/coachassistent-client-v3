<template>
    <v-form>
        <v-card :loading="loading.save">
            <v-card-title>
                {{ t('profile') }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" :label="t('username')"></v-text-field>
                <v-text-field v-model="user.email" :label="t('email')"></v-text-field>
            </v-card-text>
            <v-card-subtitle>
                {{ t('groups') }}
            </v-card-subtitle>
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
                            <td>{{ membership.id ? membership.role : t('requested') }}</td>
                            <td class="d-flex justify-end">
                                <v-btn v-if="membership.id" icon="mdi-eye" variant="text" :to="{ name: 'EditGroup', params: { id: membership.groupId }}">
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent">{{ t('tooltip.view') }}</v-tooltip>
                                </v-btn>
                                <v-btn v-if="membership.id" icon="mdi-logout" variant="text" @click="leaveGroup(index)">
                                    <v-icon>mdi-exit-run</v-icon>
                                    <v-tooltip activator="parent">{{ t('tooltip.leave_group') }}</v-tooltip>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-row>
                    <v-col>
                        <v-autocomplete :items="availableGroups" :label="t('request_membership')" @update:modelValue="addMembership" :loading="loading.addMembership" @update:search="getAvailableGroups"></v-autocomplete>
                    </v-col>
                </v-row>
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

const api = inject('api');
const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const loading = ref({ get: true, save: false, addMembership: false });
const user = ref({
    memberships: []
});
const groups = ref([]);

const save = async () => {
    loading.value.save = true;
    await api.putUser(user.value);
    loading.value.save = false;
    toast.success(t('saved'));
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
    getUser();
}

const availableGroups = computed(() => {
    return groups.value.filter(g => !user.value.memberships.map(ms => ms.groupId).includes(g.value));
})

getUser();
</script>
