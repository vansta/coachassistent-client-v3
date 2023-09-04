<template>
    <v-card>
        <v-card-text class="d-flex justify-space-between">
            <!-- <v-icon>mdi-plus</v-icon> -->
            {{ exercise.name }}
            <v-btn icon variant="text" @click="showDialog = !showDialog">
                <v-icon>mdi-eye</v-icon>
            </v-btn>
        </v-card-text>
        
        

        <v-dialog v-model="showDialog">
            <exercise-view v-if="!exercise.edit" :exercise="exercise" @edit="exercise.edit = true"></exercise-view>
            <exercise-edit v-else :exercise="exercise" @save="onSave" @cancel="onCancel" :tags="tags"></exercise-edit>
        </v-dialog>
    </v-card>
</template>

<script setup>
import ExerciseView from '@/components/Exercise/View.vue';
import ExerciseEdit from '@/components/Exercise/Edit.vue';
// import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

// const authStore = useAuthenticationStore();
// const { can } = useAbility();
// const { t } = useI18n(); 
// const api = inject('api');
const props = defineProps({
    exercise: {
        required: true,
        type: Object
    },
    tags: Array
    // mode: {
    //     type: String,
    //     default: 'edit'
    // }
});
const emit = defineEmits(['save']);
const showDialog = ref(false);

const onSave = () => {
    showDialog.value = false;
    emit('save');
}
const onCancel = () => {
    showDialog.value = false;
}
// const collapse = ref(props.mode !== 'edit');
// const loading = ref({
//     favorite: false
// });

// const onCopy = () => {
//     api.copyExercise(props.exercise.id)
//         .then(resp => emit('copy', resp.data));
// }
// const onFavorite = () => {
//     loading.value.favorite = true;
//     api.putFavorite(props.exercise.shareableId)
//         .then(() => {
//             props.exercise.isFavorite = !props.exercise.isFavorite;
//         })
//         .finally(() => loading.value.favorite = false);
// }
</script>
