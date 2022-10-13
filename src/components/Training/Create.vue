<template>
    <v-container>
        <v-card>
            <v-card-title>
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <v-text-field v-model="training.name" label="Name" outlined dense></v-text-field>
                    </div>
                    <v-btn icon="mdi-content-save" flat @click="save"></v-btn>
                </div>
                
            </v-card-title>
            <v-card-text>
                <editor v-model="training.description" api-key="no-api-key"/>
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

import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'

export default defineComponent({
    components: { SegmentView, CDataIterator, Editor },
    setup() {
        const toast = useToast();
        return { toast }
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
                segments: []
            },
            segments: [],

            loading: false,
            splitterValue: 50,
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
