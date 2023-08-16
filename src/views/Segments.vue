<template>
    <c-data-iterator :cols="4" :items="segments" :loading="loading" :totalCount="totalCount">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'CreateSegment' }" color="primary">Create segment</v-btn>
            </div>
        </template>
        <template #search>
            <search @search="getSegments"></search>
        </template>
        <template #item="{ item }">
            <overview-item :segment="item" @remove="remove"></overview-item>
        </template>
    </c-data-iterator>
</template>

<script>
import OverviewItem from '@/components/Segment/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue';
import Search from '@/components/Exercise/Search.vue';

import { defineComponent } from 'vue'


export default defineComponent({
  components: { OverviewItem, CDataIterator, Search },
    setup() {
        // const exercises: Array<IExercise> = ref([]);
      return {
        //   exercises
      }  
    },
    created () {
        this.getSegments();
    },
    data: () => ({
        readonly: true,
        segments: [],
        loading: false,
        totalCount: 0
    }),
    methods: {
        getSegments (search) {
            this.loading = true;
            this.$api.getAllSegments(search)
                .then((data) => {
                    this.segments = data.items;
                    this.totalCount = data.totalCount;
                })
                .finally(() => this.loading = false);
        },

        remove () {
            this.getSegments();
        }
    }
})
</script>
