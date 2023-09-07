<template>
    <v-card>
        <v-card-title>
            <v-select v-model="modelValue.sharingLevel" :items="sharingLevels" :label="t('field.shareability')" :item-title="(option) => t(`sharingLevel.${option.value}`)" prepend-icon="mdi-share-all"></v-select>
        </v-card-title>
        <v-card-text>
            <v-select v-if="modelValue.sharingLevel == 1" v-model="modelValue.groupIds" multiple :items="groups" :label="t('groups')" chips prepend-icon="mdi-account-group"></v-select>
            <v-autocomplete v-model="modelValue.editors" multiple :items="editors" :label="t('editors')" chips prepend-icon="mdi-account-wrench"></v-autocomplete>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useI18n } from 'vue-i18n';
import { ref, inject } from 'vue';
const authenticationStore = useAuthenticationStore();
const { t } = useI18n();
const api = inject('api');
const props = defineProps({
    modelValue: Object
})

const sharingLevels = ref([]);
const groups = ref([]);
const editors = ref([]);

api.getSharingLevels()
    .then(resp => sharingLevels.value = resp.data);

api.getGroupsForUser()
    .then(resp => groups.value = resp.data);

if (props.modelValue.shareableId) {
    api.getAssignedEditors(props.modelValue.shareableId)
        .then(resp => props.modelValue.editors = resp.data);
}
else {
    props.modelValue.editors = [authenticationStore.user.id];
}

api.getEditors()
    .then(resp => editors.value = resp.data);
</script>
