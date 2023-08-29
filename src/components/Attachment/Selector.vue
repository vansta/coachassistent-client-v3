<template>
    <div>
        <v-carousel v-model="current" @click.stop height="320" show-arrows="hover" cycle>
            <v-carousel-item max-height="250" v-for="(attachment, index) in modelValue.attachments" :key="index" :name="attachment" :src="api.getAttachmentLink(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="text" @click="onRemove(modelValue.attachments, index)"></v-btn>
            </v-carousel-item>
            <v-carousel-item max-height="250" v-for="(attachment, index) in addedAttachments" :key="index" :name="attachment" :src="URL.createObjectURL(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="text" @click="onRemove(addedAttachments, index)"></v-btn>
            </v-carousel-item>
        </v-carousel>
        <v-btn block @click="open"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
</template>

<script setup>
import { useFileDialog } from "@vueuse/core";
import { inject, ref } from "vue"
const { open, onChange } = useFileDialog();

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
const current = ref(0);

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
</script>