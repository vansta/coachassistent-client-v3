<template>
    <c-data-iterator :cols="4" :items="segments" :loading="loading" :totalCount="totalCount">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'CreateSegment' }" color="primary" :disabled="!can('create', 'shareable')" prepend-icon="mdi-plus">{{t('action.create')}}</v-btn>
            </div>
        </template>
        <template #search>
            <search @search="getSegments"></search>
        </template>
        <template #item="{ item }">
            <overview-item :segment="item" @remove="getSegments"></overview-item>
        </template>
    </c-data-iterator>
</template>

<script setup>
import { inject, ref } from 'vue';
import OverviewItem from '@/components/Segment/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';
import Search from '@/components/Exercise/Search.vue';

const api = inject('api');

import { useI18n } from 'vue-i18n';
import { useAbility } from '@casl/vue';

const { t } = useI18n();
const { can } = useAbility();

const segments = ref([]);
const loading = ref(false);
const totalCount = ref(0);

const getSegments = (search) => {
    loading.value = true;
    api.getAllSegments(search)
        .then((data) => {
            segments.value = data.items;
            totalCount.value = data.totalCount;
        })
        .finally(() => loading.value = false);
}

getSegments();
</script>
