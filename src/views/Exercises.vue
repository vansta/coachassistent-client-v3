<template>
    <div>
        <c-data-iterator
            :items="exercises"
            :cols="12 / Math.floor(width / 500)"
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
                <exercise-view v-if="!item.edit" :exercise="item" @edit="editRow(item)" @copy="onCopy"></exercise-view>
                <exercise-edit v-else :exercise="item" @save="saveRow(item)" @remove="removeRow(item)" @cancel="item.edit = false" :tags="tags"></exercise-edit>
            </template>
        </c-data-iterator>
    </div>
    
</template>

<script>
import CDataIterator from '@/components/common/CDataIterator.vue';
import ExerciseView from '@/components/Exercise/View.vue'
import ExerciseEdit from '@/components/Exercise/Edit.vue'
import Search from '@/components/Exercise/Search.vue';
import { useAuthenticationStore } from '@/plugins/pinia';
import { useWindowSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useAbility } from '@casl/vue';

export default {
    components: {
    CDataIterator,
    ExerciseEdit,
    ExerciseView,
    Search
},
    created () {
        this.getExercises();
        this.getTags();
    },
    setup() {
        const authStore = useAuthenticationStore();
        const { width } = useWindowSize();
        const { t } =useI18n();
        const { can } = useAbility();

        return { authStore, width, t, can };
    },
    data() {
        return {
            exercises: [],
            tags: [],
            loading: false,
            totalCount: 0
        }
    },
    methods: {
        getTags() {
            this.$api.getTags()
                .then(resp => this.tags = resp.data);
        },

        getExercises (search) {
            this.loading = true;
            this.$api.getAllExercises(search ?? {})
                .then(resp => {
                    this.exercises = resp.data.items;
                    this.totalCount = resp.data.totalCount;
                })
                .finally(() => this.loading = false);
        },
        editRow (row) {
            row.edit = true;
        },
        saveRow (row) {
            row.edit = false;
            this.getExercises();
            this.getTags();
        },
        addRow () {
            this.exercises.push({
                id: '',
                name: '',
                description: '',
                edit: true,
                attachments: [],
                editorIds: [this.authStore.user.id],
                constructor: { modelName: 'shareable' }
            })
        },
        removeRow() {
            this.getExercises();
        },
        onCopy(id) {
            this.$api.getExercise(id)
                .then(resp => {
                    var copy = resp.data;
                    copy.edit = true;
                    this.exercises.unshift(copy);
                });
            
        }
    }
}
</script>