<template>
    <c-data-iterator :cols="4" :items="trainings" :loading="loading" :totalCount="totalCount">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'CreateTraining' }" color="primary">{{ t('action.create') }}</v-btn>
            </div>
        </template>
        <template #search>
            <search @search="getTrainings"></search>
        </template>
        <template #item="{ item }">
            <overview-item :training="item" @remove="remove"></overview-item>
        </template>
    </c-data-iterator>
</template>

<script setup>
import { ref, inject } from 'vue'
import OverviewItem from '@/components/Training/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';
import Search from '@/components/Exercise/Search.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const api = inject('api');

const readonly = ref(true);
const trainings = ref([]);
const loading = ref(false);
const totalCount = ref(0);

const getTrainings = (search) => {
    loading.value = true;
            api.getAllTrainings(search)
                .then((data) => {
                    trainings.value = data.items;
                    totalCount.value = data.totalCount;
                })
                .finally(() => loading.value = false);
}
const remove = () => {
    getTrainings();
}

getTrainings();
</script>
