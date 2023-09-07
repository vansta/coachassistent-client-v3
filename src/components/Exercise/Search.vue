<template>
    <v-form>
        <v-row dense>
            <v-col cols="12" class="d-flex">
                <div>
                    <v-btn icon variant="text" @click="onOnlyFavorites" color="heart">
                        <v-icon v-if="modelValue.onlyFavorites">mdi-heart</v-icon>
                        <v-icon v-else>mdi-heart-outline</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" @click="onOnlyOwned">
                        <v-icon v-if="modelValue.onlyOwned">mdi-account-wrench</v-icon>
                        <v-icon v-else>mdi-account-wrench-outline</v-icon>
                    </v-btn>
                </div>
                
                <v-text-field v-model="modelValue.search" :label="t('search')" @update:model-value="emitSearch" clearable hide-details="auto" prepend-inner-icon="mdi-magnify" class="flex-grow-1"></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-autocomplete v-model="modelValue.tags" :label="t('field.tags')" :items="tags" multiple append-inner-icon="mdi-refresh" @click:appendInner="getTags" @update:modelValue="emitSearch" clearable hide-details="auto" chips prepend-inner-icon="mdi-tag"></v-autocomplete>
            </v-col>
            <v-col cols="6" class="mt-n3">
                <v-select v-model="modelValue.level" :label="t('field.level')" :items="levels" class="mt-3" :item-title="(option) => t(`level.${option.title}`)" hide-details="auto" @update:model-value="emitSearch" clearable prepend-inner-icon="mdi-star-settings"></v-select>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { levels } from '@/services/defaults.js';

const { t } = useI18n();

var searchTimeOut;
const api = inject('api');

const props = defineProps({
    modelValue: {
        type: Object,
        default: { search: '', tags: [], onlyFavorites: false }
    }
});
const emit = defineEmits(['update:modelValue']);
// const search = ref({ search: '', tags: [], onlyFavorites: false });
const tags = ref([]);

const emitSearch = () => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => {
        emit('update:modelValue', props.modelValue);
    }, 500);
}
const getTags = () => {
    api.getTags()
                .then(resp => tags.value = resp.data);
}
const onOnlyFavorites = () => {
    props.modelValue.onlyFavorites = !props.modelValue.onlyFavorites;
    emit('update:modelValue', props.modelValue);
}
const onOnlyOwned = () => {
    props.modelValue.onlyOwned = !props.modelValue.onlyOwned;
    emit('update:modelValue', props.modelValue);
}

getTags();
</script>