<template>
    <v-card class="full-height">
        <v-card-title>
            <div class="d-flex">
                <div class="flex-grow-1 text-h6 text-left text-capitalize">{{ training.name }}</div>

                
                <v-btn v-if="can('update', training)" icon="mdi-pencil" variant="text" :to="{ name: 'EditTraining', params: { id: training.id }}">
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.edit')"></v-tooltip>
                </v-btn>
                <v-btn v-else :disabled="!can('read', training)" icon="mdi-eye" variant="text" :to="{ name: 'Training', params: { id: training.id }}">
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.view')"></v-tooltip>
                </v-btn>
                <v-btn v-if="can('delete', training)" icon="mdi-delete" variant="text" @click="remove">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
                <v-btn :disabled="!authStore.isAuthenticated" icon="mdi-heart" variant="text" @click="onFavorite" :loading="loading.favorite">
                    <v-icon v-if="training.isFavorite">mdi-heart</v-icon>
                    <v-icon v-else>mdi-heart-outline</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.favorite')"></v-tooltip>
                </v-btn>
            </div>
            <div class="d-flex">
                <v-chip v-for="tag in training.tags" :key="tag" class="mr-1">{{ tag }}</v-chip>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <div v-html="training.description"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-expansion-panels multiple>
                    <v-expansion-panel v-for="(segment, index) in training.segments" :key="index" :value="segment.id" elevation="0">
                        <v-expansion-panel-title class="font-weight-medium">
                            <span class="mr-3">{{ index + 1 }}</span>
                            <span class="text-capitalize">{{ segment.name }}</span>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-sheet v-for="(exercise, exerciseIndex) in segment.exercises" :key="exerciseIndex" rounded class="ma-3">
                                <span class="mr-3">{{ exerciseIndex + 1 }}</span>
                                <span class="text-capitalize">{{ exercise }}</span>
                            </v-sheet>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useConfirmDialog } from '@vueuse/core';
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '@/plugins/pinia';
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
const { can } = useAbility();
const { t } = useI18n();
const authStore = useAuthenticationStore();

const api = inject('api');
const props = defineProps({
    training: Object
})
const emit = defineEmits(['remove']);

const loading = ref({
    favorite: false
});

const remove = async () =>  {
    const { data } = await reveal();
    if (data) {
        api.deleteTraining(props.training.id)
            .then(() => emit('remove'));
    } 
}
const onFavorite = () => {
    loading.favorite = true;
    api.putFavorite(props.training.shareableId)
        .then(() => {
            props.training.isFavorite = !props.training.isFavorite;
        })
        .finally(() => loading.value.favorite = false);
        }
</script>


<style>
.full-height {
  height: 100%;
}
</style>
