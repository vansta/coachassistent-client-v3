<template>
    <v-container class="pa-0 pa-sm-4">
        <create :id="id" @save="router.push({ name: 'Segments' })" @remove="router.push({ name: 'Segments' })"></create>
    </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Create from '@/components/Segment/Create.vue';
const router = useRouter();

const props = defineProps({
    id: String
});
</script>