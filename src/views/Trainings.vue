<template>
    <c-data-iterator :cols="4" :items="trainings" :loading="loading">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'EditTraining' }" color="primary">Create training</v-btn>
            </div>
        </template>
        <template #item="{ item }">
            <overview-item :training="item" @remove="remove"></overview-item>
        </template>
    </c-data-iterator>
</template>

<script>
import OverviewItem from '@/components/Training/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';

import { defineComponent } from 'vue'


export default defineComponent({
  components: { OverviewItem, CDataIterator },
    setup() {
        // const exercises: Array<IExercise> = ref([]);
      return {
        //   exercises
      }  
    },
    created () {
        this.getTrainings();
    },
    data: () => ({
        readonly: true,
        trainings: [],
        loading: false
    }),
    methods: {
        getTrainings () {
            this.loading = true;
            this.$api.getAllTrainings()
                .then((data) => this.trainings = data.items)
                .finally(() => this.loading = false);
        },

        remove () {
            this.getTrainings();
        }
    }
})
</script>
