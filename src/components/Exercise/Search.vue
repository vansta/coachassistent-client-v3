<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row dense>
                    <v-col cols="2" md="1">
                        <v-btn icon variant="text" @click="onOnlyFavorites">
                            <v-icon v-if="modelValue.onlyFavorites">mdi-heart</v-icon>
                            <v-icon v-else>mdi-heart-outline</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="modelValue.search" :label="t('field.name')" @update:model-value="emitSearch" clearable hide-details="auto" prepend-inner-icon="mdi-magnify"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-autocomplete v-model="modelValue.tags" :label="t('field.tags')" :items="tags" multiple append-inner-icon="mdi-refresh" @click:appendInner="getTags" @update:modelValue="emitSearch" clearable hide-details="auto" chips></v-autocomplete>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
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

getTags();
</script>