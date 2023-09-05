<template>
    <div>
        <v-card>
            <v-card-title>
                {{ t('segment') }}
            </v-card-title>
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
        <v-card>
            <v-card-subtitle class="d-flex justify-space-between align-center">
                <span>{{ t('exercises') }}</span>
                <span>
                    <v-btn @click="showSelectExercises = !showSelectExercises" icon="mdi-magnify" variant="text" color="black">
                        <v-icon v-if="!showSelectExercises">mdi-magnify</v-icon>
                        <v-icon v-else>mdi-magnify-close</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.search')"></v-tooltip>
                    </v-btn>
                    <v-btn @click="addNewExercise" icon="mdi-plus" variant="text" color="black">
                        <v-icon>mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.add')"></v-tooltip>
                    </v-btn>
                </span>
            </v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col>
                        <draggable v-model="segment.exercises" group="exercises" item-key="id">
                            <template #item="{ element }">
                                <exercise-drag :exercise="element" :tags="tags" @save="onSaveExercise"></exercise-drag>                     
                            </template>
                        </draggable>
                    </v-col>
                    <v-col cols="12" sm="6" v-show="(can('update', segment) || can('create', segment)) && showSelectExercises">
                        <draggable v-model="exercises" group="exercises" item-key="id">
                            <template #header>
                                <exercise-search v-show="showSelectExercises" v-model="search" @update:model-value="onSearch" subtitle="exercises"></exercise-search>
                            </template>
                            <template #item="{ element }">
                                <exercise-drag :exercise="element" :tags="tags" @save="onSaveExercise" @remove="getExercises"></exercise-drag>
                            </template>
                            <template #footer>
                                <v-pagination v-model="pageInfo.currentPage" :length="length" @update:modelValue="getExercises"></v-pagination>
                            </template>
                        </draggable>
                    </v-col>
                </v-row>
                
            </v-card-text>
        </v-card>
        
        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </div>
</template>

<script setup>
import ExerciseDrag from '@/components/Exercise/Drag.vue';
import ExerciseSearch from '@/components/Exercise/Search.vue';
import Sharebility from '@/components/common/Sharebility.vue';
import Draggable from 'vuedraggable';

import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useI18n } from 'vue-i18n';
import { useConfirmDialog } from '@vueuse/core';
import { inject, ref, computed } from 'vue';

import { getDefaultExercise } from '@/services/defaults.js';

const toast = useToast();
const { can } = useAbility();
const authStore = useAuthenticationStore();
const { t } = useI18n();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
const api = inject('api');

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
const search = ref({});
const showSelectExercises = ref(false);
const pageInfo = ref({
    currentPage: 1,
    itemsPerPage: 6,
    totalCount: 0
});

if (props.id) {
    api.getSegment(props.id)
        .then((data) => segment.value = data)
}

const getExercises = () => {
    loading.value.get = true;
    api.getAllExercises(search.value, pageInfo.value)
        .then(resp => {
            exercises.value = resp.data.items.filter(e => segment.value.exercises.findIndex(x => x.id === e.id) < 0);
            pageInfo.value.totalCount = resp.data.totalCount;
        })
        .finally(() => loading.value.get = false)
}
const save = () => {
    loading.save = true;
    if (!segment.value.id) {
        api.postSegment(segment.value)
            .then(resp => {
                segment.value.id = resp.data;
                emit('save', segment.value.id);
            })
            .catch(err => toast.error(err))
            .finally(() => loading.value.save = false);
    }
    else {
        api.putSegment(segment.value)
            .then(() => {
                emit('save', segment.value.id);
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
            })
            .finally(() => loading.value.remove = false);
    }
};
const addNewExercise = () => {
    exercises.value.unshift(getDefaultExercise(authStore.user.id));
}
const onSaveExercise = (exercise) => {
    exercise.dialog = false;
    exercise.edit = false;
    var index = segment.value.exercises.findIndex(e => e.id === exercise.id);
    console.log(exercise, exercise.id, index);
    if (index < 0){
        segment.value.exercises.push(exercise);
    }
    else {
        segment.value.exercises[index] = exercise;
    }
    getExercises();
}
const getTags = () => {
    api.getTags()
        .then(resp => tags.value = resp.data);
}
const onSearch = () => {
    pageInfo.value.currentPage = 1;
    getExercises();
}
getExercises();
getTags();

const length = computed(() => Math.ceil(pageInfo.value.totalCount / pageInfo.value.itemsPerPage));
</script>
