<template>
    <v-card min-height="300" max-height="500" max-width="500">
        <v-card-title>
            <div class="d-flex">
                <div class="flex-grow-1 text-h6 text-left text-capitalize">{{ training.name }}</div>
                <v-btn icon="mdi-pencil" flat :to="{ name: 'EditTraining', params: { id: training.id }}"></v-btn>
                <v-btn icon="mdi-delete" flat @click="remove"></v-btn>
            </div>
            
        </v-card-title>
        <v-card-text>
            <div v-html="training.description"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-list>
                <v-list-group v-for="(segment, index) in training.segments" :key="segment.id" :value="segment.id">
                    <template v-slot:activator="{ props }">
                        <v-list-item
                            v-bind="props"
                        >
                            <v-list-item-title>
                                {{ index + 1 }} {{ segment.name }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-list-item
                        v-for="exercise in segment.exercises"
                        :key="exercise"
                        :title="exercise"
                        :value="exercise"
                    ></v-list-item>
                </v-list-group>
            </v-list>
        </v-card-text>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-card>
</template>

<script setup>
import { inject } from 'vue';
import { useConfirmDialog } from '@vueuse/core';
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const api = inject('api');
const props = defineProps({
    training: Object
})
const emit = defineEmits(['remove']);

const remove = async () =>  {
    const { data } = await reveal();
    if (data) {
        api.deleteTraining(props.training.id)
            .then(() => emit('remove'));
    } 
}

</script>
