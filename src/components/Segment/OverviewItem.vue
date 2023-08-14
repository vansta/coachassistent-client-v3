<template>
    <v-card min-height="300" max-height="500" max-width="500">
        <v-card-title>
            <div class="d-flex">
                <div class="flex-grow-1 text-h6 text-left text-capitalize">{{ segment.name }}</div>
                <v-btn :disabled="!can('read', segment)" icon="mdi-eye" variant="text" :to="{ name: 'Segment', params: { id: segment.id }}"></v-btn>
                <v-btn :disabled="!can('update', segment)" icon="mdi-pencil" variant="text" :to="{ name: 'EditSegment', params: { id: segment.id }}"></v-btn>
                <v-btn :disabled="!can('delete', segment)" icon="mdi-delete" variant="text" @click="remove"></v-btn>
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
import { defineAbility } from '@casl/ability';
import { useAbility } from '@casl/vue';

export default defineComponent({
    name: 'OverviewItem',
    props: {
        segment: {

        }
    },
    components: {
        
    },
    setup() {
        const { can } = useAbility();
        return {
            can
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
