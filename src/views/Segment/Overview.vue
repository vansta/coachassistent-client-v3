<template>
    <c-data-iterator v-model="pageInfo" :cols="width > 500 ? 12 / Math.floor(width / 500) : 1" :items="segments" @update:model-value="getSegments">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'CreateSegment' }" color="primary" :disabled="!(authStore.isAuthenticated && can('create', 'shareable'))" prepend-icon="mdi-plus">{{t('action.create')}}</v-btn>
            </div>
        </template>
        <template #search>
            <search v-model="search" @update-modelValue="onSearch"></search>
        </template>
        <template #item="{ item }">
            <overview-item :segment="item" @remove="getSegments"></overview-item>
        </template>
    </c-data-iterator>

    <v-btn :to="{ name: 'CreateSegment' }" color="primary" :disabled="!(authStore.isAuthenticated && can('create', 'shareable'))" icon="mdi-plus" position="fixed" location="bottom right" class="ma-2 ma-md-6" size="large">
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="left" :text="t('tooltip.add')"></v-tooltip>
    </v-btn>
</template>

<script setup>
import { inject, ref } from 'vue';
import OverviewItem from '@/components/Segment/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';
import Search from '@/components/Exercise/Search.vue';

const api = inject('api');

import { useI18n } from 'vue-i18n';
import { useAbility } from '@casl/vue';
import { useWindowSize } from '@vueuse/core';
import { useAuthenticationStore } from '@/plugins/pinia.js';

const { t } = useI18n();
const { can } = useAbility();
const { width } = useWindowSize();
const authStore = useAuthenticationStore();

const segments = ref([]);
const search = ref({ search: '', tags: [], onlyFavorites: false });
const pageInfo = ref({ itemsPerPage: 6, currentPage: 1, totalCount: 0, loading: false });

const getSegments = () => {
    pageInfo.value.loading = true;
    api.getAllSegments(search.value, pageInfo.value)
        .then((data) => {
            segments.value = data.items;
            pageInfo.value.totalCount = data.totalCount;
        })
        .finally(() => pageInfo.value.loading = false);
}
const onSearch = () => {
    pageInfo.value.currentPage = 1;
    getSegments();
}

getSegments();
</script>
