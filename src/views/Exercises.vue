<template>
    <c-data-iterator
        :items="exercises"
        :cols="4"
        :loading="loading"
    >
        <template #header>
            <div class="d-flex justify-end">
                <v-btn @click="addRow" color="primary">Add exercise</v-btn>
            </div>
        </template>
        <template #item="{ item }">
            <exercise-view v-if="!item.edit" :exercise="item" @click="editRow(item)"></exercise-view>
            <exercise-edit v-else :exercise="item" @save="saveRow(item)" @remove="removeRow(item)"></exercise-edit>
        </template>
    </c-data-iterator>
</template>

<script>
import CDataIterator from '@/components/common/CDataIterator.vue';
import ExerciseView from '@/components/Exercise/View.vue'
import ExerciseEdit from '@/components/Exercise/Edit.vue'

export default {
    components: {
        CDataIterator,
        ExerciseEdit,
        ExerciseView
    },
    created () {
        this.getExercises();
    },
    data() {
        return {
            exercises: [],
            loading: false
        }
    },
    methods: {
        getExercises () {
            this.loading = true;
            this.$api.getAllExercises()
                .then((data) => this.exercises = data.items)
                .then(() => this.loading = false);
        },
        editRow (row) {
            row.edit = true;
        },
        saveRow (row) {
            row.edit = false;
            this.getExercises();
        },
        addRow () {
            this.exercises.push({
                id: '',
                name: '',
                description: '',
                edit: true,
                attachments: []
            })
        },
        removeRow() {
            this.getExercises();
        }
    }
}
</script>