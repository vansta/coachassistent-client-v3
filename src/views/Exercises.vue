<template>
    <c-data-iterator
        :items="exercises"
        :cols="4"
    >
        <template #header>
            <v-spacer></v-spacer>
            <v-btn @click="addRow">Add exercise</v-btn>
        </template>
        <template #item="{ item }">
            <exercise-view v-if="!item.edit" class="q-ma-xs" :exercise="item" @click="editRow(item)"></exercise-view>
            <exercise-edit v-else class="q-ma-xs" :exercise="item" @save="saveRow(item)" @remove="removeRow(item)"></exercise-edit>
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
            exercises: [
                {
                    id: '1',
                    name: 'test',
                    description: 'test description',
                    attachments: []
                },
                {
                    id: '2',
                    name: 'test',
                    attachments: []
                },
                {
                    id: '3',
                    name: 'test',
                    attachments: []
                },
                {
                    id: '4',
                    name: 'test',
                    attachments: []
                },
                {
                    id: '5',
                    name: 'test',
                    attachments: []
                },
                {
                    id: '6',
                    name: 'test',
                    attachments: []
                }
            ]
        }
    },
    methods: {
        getExercises () {
            this.$api.getAllExercises()
                .then((data) => this.exercises = data.items)
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