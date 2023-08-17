<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col>
                        <v-text-field v-model="search.search" :label="t('field.name')" @update:model-value="emitSearch" clearable hide-details="auto" prepend-icon="mdi-magnify"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-autocomplete v-model="search.tags" :label="t('field.tags')" :items="tags" multiple append-inner-icon="mdi-refresh" @click:appendInner="getTags" @update:modelValue="emitSearch" clearable hide-details="auto" chips></v-autocomplete>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

var searchTimeOut;
const api = inject('api');

const emit = defineEmits(['search']);
const search = ref({ search: '', tags: [] });
const tags = ref([]);

const emitSearch = () => {
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => {
        emit('search', search.value);
    }, 500);
}
const getTags = () => {
    api.getTags()
                .then(resp => tags.value = resp.data);
}
getTags();
</script>