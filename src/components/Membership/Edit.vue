<template>
    <v-row>
        <v-col>
            <v-select v-model="modelValue.userId" :readonly="readonly" :label="t('user')" :items="users"></v-select>
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
import { useI18n } from "vue-i18n"

const { t } = useI18n();
const props = defineProps({
    modelValue: Object,
    roles: Array,
    users: Array,
    readonly: Boolean
})
const emit = defineEmits(['remove'])
</script>