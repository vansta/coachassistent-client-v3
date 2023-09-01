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
