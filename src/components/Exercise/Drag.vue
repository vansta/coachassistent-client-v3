<template>
    <v-card>
        <v-card-text class="d-flex justify-space-between">
            {{ exercise.name }}
            <v-btn icon variant="text" @click="exercise.dialog = !exercise.dialog">
                <v-icon>mdi-eye</v-icon>
            </v-btn>
        </v-card-text>

        <v-dialog v-model="exercise.dialog">
            <exercise-view v-if="!exercise.edit" :exercise="exercise" @edit="exercise.edit = true"></exercise-view>
            <exercise-edit v-else :exercise="exercise" @save="onSave" @cancel="onCancel" @remove="onRemove" :tags="tags"></exercise-edit>
        </v-dialog>
    </v-card>
</template>

<script setup>
import ExerciseView from '@/components/Exercise/View.vue';
import ExerciseEdit from '@/components/Exercise/Edit.vue';
// import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const props = defineProps({
    exercise: {
        required: true,
        type: Object
    },
    tags: Array
});
const emit = defineEmits(['save', 'remove']);

const onSave = (value) => {
    props.exercise.dialog = false;
    props.exercise.edit = false;
    emit('save', value);
}
const onCancel = () => {
    props.exercise.dialog = false;
    props.exercise.edit = false;
}
const onRemove = () => {
    props.exercise.dialog = false;
    props.exercise.edit = false;
    emit('remove');
}
</script>
