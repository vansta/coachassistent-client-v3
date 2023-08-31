<template>
    <v-container>
        <v-card v-for="(license, index) in licenses" :key="index" class="mb-2">
            <v-card-title class="d-flex">
                <div class="flex-grow-1">
                    {{ license.name }}
                    
                </div>
                <v-btn :icon="license.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="license.expand = !license.expand" variant="text"></v-btn>
            </v-card-title>
            <v-card-text>
                {{ license.description }}
            </v-card-text>
            <v-card-text v-if="license.expand">
                <permissions-overview :role="license" :permissions="license.licensePermissions" :actions="actions" :subjects="subjects"></permissions-overview>
            </v-card-text>
            <v-card-actions>
                <v-btn :disabled="!can('update', license)" @click="save(index)" :loading="loading.save"><v-icon start>mdi-content-save</v-icon>Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useAbility } from '@casl/vue';
import PermissionsOverview from '@/views/Permissions/Overview.vue'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const api = inject('api');
const { can } = useAbility();
const toast = useToast();
const { t } = useI18n();

const licenses = ref([]);
const actions = ref([]);
const subjects = ref([]);
const loading = ref({
    save: false
});

const getLicenses = () => {
    api.getLicensesOverview()
        .then(resp => licenses.value = resp.data.items);
};
const getActions = () => {
    api.getActions()
        .then(resp => actions.value = resp.data);
}
const getSubjects = () => {
    api.getSubjects()
        .then(resp => subjects.value = resp.data);
}
const save = (index) => {
    loading.value.save = true;
    api.putLicense(licenses.value[index])
        .then(() => toast.success(t('saved')))
        .finally(() => loading.value.save = false);
}

getLicenses();
getActions();
getSubjects();
</script>