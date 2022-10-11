<template>
    <v-card class="my-card">
        <v-card-title>
            <div class="d-flex">
                <div class="flex-grow-1 text-h6 text-left text-capitalize">{{ segment.name }}</div>
                <v-btn icon="mdi-pencil" flat :to="{ name: 'EditSegment', params: { id: segment.id }}"></v-btn>
                <v-btn icon="mdi-delete" flat @click="remove"></v-btn>
            </div>
            
        </v-card-title>
        <v-card-text>
            <div v-html="segment.description"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-list>
                <v-list-item v-for="exercise in segment.exercises" :key="exercise">
                    <v-list-item-title>
                        {{ exercise }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'OverviewItem',
    props: {
        segment: {

        }
    },
    components: {
        
    },
    setup() {
        return {
            
        }
    },
    methods: {
        // edit (id) {
        //     this
        // },
        remove () {
            this.$api.deleteSegment((this.segment).id)
                .then(() => this.$emit('remove'));
        }
    }
})
</script>
