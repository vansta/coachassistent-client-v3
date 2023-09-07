<template>
    <v-row>
        <v-col>
            <v-autocomplete v-model="modelValue.userId" :readonly="readonly" :label="t('user')" :items="availableUsers" @update:search="getUsers"></v-autocomplete>
        </v-col>
        <v-col>
            <v-select v-model="modelValue.roleId" :readonly="readonly" :label="t('role')" :items="roles"></v-select>
        </v-col>
        <v-col cols="1">
            <v-btn v-if="!readonly" icon="mdi-delete" color="negative" flat round @click="$emit('remove')"></v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { inject, ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
    modelValue: Object,
    roles: Array,
    members: Array,
    readonly: Boolean
})
const emit = defineEmits(['remove'])
const api = inject('api');

const users = ref([]);

var searchTimeOut;
const getUsers = (value) => {
    clearTimeout(searchTimeOut);
    if (value && value.length >= 3){
        searchTimeOut = setTimeout(() => {
            api.searchUsers(value)
                .then(resp => users.value = resp.data);
        }, 300);
    }
}

const distinct = (value, index, self) => {
    return self.findIndex(s => s.title == value.title) === index;
}
const availableUsers = computed(() => {
    return [...props.members, ...users.value].filter(distinct);
})
</script>