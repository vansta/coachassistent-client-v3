<template>
    <v-row>
        <v-col>
            <v-text-field v-model="modelValue.userName" readonly :label="t('user')"></v-text-field>
        </v-col>
        <v-col>
            <v-select v-model="modelValue.roleId" :readonly="readonly" :label="t('role')" :items="roles"></v-select>
        </v-col>
        <v-col cols="2">
            <div class="d-flex justify-end">
                <v-btn icon="mdi-check" color="negative" flat round @click="accept"></v-btn>
                <v-btn icon="mdi-cancel" color="negative" flat round @click="decline"></v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
import { inject } from "vue";
import { useI18n } from "vue-i18n"
const api = inject('api');
const { t } = useI18n();
const props = defineProps({
    modelValue: Object,
    roles: Array,
    users: Array,
    readonly: Boolean
})
const emit = defineEmits(['onAccept'])
const decline = async () => {
    await api.putMembershipRequest(props.modelValue, false);
    emit('onAccept');
}
const accept = async () => {
    await api.putMembershipRequest(props.modelValue, true);
    emit('onAccept');
}
</script>