<template>
    <v-container class="pa-0 pa-sm-4">
        <v-card :loading="loading.get">
            <v-card-title>
                {{ t('training') }}
            </v-card-title>
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
                <!-- <editor v-model="training.description" api-key="no-api-key"/> -->
                <quill-editor v-if="(can('update', training, 'description') || can('create', training, 'description'))" v-model:content="training.description" theme="snow" contentType="html" :placeholder="t('field.description')"></quill-editor>
                <div v-else v-html="training.description"></div>

                <v-row no-gutters dense>
                    <v-col cols="12" sm="6">
                        <v-combobox v-model="training.tags" :label="t('field.tags')" :items="tags" multiple chips class="mt-3" hide-details="auto"></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model="training.level" :label="t('field.level')" :items="levels" class="mt-3" :item-title="(option) => t(`level.${option.title}`)" hide-details="auto"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text v-if="showSharebility">
                <shareability v-model="training"></shareability>
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-subtitle class="d-flex justify-space-between align-center">
                <span>{{ t('segments') }}</span>
                <span>
                    <v-btn @click="showSelectSegments = !showSelectSegments" icon="mdi-magnify" variant="text" color="black">
                        <v-icon v-if="!showSelectSegments">mdi-magnify</v-icon>
                        <v-icon v-else>mdi-magnify-close</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.search')"></v-tooltip>
                    </v-btn>
                    <v-btn :to="{ name: 'CreateSegment' }" icon="mdi-plus" variant="text" color="black">
                        <v-icon>mdi-plus</v-icon>
                        <v-tooltip activator="parent" location="bottom" :text="t('tooltip.add')"></v-tooltip>
                    </v-btn>
                </span>
            </v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col>
                        <draggable v-model="selectedSegments" group="segments" item-key="id">
                            <template #item="{ element }">
                                <drag :element="element" :tags="tags" class="mt-1">
                                    <template #dialog>
                                        <segment-view :segment="element"></segment-view>
                                    </template>
                                </drag>                     
                            </template>
                        </draggable>
                    </v-col>
                    <v-col cols="12" sm="6" v-show="(can('update', training) || can('create', training)) && showSelectSegments">
                        <draggable v-model="segments" group="segments" item-key="id">
                            <template #header>
                                <exercise-search v-show="showSelectSegments" v-model="search" @update:model-value="getSegments"></exercise-search>
                            </template>
                            <template #item="{ element }">
                                <drag :element="element" :tags="tags" class="mt-1">
                                    <template #dialog>
                                        <segment-view :segment="element"></segment-view>
                                    </template>
                                </drag>
                            </template>
                        </draggable>
                    </v-col>
                </v-row>
                
            </v-card-text>
        </v-card>
        <!-- <v-row v-show="createSegment" class="mt-3">
            <v-col>
                <segment-create @save="onSegmentSave" @remove="onSegmentRemove"></segment-create>
            </v-col>
        </v-row>
        <v-row v-show="!createSegment">
            <v-col>
                <draggable v-model="selectedSegments" group="segments" item-key="id">
                    <template #header>
                        <v-alert color="info" variant="tonal" density="compact">
                            <div class="d-flex justify-space-between align-center">
                                <span>{{t('drag_to')}}</span>
                                <span><v-btn icon="mdi-plus" variant="text" size="small" @click="createSegment = true"></v-btn></span>
                            </div>
                        </v-alert>
                        
                    </template>
                    <template #item="{ element }">
                        <segment-view :segment="element" class="mt-1"></segment-view>
                    </template>
                </draggable>
            </v-col>
            <v-col cols="4" v-show="(can('update', training) || can('create', training))">
                <draggable v-model="segments" group="segments" item-key="id">
                    <template #header>
                        <v-alert variant="tonal">
                            <div class="d-flex justify-space-between align-center">
                                <span>{{t('drag_from')}}</span>
                            </div>
                        </v-alert>
                        <exercise-search v-model="search" @update:model-value="getSegments"></exercise-search>
                    </template>
                    <template #item="{ element }">
                        <segment-view :segment="element" class="mt-1"></segment-view>
                    </template>
                </draggable>
            </v-col>
        </v-row> -->

        <confirm-dialog :isRevealed="isRevealed" @confirm="confirm" @cancel="cancel"></confirm-dialog>
    </v-container>
</template>

<script setup>
import { ref, inject, computed } from 'vue';

import SegmentView from '@/components/Segment/OverviewItem.vue';
import Draggable from 'vuedraggable';
import Shareability from '@/components/common/Sharebility.vue';
// import SegmentCreate from '@/components/Segment/Create.vue';
import ExerciseSearch from '@/components/Exercise/Search.vue';
import Drag from '@/components/common/Drag.vue';

import { useToast } from 'vue-toastification';
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';
import { useConfirmDialog } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { levels } from '@/services/defaults.js';

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
const tags = ref([]);
const createSegment = ref(false);
const selectedSegmentObjects = ref([]);
const search = ref({ search: '', tags: [], onlyFavorites: false });
const showSelectSegments = ref(!props.id);

const getSegments = () => {
    loading.value.get = true;
    api.getAllSegments(search.value)
        .then((data) => {
            segments.value = data.items;
            setSelectedSegments();
        })
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
// const onSegmentSave = (id) => {
//     training.value.segments.push(id);
//     createSegment.value = false;
//     getSegments();
// }
const setSelectedSegments = () => {
    selectedSegmentObjects.value = segments.value.filter(s => training.value.segments.includes(s.id));
    segments.value = segments.value.filter(s => !training.value.segments.includes(s.id))
}

if (props.id) {
    api.getTraining(props.id)
        .then((data) => {
            training.value = data;
            setSelectedSegments();
        })
}
getSegments();
api.getTags()
    .then(resp => tags.value = resp.data);


const selectedSegments = computed({
    get () {
        return selectedSegmentObjects.value;
    },
    set (value) {
        selectedSegmentObjects.value = value;//.push(value.id);
        training.value.segments = value.map(s => s.id);
    }
})
</script>
