<template>
    <div>
        <c-data-iterator
            :items="exercises"
            :cols="width > 500 ? 12 / Math.floor(width / 500) : 1"
            :loading="loading"
            :totalCount="totalCount"
        >
            <template #header>
                <div class="d-flex justify-end">
                    <v-btn @click="addRow" color="primary" :disabled="!can('create', 'shareable')" prepend-icon="mdi-plus">{{t('action.create')}}</v-btn>
                </div>
            </template>
            <template #search>
                <search @search="getExercises"></search>
            </template>
            <template #item="{ item }">
                <exercise-view v-if="!item.edit" :exercise="item" @edit="item.edit = true" @copy="onCopy"></exercise-view>
                <exercise-edit v-else :exercise="item" @save="saveRow(item)" @remove="getExercises" @cancel="item.edit = false" :tags="tags"></exercise-edit>
            </template>
        </c-data-iterator>
    </div>
    
</template>

<script setup>
import CDataIterator from '@/components/common/CDataIterator.vue';
import ExerciseView from '@/components/Exercise/View.vue'
import ExerciseEdit from '@/components/Exercise/Edit.vue'
import Search from '@/components/Exercise/Search.vue';
import { useAuthenticationStore } from '@/plugins/pinia';
import { useWindowSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useAbility } from '@casl/vue';
import { ref, inject } from 'vue';

const authStore = useAuthenticationStore();
const { width } = useWindowSize();
const { t } =useI18n();
const { can } = useAbility();
const api = inject('api');

const exercises = ref([]);
const tags = ref([]);
const loading = ref(false);
const totalCount = ref(0);

const getTags = () => {
    api.getTags()
        .then(resp => tags.value = resp.data);
}

const getExercises = (search) => {
    loading.value = true;
    api.getAllExercises(search ?? {})
        .then(({ data }) => {
            exercises.value = data.items;
            totalCount.value = data.totalCount;
        })
        .finally(() => loading.value = false);
}

const saveRow = (row) => {
    row.edit = false;
    getExercises();
    getTags();
}

const addRow = () => {
    exercises.value.unshift({
        id: '',
        name: '',
        description: '',
        edit: true,
        attachments: [],
        editorIds: [authStore.user.id],
        constructor: { modelName: 'shareable' }
    })
}

const onCopy = (id) => {
    api.getExercise(id)
        .then(resp => {
            var copy = resp.data;
            copy.edit = true;
            exercises.value.unshift(copy);
        });
}

getTags();
getExercises();
</script>
