<template>
    <v-card class="full-height">
        <v-card-title>
            <div class="d-flex">
                <div class="flex-grow-1 text-h6 text-left text-capitalize">{{ segment.name }}</div>
                
                <v-btn v-if="can('update', segment)" icon="mdi-pencil" variant="text" :to="{ name: 'EditSegment', params: { id: segment.id }}">
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.edit')"></v-tooltip>
                </v-btn>
                <v-btn v-else :disabled="!can('read', training)" icon="mdi-eye" variant="text" :to="{ name: 'Segment', params: { id: segment.id }}">
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.view')"></v-tooltip>
                </v-btn>
                <v-btn v-if="can('delete', segment)" icon="mdi-delete" variant="text" @click="remove">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
                <v-btn :disabled="!authStore.isAuthenticated" icon="mdi-heart" variant="text" @click="onFavorite" :loading="loading.favorite" color="heart">
                    <v-icon v-if="segment.isFavorite">mdi-heart</v-icon>
                    <v-icon v-else>mdi-heart-outline</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.favorite')"></v-tooltip>
                </v-btn>
            </div>
            <div class="d-flex">
                <v-chip v-for="tag in segment.tags" :key="tag" class="mr-1">{{ tag }}</v-chip>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <div v-html="segment.description"></div>
            
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-expansion-panels variant="popout" readonly>
                    <v-expansion-panel v-for="(exercise, index) in segment.exercises" :key="index" elevation="0">
                        <v-expansion-panel-title class="font-weight-medium">
                            <span class="mr-3">{{ index + 1 }}</span>
                            <span class="text-capitalize">{{ exercise }}</span>
                            <template #actions></template>
                        </v-expansion-panel-title>
                    </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-card>
</template>

<script setup>
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
import { useConfirmDialog } from '@vueuse/core';
import { ref, inject } from 'vue';
import { useAuthenticationStore } from '@/plugins/pinia';
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const api = inject('api');
const { can } = useAbility();
const { t } = useI18n();
const authStore = useAuthenticationStore();
const emit = defineEmits(['remove']);
const props = defineProps({
    segment: Object
})

const loading = ref({
    favorite: false
});

const remove = async () => {
    const { data } = await reveal();
    if (data) {
        api.deleteSegment(props.segment.id)
            .then(() => emit('remove'));
    } 
}
const onFavorite = () => {
    loading.favorite = true;
    api.putFavorite(props.segment.shareableId)
        .then(() => {
            props.segment.isFavorite = !props.segment.isFavorite;
        })
        .finally(() => loading.value.favorite = false);
        }
</script>

<style>
.full-height {
  height: 100%;
}
</style>