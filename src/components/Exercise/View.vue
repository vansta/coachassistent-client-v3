<template>
    <layout>
        <template #name>
            <div class="d-flex">
                <div class="text-h6 text-left text-capitalize flex-grow-1">{{ exercise.name }}</div>
                <v-btn v-if="mode == 'edit'" :disabled="!authStore.isAuthenticated" icon="mdi-content-copy" variant="text" @click="onCopy">
                    <v-icon>mdi-content-copy</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.copy')"></v-tooltip>
                </v-btn>
                <v-btn v-if="authStore.isAuthenticated && can('update', exercise)" icon="mdi-pencil" variant="text" @click="emit('edit')">
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.edit')"></v-tooltip>
                </v-btn>
                <v-btn :disabled="!authStore.isAuthenticated" icon="mdi-heart" variant="text" @click="onFavorite" :loading="loading.favorite" color="heart">
                    <v-icon v-if="exercise.isFavorite">mdi-heart</v-icon>
                    <v-icon v-else>mdi-heart-outline</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.favorite')"></v-tooltip>
                </v-btn>
                <v-btn v-if="mode == 'select'" :icon="collapse ? 'mdi-chevron-down' : 'mdi-chevron-up'" variant="text" @click="collapse = !collapse"></v-btn>
            </div>
            <div class="d-flex">
                <v-chip v-for="tag in exercise.tags" :key="tag" class="mr-1">{{ tag }}</v-chip>
            </div>
        </template>
        <template #description>
            <div v-show="!collapse">
                <div class="ma-6">
                    <div v-html="exercise.description"></div>
                </div>
                
                <v-carousel v-show="exercise.attachments.length > 0" @click.stop height="320" show-arrows="hover" cycle continuous hide-delimiter-background>
                    <v-carousel-item max-height="250" v-for="attachment in exercise.attachments" :key="attachment" :name="attachment" :src="$api.getAttachmentLink(attachment)">
                    </v-carousel-item>
                </v-carousel>
            </div>
        </template>
    </layout>
</template>

<script setup>
import { useAuthenticationStore } from '@/plugins/pinia';
import { useAbility } from '@casl/vue';

import Layout from '@/components/Exercise/Layout.vue'
import { useI18n } from 'vue-i18n';
import { ref, inject } from 'vue';

const authStore = useAuthenticationStore();
const { can } = useAbility();
const { t } = useI18n(); 
const api = inject('api');
const props = defineProps({
    exercise: {
        required: true,
        type: Object
    },
    mode: {
        type: String,
        default: 'edit'
    }
});

const emit = defineEmits(['edit', 'copy']);

const collapse = ref(props.mode !== 'edit');
const loading = ref({
    favorite: false
});

const onCopy = () => {
    api.copyExercise(props.exercise.id)
        .then(resp => emit('copy', resp.data));
}
const onFavorite = () => {
    loading.value.favorite = true;
    api.putFavorite(props.exercise.shareableId)
        .then(() => {
            props.exercise.isFavorite = !props.exercise.isFavorite;
        })
        .finally(() => loading.value.favorite = false);
}
</script>
