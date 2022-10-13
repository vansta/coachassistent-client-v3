<template>
    <c-data-iterator :cols="4" :items="segments" :loading="loading">
        <template #header>
            <div class="d-flex justify-end">
                <v-btn :to="{ name: 'EditSegment' }" color="primary">Create segment</v-btn>
            </div>
        </template>
        <template #item="{ item }">
            <overview-item :segment="item" @remove="remove"></overview-item>
        </template>
    </c-data-iterator>
</template>

<script>
import OverviewItem from '@/components/Segment/OverviewItem.vue'
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
        this.getSegments();
    },
    data: () => ({
        readonly: true,
        segments: [],
        loading: false
    }),
    methods: {
        getSegments () {
            this.loading = true;
            this.$api.getAllSegments()
                .then((data) => this.segments = data.items)
                .finally(() => this.loading = false);
        },

        remove () {
            this.getSegments();
        }
    }
})
</script>
