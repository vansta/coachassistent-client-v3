<template>
    <div>
        <v-btn block @click="open" class="mb-2">
            <v-icon start>mdi-attachment-plus</v-icon>
            <div>{{ t('add_attachment') }}</div>
        </v-btn>
        <v-carousel v-model="current" @click.stop height="320" show-arrows="hover" cycle continuous>
            <v-carousel-item max-height="250" v-for="(attachment, index) in modelValue.attachments" :key="index" :name="attachment" :src="api.getAttachmentLink(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="text" @click="onRemove(modelValue.attachments, index)">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
            </v-carousel-item>
            <v-carousel-item max-height="250" v-for="(attachment, index) in addedAttachments" :key="index" :name="attachment" :src="createURL(attachment)">
                <v-btn v-if="!readonly" icon="mdi-delete" variant="text" @click="onRemove(addedAttachments, index)">
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom" :text="t('tooltip.remove')"></v-tooltip>
                </v-btn>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>

<script setup>
import { useFileDialog } from "@vueuse/core";
import { inject, ref } from "vue"
import { useI18n } from "vue-i18n";
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

const createURL = (attachment) => URL.createObjectURL(attachment)
</script>