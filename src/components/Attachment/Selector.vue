<template>
    <div>
        <div class="d-flex justify-space-around mt-2">
            <v-btn @click="open" variant="text">
                <v-icon start>mdi-attachment-plus</v-icon>
                <div>{{ t('add_attachment') }}</div>
            </v-btn>
            <v-btn variant="text" @click="konvaDialog = !konvaDialog">
                <v-icon start>mdi-draw</v-icon>
                <div>{{ t('draw_attachment') }}</div>

            </v-btn>
        </div>
        
        <v-carousel v-model="current" @click.stop height="320" show-arrows="hover" cycle continuous hide-delimiter-background>
            <v-carousel-item max-height="250" v-for="(attachment, index) in modelValue.attachments" :key="index" :name="attachment" :src="api.getAttachmentLink(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="flat" @click="onRemove(modelValue.attachments, index)" color="error">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
            </v-carousel-item>
            <v-carousel-item max-height="250" v-for="(attachment, index) in addedAttachments" :key="index" :name="attachment" :src="createURL(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="flat" @click="onRemove(addedAttachments, index)" color="error">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
            </v-carousel-item>
            <v-carousel-item max-height="250" v-for="(attachment, index) in drawings" :key="index" :name="attachment" :src="attachment">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="flat" @click="onRemove(drawings, index)" color="error">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
            </v-carousel-item>
        </v-carousel>

        <v-dialog v-model="konvaDialog">
            <konva-board @save="onDrawSave"></konva-board>
        </v-dialog>
    </div>
</template>

<script setup>
import { useFileDialog } from "@vueuse/core";
import { inject, ref } from "vue"
import { useI18n } from "vue-i18n";

import KonvaBoard from '@/components/Drawing/KonvaBoard.vue';

const { open, onChange } = useFileDialog();
const { t } = useI18n();

const props = defineProps({
    modelValue: Object,
    readonly: {
        type: Boolean,
        default: true
    }
});
const emit = defineEmits(['update:modelValue']);

const api = inject('api');

const addedAttachments = ref([]);
const drawings = ref([]);
const current = ref(0);
const konvaDialog = ref(false);

onChange((files) => {
    addedAttachments.value.push(...files);
    current.value = addedAttachments.value.length + props.modelValue.attachments.length - 1;
    props.modelValue.addedAttachments = addedAttachments.value;
    emit('update:modelValue', props.modelValue);
});

const onRemove = (attachments, index) => {
    attachments.splice(index, 1);
    if (current.value > addedAttachments.value.length + props.modelValue.attachments.length - 1){
        current.value = addedAttachments.value.length + props.modelValue.attachments.length - 1;
    }
}

const onDrawSave = (uri) => {
    console.log('save', uri);
    drawings.value.push(uri);
    current.value = addedAttachments.value.length + props.modelValue.attachments.length + drawings.value.length - 1;
    props.modelValue.addedAttachments = addedAttachments.value;
    emit('update:modelValue', props.modelValue);

    konvaDialog.value = false;
}

const createURL = (attachment) => URL.createObjectURL(attachment)
</script>