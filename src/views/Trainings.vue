<template>
    <c-data-iterator v-model="pageInfo" :cols="width > 500 ? 12 / Math.floor(width / 500) : 1" :items="trainings" @update:model-value="getTrainings">
        <!-- <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'CreateTraining' }" color="primary" :disabled="!(authStore.isAuthenticated && can('create', 'shareable'))" prepend-icon="mdi-plus">{{ t('action.create') }}</v-btn>
            </div>
        </template> -->
        <template #search>
            <search v-model="search" @update:model-value="onSearch"></search>
        </template>
        <template #item="{ item }">
            <overview-item :training="item" @remove="remove"></overview-item>
        </template>
    </c-data-iterator>

    <v-btn :to="{ name: 'CreateTraining' }" color="primary" :disabled="!(authStore.isAuthenticated && can('create', 'shareable'))" icon="mdi-plus" position="fixed" location="bottom right" class="ma-2 ma-md-6" size="large">
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="left" :text="t('tooltip.add')"></v-tooltip>
    </v-btn>
</template>

<script setup>
import { ref, inject } from 'vue'
import OverviewItem from '@/components/Training/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';
import Search from '@/components/Exercise/Search.vue';
import { useI18n } from 'vue-i18n';
import { useAbility } from '@casl/vue';
import { useWindowSize } from '@vueuse/core';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { getDefaultSearch } from '@/services/defaults.js';

const { can } = useAbility();
const { t } = useI18n();
const { width } = useWindowSize();
const authStore = useAuthenticationStore();

const api = inject('api');

const trainings = ref([]);
const search = ref(getDefaultSearch(authStore.user));
const pageInfo = ref({ itemsPerPage: 6, currentPage: 1, totalCount: 0, loading: false });

const getTrainings = () => {
    pageInfo.value.loading = true;
    api.getAllTrainings(search.value, pageInfo.value)
        .then((data) => {
            trainings.value = data.items;
            pageInfo.value.totalCount = data.totalCount;
        })
        .finally(() => pageInfo.value.loading = false);
}
const remove = () => {
    getTrainings();
}
const onSearch = () => {
    pageInfo.value.currentPage = 1;
    getTrainings();
}

getTrainings();
</script>
