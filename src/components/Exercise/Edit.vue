<template>
    <layout>
        <template #name>
            <div class="d-flex">
                <v-text-field class="flex-grow-1" v-model="editExercise.name" :label="t('field.name')"></v-text-field>
                <!-- <v-btn icon="mdi-open-in-new" flat round :to="{ name: 'EditExercise', params: { id: editExercise.id } }"></v-btn> -->
                <v-btn v-if="mode == 'edit'" :disabled="!(can('update', editExercise, 'shareability') || can('create', editExercise, 'shareability'))" icon variant="text" @click="showSharebility = !showSharebility">
                    <v-icon>mdi-cog</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.shareability')"></v-tooltip>
                </v-btn>
                <v-btn :disabled="!(can('update', editExercise) || can('create', editExercise))" icon="mdi-content-save" round @click="save" variant="text" :loading="loading.save">
                    <v-icon>mdi-content-save</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.save')"></v-tooltip>
                </v-btn>
                <v-btn v-if="editExercise.id && mode == 'edit'" :disabled="!can('delete', editExercise)" icon="mdi-delete" color="negative" round @click="onRemove" variant="text" :loading="loading.remove">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
                <v-btn icon="mdi-cancel" @click="onCancel" flat variant="text">
                    <v-icon>mdi-cancel</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.cancel')"></v-tooltip>
                </v-btn>
            </div>
        </template>
        <template #description>
            <!-- <editor v-model="editExercise.description" api-key="no-api-key"/> -->
            <quill-editor v-if="(can('update', editExercise, 'description') || can('create', editExercise, 'description'))" v-model:content="editExercise.description" theme="snow" contentType="html" :placeholder="t('field.description')" style="min-height: 120px;"></quill-editor>
            <div v-else v-html="editExercise.description"></div>

            <v-row no-gutters dense>
                <v-col cols="12" sm="6">
                    <v-combobox v-model="editExercise.tags" :label="t('field.tags')" :items="tags" multiple chips class="mt-3" hide-details="auto" prepend-icon="mdi-tag"></v-combobox>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-select v-model="editExercise.level" :label="t('field.level')" :items="levels" class="mt-3" :item-title="(option) => t(`level.${option.title}`)" hide-details="auto" prepend-icon="mdi-star-settings"></v-select>
                </v-col>
            </v-row>

            <attachment-selector v-model="editExercise" :readonly="!(can('update', editExercise, 'attachments') || can('create', editExercise, 'attachments'))"></attachment-selector>
            
            <sharebility v-if="showSharebility" v-model="editExercise"></sharebility>
        </template>

        
    </layout>
    <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    
</template>

<script setup>
import { inject, ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import Layout from '@/components/Exercise/Layout.vue';
import Sharebility from '@/components/common/Sharebility.vue';
import AttachmentSelector from '@/components/Attachment/Selector.vue';

import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
import { useConfirmDialog } from '@vueuse/core';
import { levels } from '@/services/defaults.js';

const toast = useToast();
const { can } = useAbility();
const { t } = useI18n();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const api = inject('api');

const props = defineProps({
    exercise: Object,
    tags: Array,
    mode: {
        type: String,
        default: 'edit'
    }
})
const emit = defineEmits(['save', 'remove', 'cancel'])
const editExercise = ref({
    ...props.exercise, 
    selectedAttachments: props.exercise.attachments
})

const showSharebility = ref(false);
const loading = ref({
    save: false,
    remove: false
});

const save = () => {
    loading.value.save = true;
    if (!editExercise.value.id) {
        api.postExercise(editExercise.value)
            .then(resp => {
                editExercise.value.id = resp;
                emit('save', editExercise.value);
            })
            .catch(err => {
                        toast.error(err)
            })
            .finally(() => loading.value.save = false);
    }
    else {
        api.putExercise(editExercise.value)
            .then(() => emit('save', editExercise.value))
            .finally(() => loading.value.save = false);
    }
}

const onRemove = async () => {
    const { data } = await reveal();
    if (data) {
        loading.value.remove = true;
        api.deleteExercise(editExercise.value.id)
            .then(() => emit('remove'))
            .finally(() => loading.value.remove = false);
    }
}

const onCancel = () => {
    if (editExercise.value.id) {
        emit('cancel');
    }
    else {
        emit('remove');
    }
}
</script>
