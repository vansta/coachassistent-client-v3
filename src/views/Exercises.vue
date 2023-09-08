<template>
    <div>
        <c-data-iterator
            v-model="pageInfo"
            :items="exercises"
            :cols="width > 500 ? 12 / Math.floor(width / 500) : 1"
            @update:model-value="getExercises"
        >
            <template #search>
                <search v-model="search" @update:model-value="onSearch"></search>
            </template>
            <template #item="{ item }">
                <exercise-view v-if="!item.edit" :exercise="item" @edit="item.edit = true" @copy="onCopy"></exercise-view>
                <exercise-edit v-else :exercise="item" @save="saveRow(item)" @remove="getExercises" @cancel="item.edit = false" :tags="tags"></exercise-edit>
            </template>
        </c-data-iterator>

        <v-btn @click="addRow" color="primary" :disabled="!(authStore.isAuthenticated && can('create', 'shareable'))" icon="mdi-plus" position="fixed" location="bottom right" class="ma-2 ma-md-6" size="large">
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="left" :text="t('tooltip.add')"></v-tooltip>
        </v-btn>
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
import { getDefaultExercise, getDefaultSearch } from '@/services/defaults.js';

const authStore = useAuthenticationStore();
const { width } = useWindowSize();
const { t } =useI18n();
const { can } = useAbility();
const api = inject('api');

const exercises = ref([]);
const tags = ref([]);
const search = ref(getDefaultSearch(authStore.user));
const pageInfo = ref({ itemsPerPage: 6, currentPage: 1, totalCount: 0, loading: false });

const getTags = () => {
    api.getTags()
        .then(resp => tags.value = resp.data);
}

const getExercises = () => {
    pageInfo.value.loading = true;
    api.getAllExercises(search.value, pageInfo.value)
        .then(({ data }) => {
            exercises.value = data.items;
            pageInfo.value.totalCount = data.totalCount;
        })
        .finally(() => pageInfo.value.loading = false);
}

const saveRow = (row) => {
    row.edit = false;
    getExercises();
    getTags();
}

const addRow = () => {
    exercises.value.unshift(getDefaultExercise(authStore.user.id));
}

const onCopy = (id) => {
    api.getExercise(id)
        .then(resp => {
            var copy = resp.data;
            copy.edit = true;
            exercises.value.unshift(copy);
        });
}
const onSearch = () => {
    pageInfo.value.currentPage = 1;
    getExercises();
}

getTags();
getExercises();
</script>
