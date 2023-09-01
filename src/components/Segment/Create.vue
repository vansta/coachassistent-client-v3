<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="segment.name" :label="t('field.name')" :readonly="!(can('update', segment, 'name') || can('create', segment, 'name'))"></v-text-field>
                    </div>
                    <v-btn :disabled="!(can('update', segment, 'shareability') || can('create', segment, 'shareability'))" icon="mdi-cog" variant="text" @click="showSharebility = !showSharebility">
                        <v-icon>mdi-cog</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.shareability')"></v-tooltip>
                    </v-btn>
                    <v-btn :disabled="!(can('update', segment) || can('create', segment))" icon="mdi-content-save" variant="text" @click="save" :loading="loading.save">
                        <v-icon>mdi-content-save</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.save')"></v-tooltip>
                    </v-btn>
                    <v-btn v-if="segment.id" :disabled="!can('delete', segment)" icon="mdi-delete" color="negative" variant="text" @click="remove" :loading="loading.remove">
                        <v-icon>mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                    </v-btn>
                </div>
                
            </v-card-title>
            <v-card-text>
                <quill-editor v-if="(can('update', segment, 'description') || can('create', segment, 'description'))" v-model:content="segment.description" theme="snow" contentType="html" :placeholder="t('field.description')"></quill-editor>
                <div v-else v-html="segment.description"></div>

                <v-combobox v-model="segment.tags" :label="t('field.tags')" :items="tags" multiple chips class="mt-3"></v-combobox>
            </v-card-text>
            <v-card-text v-if="showSharebility">
                <sharebility v-model="segment"></sharebility>
            </v-card-text>
        </v-card>
        <v-row>
            <v-col>
                <draggable v-model="segment.exercises" group="exercises" item-key="id">
                    <template #header>
                        <v-alert type="info" variant="tonal">
                            {{ t('drag_to') }}
                        </v-alert>
                    </template>
                    <template #item="{ element }">
                        <exercise-view v-if="!element.edit" :exercise="element" mode="select" @edit="element.edit = true"></exercise-view>
                        <exercise-edit v-else :exercise="element" mode="select" @save="onSaveExercise(element)" @cancel="element.edit = false" :tags="tags"></exercise-edit>
                    </template>
                </draggable>
            </v-col>
            <v-col cols="4" v-show="(can('update', segment) || can('create', segment))">
                <draggable v-model="exercises" group="exercises" item-key="id">
                    <template #header>
                        <v-alert variant="tonal">{{ t('drag_from') }}</v-alert>
                        <exercise-search @search="getExercises"></exercise-search>
                    </template>
                    <template #item="{ element }">
                        <exercise-view v-if="!element.edit" :exercise="element" mode="select" @edit="element.edit = true"></exercise-view>
                        <exercise-edit v-else :exercise="element" mode="select" @save="onSaveExercise(element)" @cancel="element.edit = false" :tags="tags"></exercise-edit>
                    </template>
                </draggable>
            </v-col>
        </v-row>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </div>
</template>

<script setup>
import ExerciseView from '@/components/Exercise/View.vue';
import ExerciseEdit from '@/components/Exercise/Edit.vue';
import ExerciseSearch from '@/components/Exercise/Search.vue';
import Sharebility from '@/components/common/Sharebility.vue';
import Draggable from 'vuedraggable';

import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useI18n } from 'vue-i18n';
import { useConfirmDialog } from '@vueuse/core';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast();
const { can } = useAbility();
const authStore = useAuthenticationStore();
const { t } = useI18n();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
const api = inject('api');
const router = useRouter();

const props = defineProps({
    id: String
});
const emit = defineEmits(['save', 'remove']);

const segment = ref({
    id: '',
    name: '',
    description: '',
    exercises: [],
    editorIds: [authStore.user?.id],
    constructor: { modelName: 'shareable' },
    sharingLevel: '0'
});
const exercises = ref([]);
const tags = ref([]);
const loading = ref({
    get: false,
    save: false,
    remove: false
});
const showSharebility = ref(false);

if (props.id) {
    api.getSegment(props.id)
        .then((data) => segment.value = data)
}

const getExercises = (search) => {
    loading.value.get = true;
    api.getAllExercises(search ?? {})
        .then(resp => exercises.value = resp.data.items.filter(e => segment.value.exercises.findIndex(x => x.id === e.id) < 0))
        .finally(() => loading.value.get = false)
}
const save = () => {
    loading.save = true;
    if (!segment.value.id) {
        api.postSegment(segment.value)
            .then(resp => {
                segment.value.id = resp.data;
                emit('save', segment.value.id);
                // router.push({ name: 'Segments' })
            })
            .catch(err => toast.error(err))
            .finally(() => loading.value.save = false);
    }
    else {
        api.putSegment(segment.value)
            .then(() => {
                emit('save', segment.value.id);
                // router.push({ name: 'Segments' })
            })
            .catch(err => toast.error(err))
            .finally(() => loading.value.save = false);
    }
};
const remove = async () => {
    const { data } = await reveal();
    if (data) {
        loading.value.remove = true;
        api.deleteSegment(segment.value.id)
            .then(() => {
                emit('remove');
                // router.push({ name: 'Segments' });
            })
            .finally(() => loading.value.remove = false);
    }
};
const onSaveExercise = (exercise) => {
    exercise.edit = false;
    getExercises();
}
const getTags = () => {
    api.getTags()
        .then(resp => tags.value = resp.data);
}
getExercises();
getTags();
</script>
