<template>
    <v-container class="pa-0 pa-sm-4">
        <create :id="id" @save="onSave" @remove="router.push({ name: 'Segments' })"></create>
    </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useOfflineStore } from '@/plugins/pinia';
import Create from '@/components/Segment/Create.vue';
const router = useRouter();
const offlineStore = useOfflineStore();

const props = defineProps({
    id: String,
    fromTraining: [Boolean, String]
});

const onSave = (value) => {
    if (props.fromTraining) {
        offlineStore.pushSegment(value);
        router.push({ name: 'CreateTraining' });
    }
    else {
        router.push({ name: 'Segments' })
    }
}
</script>