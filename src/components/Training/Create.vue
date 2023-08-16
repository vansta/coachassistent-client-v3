<template>
    <v-container>
        <v-card :loading="loading.get">
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="training.name" :label="t('field.name')" :readonly="!(can('update', training, 'name') || can('create', training, 'name'))" outlined dense></v-text-field>
                    </div>
                    <v-btn :disabled="!(can('update', training, 'shareability') || can('create', training, 'shareability'))" icon="mdi-cog" variant="text" @click="showSharebility = !showSharebility">
                        <v-icon>mdi-cog</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.shareability')"></v-tooltip>
                    </v-btn>
                    <v-btn :disabled="!(can('update', training) || can('create', training))" icon="mdi-content-save" variant="text" @click="save" :loading="loading.save">
                        <v-icon>mdi-content-save</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.save')"></v-tooltip>
                    </v-btn>
                    <v-btn v-if="training.id" :disabled="!can('delete', training)" icon="mdi-delete" color="negative" variant="text" @click="remove" :loading="loading.remove">
                        <v-icon>mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                    </v-btn>
                </div>
            </v-card-title>
            <v-card-text>
                <editor v-model="training.description" api-key="no-api-key"/>
            </v-card-text>
            <v-card-text v-if="showSharebility">
                <shareability v-model="training"></shareability>
            </v-card-text>
        </v-card>
        <v-row>
            <v-col>
                <draggable v-model="training.segments" group="segments" item-key="id">
                    <template #header>
                        <v-alert type="info" variant="tonal">
                            {{t('drag_to')}}
                        </v-alert>
                        
                    </template>
                    <template #item="{ element }">
                        <segment-view :segment="element"></segment-view>
                    </template>
                </draggable>
            </v-col>
            <v-col v-show="(can('update', training) || can('create', training))">
                <draggable v-model="segments" group="segments" item-key="id">
                    <template #header>
                        <v-alert variant="tonal">
                            {{t('drag_from')}}
                        </v-alert>
                        <!-- <exercise-search @search="getExercises"></exercise-search> -->
                    </template>
                    <template #item="{ element }">
                        <segment-view :segment="element"></segment-view>
                    </template>
                </draggable>
            </v-col>
        </v-row>

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, inject } from 'vue';

import SegmentView from '@/components/Segment/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue'
import Draggable from 'vuedraggable';
import Editor from '@tinymce/tinymce-vue';
import Shareability from '@/components/common/Sharebility.vue';

import { useToast } from 'vue-toastification'
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useConfirmDialog } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const api = inject('api');

const toast = useToast();
const { can } = useAbility();
const authStore = useAuthenticationStore();
const router = useRouter();
const { t } = useI18n();

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const props = defineProps({
    id: String
})

const training = ref({
    description: '',
    segments: [],
    sharingLevel: '0',
    editorIds: [authStore.user?.id],
    constructor: { modelName: 'shareable' }
});
const segments = ref([]);
const showSharebility = ref(false);
const loading = ref({
    get: false,
    save: false,
    remove: false
})

const getSegments = () => {
    loading.value.get = true;
    api.getAllSegments()
        .then((data) => segments.value = data.items)
        .finally(() => loading.value.get = false)
}

const save = () => {
    loading.value.save = true;
    if (!training.value.id) {
        api.postTraining(training.value)
            .then(resp => {
                training.value.id = resp;
                router.push({ name: 'Trainings' })
            })
            .catch(err => toast.error(err))
            .finally(() => loading.value.save = false);
    }
    else {
        api.putTraining(training.value)
            .then(() => router.push({ name: 'Trainings' }))
            .catch(err => toast.error(err))
            .finally(() => loading.value.save = false);
    }
}

const remove = async () => {
    const { data } = await reveal();
    console.log(data);
    if (data) {
        loading.value.remove = true;
        api.deleteTraining((training.value).id)
            .then(() => router.push({ name: 'Trainings'} ))
            .finally(() => loading.value.remove = false);
    }
}

const startToDrag = (evt, item) => {
    if (evt.dataTransfer !== null) {
        evt.dataTransfer.dropEffect = 'link';
        evt.dataTransfer.effectAllowed = 'link';
        evt.dataTransfer.setData('id', item.id.toString())
    }
}

const drop = async (evt, remove) => {
    const segmentId = evt.dataTransfer?.getData('id');
    if (remove) {
        const index = training.value.segments.findIndex(e => e.id === segmentId);
        training.value.segments.splice(index, 1);
    }
    else {
        const segment = segments.value.find(e => e.id === segmentId);
        training.value.segments.push(segment)
    }
}

const availableSegments = computed(() => {
    return segments.value.filter(e => training.value.segments.findIndex(x => x.id === e.id) < 0);
})

if (props.id) {
    api.getTraining(props.id)
        .then((data) => training.value = data)
}
getSegments();

</script>

<style scoped>
  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
    padding-bottom: 50px;
  }
  
</style>
