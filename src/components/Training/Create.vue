<template>
    <v-container>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="training.name" label="Name" outlined dense></v-text-field>
                    </div>
                    <v-btn :disabled="!(can('update', training, 'shareability') || can('create', training, 'shareability'))" icon="mdi-cog" flat round @click="showSharebility = !showSharebility"></v-btn>
                    <v-btn :disabled="!(can('update', training) || can('create', training))" icon="mdi-content-save" flat @click="save"></v-btn>
                    <v-btn v-if="training.id" :disabled="!can('delete', training)" icon="mdi-delete" color="negative" flat round @click="remove"></v-btn>
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
                <div class="drop-zone" @drop="drop($event)" @dragover.prevent @dragenter.prevent>
                    <segment-view v-for="segment in training.segments" :key="segment.id" class="q-ma-xs" :segment="segment"  :draggable="true" @dragstart="startToDrag($event, segment)"></segment-view>
                </div>
                
            </v-col>
            <v-col>
                <div class="drop-zone" @drop="drop($event, true)" @dragover.prevent @dragenter.prevent>
                <c-data-iterator :cols="12" :items="availableSegments">
                    <template #item="{ item }">
                        <segment-view v-if="!item.edit" class="q-ma-xs" :segment="item" :draggable="true" @dragstart="startToDrag($event, item)"></segment-view>
                    </template>
                </c-data-iterator>
                
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SegmentView from '@/components/Segment/OverviewItem.vue'
import CDataIterator from '@/components/common/CDataIterator.vue'
import Editor from '@tinymce/tinymce-vue';
import Shareability from '@/components/common/Sharebility.vue';

import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useAbility } from '@casl/vue';
import { useAuthenticationStore } from '@/plugins/pinia.js';

export default defineComponent({
    components: { SegmentView, CDataIterator, Editor, Shareability },
    setup() {
        const toast = useToast();
        const { can } = useAbility();
        const authStore = useAuthenticationStore();
        return { toast, can, authStore }
    },
    created () {
        if (this.id) {
            this.$api.getTraining(this.id)
                .then((data) => this.training = data)
        }
        this.getSegments();
    },
    props: {
        id: String
    },
    data () {
        return {
            training: {
                description: '',
                segments: [],
                editorIds: [this.authStore.user.id],
                constructor: { modelName: 'shareable' }
            },
            segments: [],

            loading: false,
            splitterValue: 50,
            showSharebility: false
        }
    },
    methods: {
        getSegments () {
            this.loading = true;
            this.$api.getAllSegments()
                .then((data) => this.segments = data.items)
                .finally(() => this.loading = false)
        },

        save () {
            if (!this.training.id) {
                this.$api.postTraining(this.training)
                    .then(resp => {
                        this.training.id = resp;
                        this.$router.push({ name: 'Trainings' })
                    })
                    .catch(err => this.toast.error(err));
            }
            else {
                this.$api.putTraining(this.training)
                    .then(() => this.$router.push({ name: 'Trainings' }))
                    .catch(err => this.toast.error(err));
            }
        },
        remove () {
            this.$api.deleteTraining((this.training).id)
                .then(() => this.$router.push({ name: 'Trainings'} ));
        },


        startToDrag (evt, item) {
            if (evt.dataTransfer !== null) {
                evt.dataTransfer.dropEffect = 'link';
                evt.dataTransfer.effectAllowed = 'link';
                evt.dataTransfer.setData('id', item.id.toString())
            }
            
        },
        async drop (evt, remove) {
            const segmentId = evt.dataTransfer?.getData('id');
            if (remove) {
                const index = this.training.segments.findIndex(e => e.id === segmentId);
                this.training.segments.splice(index, 1);
            }
            else {
                const segment = this.segments.find(e => e.id === segmentId);
                this.training.segments.push(segment)
            }
            
        }
    },
    computed: {
        availableSegments () {
            return this.segments.filter(e => this.training.segments.findIndex(x => x.id === e.id) < 0);
        }
    }
})
</script>

<style scoped>
  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
    padding-bottom: 50px;
  }
  
</style>
