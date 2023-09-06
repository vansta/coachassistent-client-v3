<template>
    <v-form v-model="valid" ref="form">
        <v-row>
            <v-col>
                <v-text-field v-model="modelValue.userName" readonly :label="t('user')" :rules="[required]"></v-text-field>
            </v-col>
            <v-col>
                <v-select v-model="modelValue.roleId" :readonly="readonly" :label="t('role')" :items="roles" :rules="[required]"></v-select>
            </v-col>
            <v-col cols="2">
                <div class="d-flex justify-end">
                    <v-btn icon="mdi-check" color="negative" flat round @click="accept"></v-btn>
                    <v-btn icon="mdi-cancel" color="negative" flat round @click="decline"></v-btn>
                </div>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup>
import { ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import { useValidation } from '@/services/validation.js';

const api = inject('api');
const { t } = useI18n();
const { required } = useValidation(t);

const props = defineProps({
    modelValue: Object,
    roles: Array,
    users: Array,
    readonly: Boolean
})
const emit = defineEmits(['onAccept']);
const valid = ref(true);
const form = ref(null);
const decline = async () => {
    await api.putMembershipRequest(props.modelValue, false);
    emit('onAccept');
}
const accept = async () => {
    await form.value.validate();
    if (valid.value) {
        await api.putMembershipRequest(props.modelValue, true);
        emit('onAccept');
    }
}
</script>