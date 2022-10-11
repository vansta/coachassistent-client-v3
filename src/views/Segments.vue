<template>
    <c-data-iterator :cols="4" :items="segments">
        <template #header>
            <v-spacer></v-spacer>
            <v-btn :to="{ name: 'EditSegment' }">Create segment</v-btn>
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
        segments: []
    }),
    methods: {
        getSegments () {
            this.$api.getAllSegments()
                .then((data) => this.segments = data.items)
        },

        remove () {
            this.getSegments();
        }
    }
})
</script>
